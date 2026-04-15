import { useCallback, useMemo, useState } from "react";
import { useInvoicePresetsStore } from "../store/invoicePresetsStore";
import {
	getEmptyProfile,
	type InvoiceProfile,
	profileSchema,
} from "./invoiceProfile";

export const ADD_PROFILE_VALUE = "__add_profile__";

export function useProfileManager() {
	const {
		profilePresets,
		defaultProfileId,
		addProfilePreset,
		updateProfilePreset,
		setDefaultProfile,
	} = useInvoicePresetsStore();

	const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
		defaultProfileId,
	);
	const [editingProfile, setEditingProfile] = useState<InvoiceProfile>(() => {
		const found = profilePresets.find((p) => p.id === defaultProfileId);
		return found?.profile ?? getEmptyProfile();
	});
	const [profileSavedMessage, setProfileSavedMessage] = useState<string>("");
	const [isEditingProfile, setIsEditingProfile] = useState(
		profilePresets.length === 0,
	);

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

		const isNew = !selectedProfileId || selectedProfileId === ADD_PROFILE_VALUE;

		if (isNew) {
			addProfilePreset(editingProfile);
			// The store will auto-select as default if it's the first one
		} else {
			updateProfilePreset(selectedProfileId, editingProfile);
		}

		setIsEditingProfile(false);
		setProfileSavedMessage("Profile saved.");
	}, [
		editingProfile,
		isProfileValid,
		selectedProfileId,
		addProfilePreset,
		updateProfilePreset,
	]);

	const handleCancelEdit = useCallback(() => {
		if (profilePresets.length === 0) {
			setEditingProfile(getEmptyProfile());
			setIsEditingProfile(true);
			setProfileSavedMessage("");
			return;
		}

		const currentProfile =
			profilePresets.find((p) => p.id === selectedProfileId) ??
			profilePresets.find((p) => p.id === defaultProfileId) ??
			profilePresets[0];

		setSelectedProfileId(currentProfile?.id ?? null);
		setEditingProfile(currentProfile?.profile ?? getEmptyProfile());
		setIsEditingProfile(false);
		setProfileSavedMessage("");
	}, [profilePresets, selectedProfileId, defaultProfileId]);

	const handleSetAsDefault = useCallback(() => {
		if (!selectedProfileId || selectedProfileId === ADD_PROFILE_VALUE) return;
		setDefaultProfile(selectedProfileId);
		setProfileSavedMessage("Default profile updated.");
	}, [selectedProfileId, setDefaultProfile]);

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
		const selected = profilePresets.find((p) => p.id === value);
		setEditingProfile(selected?.profile ?? getEmptyProfile());
		setIsEditingProfile(false);
		setProfileSavedMessage("");
	};

	const activeProfileForSummary: InvoiceProfile | undefined = (() => {
		if (isEditingProfile) return editingProfile;
		const current =
			profilePresets.find((p) => p.id === selectedProfileId) ??
			profilePresets.find((p) => p.id === defaultProfileId) ??
			profilePresets[0];
		return current?.profile;
	})();

	return {
		profilesState: {
			profiles: profilePresets,
			defaultProfileId: defaultProfileId ?? undefined,
		},
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
