import { z } from "zod";

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
			/^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
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

const PROFILES_STORAGE_KEY = "invoice_profiles";

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
	options?: { makeDefault?: boolean }
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
	state: ProfilesState
): InvoiceProfileWithMeta | null => {
	if (!state.profiles.length) return null;

	if (state.defaultProfileId) {
		const found = state.profiles.find((p) => p.id === state.defaultProfileId);
		if (found) return found;
	}

	return state.profiles[0] ?? null;
};

export const loadProfilesFromStorage = (): ProfilesState => {
	if (typeof window === "undefined") {
		return { profiles: [] };
	}

	try {
		const raw = window.localStorage.getItem(PROFILES_STORAGE_KEY);
		if (!raw) {
			return { profiles: [] };
		}

		const parsed = JSON.parse(raw) as ProfilesState | null;
		if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.profiles)) {
			return { profiles: [] };
		}

		const profiles: InvoiceProfileWithMeta[] = parsed.profiles
			.filter((p): p is InvoiceProfileWithMeta => !!p && typeof p === "object")
			.map((p) => {
				const baseProfile: InvoiceProfile = {
					firstName:
						typeof p.profile?.firstName === "string" ? p.profile.firstName : "",
					lastName:
						typeof p.profile?.lastName === "string" ? p.profile.lastName : "",
					email: typeof p.profile?.email === "string" ? p.profile.email : "",
				};

				return {
					id: typeof p.id === "string" && p.id ? p.id : createProfileId(),
					label:
						typeof p.label === "string" && p.label.trim()
							? p.label.trim()
							: deriveProfileLabel(baseProfile),
					isDefault: Boolean(p.isDefault),
					profile: baseProfile,
				};
			});

		if (!profiles.length) {
			return { profiles: [] };
		}

		const defaultProfile = getDefaultProfileFromState({
			profiles,
			defaultProfileId:
				typeof parsed.defaultProfileId === "string"
					? parsed.defaultProfileId
					: undefined,
		});

		return {
			profiles,
			defaultProfileId: defaultProfile?.id,
		};
	} catch {
		return { profiles: [] };
	}
};

export const saveProfilesToStorage = (state: ProfilesState) => {
	if (typeof window === "undefined") return;

	try {
		const serializable: ProfilesState = {
			profiles: state.profiles.map((p) => ({
				...p,
				profile: {
					...p.profile,
				},
			})),
			defaultProfileId: state.defaultProfileId,
		};

		window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(serializable));
	} catch {
		// Ignore storage errors to avoid breaking the UI
	}
};
