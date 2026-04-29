import {
	Box,
	Button,
	Group,
	Select,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { Pencil, Save, Star } from "lucide-react";
import { ActiveProfileDisplay } from "./ActiveProfileDisplay";
import {
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
		<Stack gap="xl">
			<Group justify="space-between" align="center">
				<Text size="xs" fw={700} c="sage.6" tt="uppercase" lts={1}>
					SENDER PROFILE
				</Text>
					{hasProfiles && !isEditingProfile && (
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
				</Group>

				{(!hasProfiles || isEditingProfile) && (
					<Stack gap="xl">
						{!hasProfiles && (
							<Text size="sm" c="gray.7" fw={500}>
								Create your first invoice profile. It will be saved and can be
								reused later.
							</Text>
						)}
						<Stack gap="lg" maw={600}>
							<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
								<TextInput
									label="First Name"
									placeholder="e.g. Jane"
									value={editingProfile.firstName}
									onChange={handleProfileChange("firstName")}
									required
									size="md"
									styles={(theme) => ({
										label: { color: theme.colors.gray[8], marginBottom: 8 },
										input: {
											"&::placeholder": { color: theme.colors.gray[4] },
										},
									})}
								/>
								<TextInput
									label="Last Name"
									placeholder="e.g. Doe"
									value={editingProfile.lastName}
									onChange={handleProfileChange("lastName")}
									required
									size="md"
									styles={(theme) => ({
										label: { color: theme.colors.gray[8], marginBottom: 8 },
										input: {
											"&::placeholder": { color: theme.colors.gray[4] },
										},
									})}
								/>
							</SimpleGrid>
							<TextInput
								label="Email Address"
								type="email"
								placeholder="jane.doe@example.com"
								value={editingProfile.email}
								onChange={handleProfileChange("email")}
								required
								size="md"
								maw={400}
								styles={(theme) => ({
									label: { color: theme.colors.gray[8], marginBottom: 8 },
									input: { "&::placeholder": { color: theme.colors.gray[4] } },
								})}
							/>
						</Stack>

						<Group justify="flex-end" mt="md">
							{hasProfiles && (
								<Button
									onClick={handleCancelEdit}
									variant="subtle"
									color="gray"
									fw={700}
								>
									Cancel
								</Button>
							)}
							<Button
								onClick={handleSaveProfile}
								disabled={!isProfileValid}
								variant="filled"
								color="studio-blue"
								px="xl"
								fw={800}
								leftSection={<Save size={16} />}
							>
								Save Profile
							</Button>
						</Group>
					</Stack>
				)}

				{hasProfiles &&
					selectedProfileId !== null &&
					selectedProfileId !== ADD_PROFILE_VALUE &&
					!isEditingProfile &&
					activeProfileForSummary && (
						<Box>
							<ActiveProfileDisplay profile={activeProfileForSummary} />
							<Group gap="xs" mt="xl" justify="flex-end">
								{selectedProfileId !== profilesState.defaultProfileId && (
									<Button
										onClick={handleSetAsDefault}
										size="xs"
										variant="subtle"
										color="studio-blue"
										leftSection={<Star size={14} />}
										fw={700}
									>
										Set as default
									</Button>
								)}
								<Button
									onClick={() => {
										if (hasProfiles && !selectedProfileId) {
											const defaultProfile =
												profilesState.profiles.find(
													(p) => p.id === profilesState.defaultProfileId,
												) || profilesState.profiles[0];
											setSelectedProfileId(defaultProfile?.id ?? null);
											setEditingProfile(
												defaultProfile?.profile ?? getEmptyProfile(),
											);
										}
										setIsEditingProfile(true);
									}}
									size="xs"
									variant="light"
									color="studio-blue"
									leftSection={<Pencil size={14} />}
									fw={700}
								>
									Edit Profile
								</Button>
							</Group>
						</Box>
					)}

				{profileSavedMessage && (
					<Text
						size="sm"
						fw={700}
						ta="right"
						c={
							profileSavedMessage === "Profile saved." ||
							profileSavedMessage === "Default profile updated."
								? "teal"
								: "on-air-red"
						}
					>
						{profileSavedMessage}
					</Text>
				)}
		</Stack>
	);
}
