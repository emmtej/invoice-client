import { z } from "zod";
import { loadFromStorage, saveToStorage } from "@/utils/storage";

export type InvoiceProfile = {
	firstName: string;
	lastName: string;
	email: string;
};

export const profileSchema = z.object({
	firstName: z.string().trim().min(2, "First name is required"),
	lastName: z.string().trim().min(2, "Last name is required"),
	email: z.email({
		pattern:
			/^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i,
	}),
});

export type InvoiceProfileWithMeta = {
	id: string;
	label: string;
	isDefault: boolean;
	profile: InvoiceProfile;
};

export type ProfilesState = {
	profiles: InvoiceProfileWithMeta[];
	defaultProfileId?: string;
};

const PROFILES_STORAGE_KEY = "invoice-profiles";

const profileStorageSchema = z.object({
	profiles: z.array(
		z.object({
			id: z.string().default(""),
			label: z.string().default(""),
			isDefault: z.boolean().default(false),
			profile: z
				.object({
					firstName: z.string().default(""),
					lastName: z.string().default(""),
					email: z.string().default(""),
				})
				.default({ firstName: "", lastName: "", email: "" }),
		}),
	),
	defaultProfileId: z.string().optional(),
});

export const getTodayDateString = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const createProfileId = (): string => {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
		return crypto.randomUUID();
	}
	return `profile_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
};

export const deriveProfileLabel = (profile: InvoiceProfile): string => {
	const fullName = [profile.firstName, profile.lastName]
		.map((part) => part.trim())
		.filter(Boolean)
		.join(" ");

	if (fullName) return fullName;
	if (profile.email?.trim()) return profile.email.trim();
	return "Invoice profile";
};

export const getEmptyProfile = (): InvoiceProfile => ({
	firstName: "",
	lastName: "",
	email: "",
});

export const createProfileWithMeta = (
	profile: InvoiceProfile,
	options?: { makeDefault?: boolean },
): { state: ProfilesState; createdProfile: InvoiceProfileWithMeta } => {
	const id = createProfileId();
	const label = deriveProfileLabel(profile);
	const isDefault = options?.makeDefault ?? false;

	const createdProfile: InvoiceProfileWithMeta = {
		id,
		label,
		isDefault,
		profile,
	};

	const state: ProfilesState = {
		profiles: [createdProfile],
		defaultProfileId: isDefault ? id : undefined,
	};

	return { state, createdProfile };
};

export const getDefaultProfileFromState = (
	state: ProfilesState,
): InvoiceProfileWithMeta | null => {
	if (!state.profiles.length) return null;

	if (state.defaultProfileId) {
		const found = state.profiles.find((p) => p.id === state.defaultProfileId);
		if (found) return found;
	}

	return state.profiles[0] ?? null;
};

const EMPTY_STATE: ProfilesState = { profiles: [] };

export const loadProfilesFromStorage = (): ProfilesState => {
	const parsed = loadFromStorage(PROFILES_STORAGE_KEY, EMPTY_STATE, profileStorageSchema);
	if (!parsed.profiles.length) return EMPTY_STATE;

	const profiles: InvoiceProfileWithMeta[] = parsed.profiles.map((p) => ({
		id: p.id || createProfileId(),
		label: p.label.trim() || deriveProfileLabel(p.profile),
		isDefault: p.isDefault,
		profile: p.profile,
	}));

	const defaultProfile = getDefaultProfileFromState({
		profiles,
		defaultProfileId: parsed.defaultProfileId,
	});

	return {
		profiles,
		defaultProfileId: defaultProfile?.id,
	};
};

export const saveProfilesToStorage = (state: ProfilesState) => {
	saveToStorage(PROFILES_STORAGE_KEY, {
		profiles: state.profiles.map((p) => ({
			...p,
			profile: { ...p.profile },
		})),
		defaultProfileId: state.defaultProfileId,
	});
};
