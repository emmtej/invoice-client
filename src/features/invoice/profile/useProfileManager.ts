import { useCallback, useEffect, useMemo, useState } from "react";
import {
	deriveProfileLabel,
	getDefaultProfileFromState,
	getEmptyProfile,
	type InvoiceProfile,
	type InvoiceProfileWithMeta,
	loadProfilesFromStorage,
	type ProfilesState,
	profileSchema,
	saveProfilesToStorage,
} from "./invoiceProfile";

export const ADD_PROFILE_VALUE = "__add_profile__";

export function useProfileManager() {
	const [profilesState, setProfilesState] = useState<ProfilesState>({
		profiles: [],
		defaultProfileId: undefined,
	});
	const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
		null,
	);
	const [editingProfile, setEditingProfile] = useState<InvoiceProfile>(() =>
		getEmptyProfile(),
	);
	const [profileSavedMessage, setProfileSavedMessage] = useState<string>("");
	const [isEditingProfile, setIsEditingProfile] = useState(true);

	useEffect(() => {
		const loaded = loadProfilesFromStorage();
		if (loaded.profiles.length === 0) {
			setProfilesState({ profiles: [], defaultProfileId: undefined });
			setSelectedProfileId(null);
			setEditingProfile(getEmptyProfile());
			setIsEditingProfile(true);
			return;
		}

		const defaultProfile = getDefaultProfileFromState(loaded);
		setProfilesState(loaded);
		setSelectedProfileId(defaultProfile?.id ?? null);
		setEditingProfile(defaultProfile?.profile ?? getEmptyProfile());
		setIsEditingProfile(false);
	}, []);

	const handleProfileChange =
		(field: keyof InvoiceProfile) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const value = event.currentTarget.value;
			setEditingProfile((prev) => ({
				...prev,
				[field]: value,
			}));
			setProfileSavedMessage("");
		};

	const isProfileValid = useMemo(() => {
		return profileSchema.safeParse(editingProfile).success;
	}, [editingProfile]);

	const handleSaveProfile = useCallback(() => {
		if (!isProfileValid) {
			setProfileSavedMessage(
				"Please fill out all required fields correctly before saving.",
			);
			return;
		}

		const hasProfiles = profilesState.profiles.length > 0;
		const isExistingSelected =
			!!selectedProfileId &&
			profilesState.profiles.some((p) => p.id === selectedProfileId);

		const shouldCreateNewProfile =
			!hasProfiles ||
			!isExistingSelected ||
			selectedProfileId === ADD_PROFILE_VALUE;

		let nextState: ProfilesState;
		let createdId: string | null = null;

		if (shouldCreateNewProfile) {
			const id =
				typeof crypto !== "undefined" && "randomUUID" in crypto
					? crypto.randomUUID()
					: `profile_${Date.now().toString(36)}_${Math.random()
							.toString(36)
							.slice(2, 8)}`;

			const newProfile: InvoiceProfileWithMeta = {
				id,
				label: deriveProfileLabel(editingProfile),
				isDefault: !hasProfiles,
				profile: editingProfile,
			};

			nextState = {
				profiles: [...profilesState.profiles, newProfile],
				defaultProfileId: hasProfiles ? profilesState.defaultProfileId : id,
			};
			createdId = id;
		} else {
			const updatedProfiles = profilesState.profiles.map((p) =>
				p.id === selectedProfileId
					? {
							...p,
							label: deriveProfileLabel(editingProfile),
							profile: editingProfile,
						}
					: p,
			);

			nextState = {
				profiles: updatedProfiles,
				defaultProfileId: profilesState.defaultProfileId,
			};
		}

		setProfilesState(nextState);
		saveProfilesToStorage(nextState);
		if (createdId !== null) {
			setSelectedProfileId(createdId);
		}
		setIsEditingProfile(false);
		setProfileSavedMessage("Profile saved.");
	}, [editingProfile, isProfileValid, profilesState, selectedProfileId]);

	const handleCancelEdit = useCallback(() => {
		if (profilesState.profiles.length === 0) {
			setEditingProfile(getEmptyProfile());
			setIsEditingProfile(true);
			setProfileSavedMessage("");
			return;
		}

		const defaultProfile = getDefaultProfileFromState(profilesState);
		const currentProfile =
			profilesState.profiles.find((p) => p.id === selectedProfileId) ??
			defaultProfile;

		setSelectedProfileId(currentProfile?.id ?? null);
		setEditingProfile(currentProfile?.profile ?? getEmptyProfile());
		setIsEditingProfile(false);
		setProfileSavedMessage("");
	}, [profilesState, selectedProfileId]);

	const handleSetAsDefault = useCallback(() => {
		if (
			!selectedProfileId ||
			selectedProfileId === ADD_PROFILE_VALUE ||
			selectedProfileId === profilesState.defaultProfileId
		) {
			return;
		}
		const nextState: ProfilesState = {
			...profilesState,
			defaultProfileId: selectedProfileId,
		};
		setProfilesState(nextState);
		saveProfilesToStorage(nextState);
		setProfileSavedMessage("Default profile updated.");
	}, [profilesState, selectedProfileId]);

	const handleSelectProfile = (value: string | null) => {
		if (!value) return;

		if (value === ADD_PROFILE_VALUE) {
			setSelectedProfileId(ADD_PROFILE_VALUE);
			setEditingProfile(getEmptyProfile());
			setIsEditingProfile(true);
			setProfileSavedMessage("");
			return;
		}

		setSelectedProfileId(value);
		const selected =
			profilesState.profiles.find((p) => p.id === value) ??
			getDefaultProfileFromState(profilesState);
		setEditingProfile(selected?.profile ?? getEmptyProfile());
		setIsEditingProfile(false);
		setProfileSavedMessage("");
	};

	const activeProfileForSummary: InvoiceProfile | undefined = (() => {
		if (isEditingProfile) return editingProfile;
		const current =
			profilesState.profiles.find((p) => p.id === selectedProfileId) ??
			getDefaultProfileFromState(profilesState);
		return current?.profile;
	})();

	return {
		profilesState,
		selectedProfileId,
		editingProfile,
		profileSavedMessage,
		isEditingProfile,
		setIsEditingProfile,
		handleProfileChange,
		isProfileValid,
		handleSaveProfile,
		handleCancelEdit,
		handleSetAsDefault,
		handleSelectProfile,
		activeProfileForSummary,
		setSelectedProfileId,
		setEditingProfile,
	};
}
