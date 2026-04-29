import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { generateId } from "@/utils/id";
import type { InvoiceSubitemPreset } from "../presets/subitemPresets";
import type {
	InvoiceProfile,
	InvoiceProfileWithMeta,
} from "../profile/invoiceProfile";
import { deriveProfileLabel } from "../profile/invoiceProfile";

export interface InvoiceTitlePreset {
	id: string;
	title: string;
}

interface InvoicePresetsState {
	ratePresets: InvoiceSubitemPreset[];
	profilePresets: InvoiceProfileWithMeta[];
	titlePresets: InvoiceTitlePreset[];
	defaultProfileId: string | null;
}

interface InvoicePresetsActions {
	// Rate Presets Actions
	addRatePreset: (preset: Omit<InvoiceSubitemPreset, "id">) => void;
	updateRatePreset: (
		id: string,
		preset: Partial<Omit<InvoiceSubitemPreset, "id">>,
	) => void;
	deleteRatePreset: (id: string) => void;

	// Profile Presets Actions
	addProfilePreset: (
		profile: InvoiceProfile,
		options?: { isDefault?: boolean },
	) => void;
	updateProfilePreset: (
		id: string,
		profile: Partial<InvoiceProfile>,
		options?: { label?: string; isDefault?: boolean },
	) => void;
	deleteProfilePreset: (id: string) => void;
	setDefaultProfile: (id: string) => void;

	// Title Presets Actions
	addTitlePreset: (title: string) => void;
	updateTitlePreset: (id: string, title: string) => void;
	deleteTitlePreset: (id: string) => void;
}

type InvoicePresetsStore = InvoicePresetsState & InvoicePresetsActions;

export const useInvoicePresetsStore = create<InvoicePresetsStore>()(
	persist(
		(set) => ({
			ratePresets: [],
			profilePresets: [],
			titlePresets: [],
			defaultProfileId: null,

			// Rate Presets
			addRatePreset: (preset) =>
				set((state) => ({
					ratePresets: [...state.ratePresets, { ...preset, id: generateId() }],
				})),

			updateRatePreset: (id, updatedFields) =>
				set((state) => ({
					ratePresets: state.ratePresets.map((p) =>
						p.id === id ? { ...p, ...updatedFields } : p,
					),
				})),

			deleteRatePreset: (id) =>
				set((state) => ({
					ratePresets: state.ratePresets.filter((p) => p.id !== id),
				})),

			// Profile Presets
			addProfilePreset: (profile, options) =>
				set((state) => {
					const id = generateId();
					const isDefault =
						options?.isDefault ?? state.profilePresets.length === 0;
					const newProfile: InvoiceProfileWithMeta = {
						id,
						label: deriveProfileLabel(profile),
						isDefault,
						profile,
					};

					return {
						profilePresets: [...state.profilePresets, newProfile],
						defaultProfileId: isDefault ? id : state.defaultProfileId,
					};
				}),

			updateProfilePreset: (id, profileUpdates, options) =>
				set((state) => {
					const updatedProfiles = state.profilePresets.map((p) => {
						if (p.id !== id) return p;
						const updatedProfile = { ...p.profile, ...profileUpdates };
						return {
							...p,
							profile: updatedProfile,
							label: options?.label ?? deriveProfileLabel(updatedProfile),
							isDefault: options?.isDefault ?? p.isDefault,
						};
					});

					let nextDefaultId = state.defaultProfileId;
					if (options?.isDefault) {
						nextDefaultId = id;
						// Ensure only one profile is marked as default
						for (const p of updatedProfiles) {
							if (p.id !== id) p.isDefault = false;
						}
					}

					return {
						profilePresets: updatedProfiles,
						defaultProfileId: nextDefaultId,
					};
				}),

			deleteProfilePreset: (id) =>
				set((state) => {
					const filtered = state.profilePresets.filter((p) => p.id !== id);
					let nextDefaultId = state.defaultProfileId;
					if (nextDefaultId === id) {
						nextDefaultId = filtered.length > 0 ? filtered[0].id : null;
						if (nextDefaultId && filtered.length > 0) {
							filtered[0].isDefault = true;
						}
					}
					return {
						profilePresets: filtered,
						defaultProfileId: nextDefaultId,
					};
				}),

			setDefaultProfile: (id) =>
				set((state) => ({
					profilePresets: state.profilePresets.map((p) => ({
						...p,
						isDefault: p.id === id,
					})),
					defaultProfileId: id,
				})),

			// Title Presets
			addTitlePreset: (title) =>
				set((state) => ({
					titlePresets: [...state.titlePresets, { id: generateId(), title }],
				})),

			updateTitlePreset: (id, title) =>
				set((state) => ({
					titlePresets: state.titlePresets.map((p) =>
						p.id === id ? { ...p, title } : p,
					),
				})),

			deleteTitlePreset: (id) =>
				set((state) => ({
					titlePresets: state.titlePresets.filter((p) => p.id !== id),
				})),
		}),
		{
			name: "invoice-presets-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
