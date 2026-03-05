import {
	Button,
	Divider,
	Group,
	Select,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import {
	IconAt,
	IconDeviceFloppy,
	IconEdit,
	IconStar,
	IconUser,
	IconX,
} from "@tabler/icons-react";
import { ActiveProfileDisplay } from "./ActiveProfileDisplay";
import {
	getDefaultProfileFromState,
	getEmptyProfile,
	type InvoiceProfile,
	type ProfilesState,
} from "./invoiceProfile";
import { ADD_PROFILE_VALUE } from "./useProfileManager";

interface ProfileSectionProps {
	profilesState: ProfilesState;
	selectedProfileId: string | null;
	editingProfile: InvoiceProfile;
	profileSavedMessage: string;
	isEditingProfile: boolean;
	isProfileValid: boolean;
	activeProfileForSummary: InvoiceProfile | undefined;
	setIsEditingProfile: (value: boolean) => void;
	handleProfileChange: (
		field: keyof InvoiceProfile,
	) => (event: React.ChangeEvent<HTMLInputElement>) => void;
	handleSaveProfile: () => void;
	handleCancelEdit: () => void;
	handleSetAsDefault: () => void;
	handleSelectProfile: (value: string | null) => void;
	setSelectedProfileId: (value: string | null) => void;
	setEditingProfile: (profile: InvoiceProfile) => void;
}

export function ProfileSection({
	profilesState,
	selectedProfileId,
	editingProfile,
	profileSavedMessage,
	isEditingProfile,
	isProfileValid,
	activeProfileForSummary,
	setIsEditingProfile,
	handleProfileChange,
	handleSaveProfile,
	handleCancelEdit,
	handleSetAsDefault,
	handleSelectProfile,
	setSelectedProfileId,
	setEditingProfile,
}: ProfileSectionProps) {
	const hasProfiles = profilesState.profiles.length > 0;

	return (
		<Stack gap="sm">
			<Group mb="sm">
				<Divider
					label={
						<Group gap="xs">
							<IconUser size={20} />
							<Text fw={700} size="lg">
								Profile
							</Text>
						</Group>
					}
					labelPosition="left"
					style={{ flex: 1 }}
				/>
				<Group gap="xs" align="center">
					{hasProfiles && (
						<Select
							size="xs"
							data={[
								...profilesState.profiles.map((p) => ({
									value: p.id,
									label:
										p.id === profilesState.defaultProfileId
											? `${p.label} (default)`
											: p.label,
								})),
								{ value: ADD_PROFILE_VALUE, label: "+ Add profile" },
							]}
							value={selectedProfileId}
							onChange={handleSelectProfile}
							placeholder="Select profile"
							w={220}
						/>
					)}
					{profileSavedMessage && (
						<Text
							size="xs"
							c={
								profileSavedMessage === "Profile saved." ||
								profileSavedMessage === "Default profile updated."
									? "teal"
									: "red"
							}
						>
							{profileSavedMessage}
						</Text>
					)}
					{isEditingProfile ? (
						<>
							{hasProfiles && (
								<Button
									onClick={handleCancelEdit}
									size="xs"
									variant="subtle"
									color="red"
									leftSection={<IconX size={14} />}
								>
									Cancel
								</Button>
							)}
							<Button
								onClick={handleSaveProfile}
								disabled={!isProfileValid}
								size="xs"
								variant="light"
								leftSection={<IconDeviceFloppy size={14} />}
							>
								Save
							</Button>
						</>
					) : (
						<>
							{hasProfiles &&
								selectedProfileId &&
								selectedProfileId !== ADD_PROFILE_VALUE &&
								selectedProfileId !== profilesState.defaultProfileId && (
									<Button
										onClick={handleSetAsDefault}
										size="xs"
										variant="subtle"
										leftSection={<IconStar size={14} />}
									>
										Set as default
									</Button>
								)}
							<Button
								onClick={() => {
									if (hasProfiles && !selectedProfileId) {
										const defaultProfile =
											getDefaultProfileFromState(profilesState);
										setSelectedProfileId(defaultProfile?.id ?? null);
										setEditingProfile(
											defaultProfile?.profile ?? getEmptyProfile(),
										);
									}
									setIsEditingProfile(true);
								}}
								size="xs"
								variant="light"
								leftSection={<IconEdit size={14} />}
							>
								Edit
							</Button>
						</>
					)}
				</Group>
			</Group>

			{(!hasProfiles || isEditingProfile) && (
				<Stack gap="sm">
					{!hasProfiles && (
						<Text size="xs" c="dimmed">
							Create your first invoice profile. It will be saved and can be
							reused later.
						</Text>
					)}
					<Group grow>
						<TextInput
							label="First name"
							placeholder="First name"
							value={editingProfile.firstName}
							onChange={handleProfileChange("firstName")}
							required
							leftSection={<IconUser size={16} />}
						/>
						<TextInput
							label="Last name"
							placeholder="Last name"
							value={editingProfile.lastName}
							onChange={handleProfileChange("lastName")}
							required
						/>
					</Group>
					<TextInput
						label="Email"
						type="email"
						placeholder="you@example.com"
						value={editingProfile.email}
						onChange={handleProfileChange("email")}
						required
						leftSection={<IconAt size={16} />}
					/>
				</Stack>
			)}

			{hasProfiles &&
				selectedProfileId !== null &&
				selectedProfileId !== ADD_PROFILE_VALUE &&
				!isEditingProfile &&
				activeProfileForSummary && (
					<ActiveProfileDisplay profile={activeProfileForSummary} />
				)}
		</Stack>
	);
}
