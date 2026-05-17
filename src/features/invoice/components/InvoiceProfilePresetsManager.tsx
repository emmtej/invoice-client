import {
	ActionIcon,
	Badge,
	Button,
	Group,
	Stack,
	Text,
	TextInput,
	Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { Pencil, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { AppModal } from "@/components/ui/AppModal";
import { PresetManager } from "@/components/ui/PresetManager";
import type {
	InvoiceProfile,
	InvoiceProfileWithMeta,
} from "../profileUtils";
import { useInvoicePresetsStore } from "../presetsStore";

export function InvoiceProfilePresetsManager() {
	const {
		profilePresets,
		addProfilePreset,
		updateProfilePreset,
		deleteProfilePreset,
		setDefaultProfile,
	} = useInvoicePresetsStore();

	const [modalOpened, setModalOpened] = useState(false);
	const [editingProfile, setEditingProfile] =
		useState<InvoiceProfileWithMeta | null>(null);

	const handleOpenAdd = () => {
		setEditingProfile(null);
		setModalOpened(true);
	};

	const handleOpenEdit = (profile: InvoiceProfileWithMeta) => {
		setEditingProfile(profile);
		setModalOpened(true);
	};

	const handleDelete = (id: string) => {
		modals.openConfirmModal({
			title: "Delete profile",
			children: (
				<Text size="sm">
					Are you sure you want to delete this profile? This action cannot be
					undone.
				</Text>
			),
			labels: { confirm: "Delete", cancel: "Cancel" },
			confirmProps: { color: "red" },
			onConfirm: () => deleteProfilePreset(id),
		});
	};

	return (
		<>
			<PresetManager
				title="Invoice Profiles"
				description="Manage your business identities and contact information for invoices."
				items={profilePresets}
				onAdd={handleOpenAdd}
				addLabel="Add Profile"
				emptyMessage="No invoice profiles created yet."
			>
				{(items) => (
					<Stack gap="md">
						{items.map((profile) => (
							<SurfaceCard key={profile.id}>
								<Group justify="space-between">
									<Group gap="lg">
										<Stack gap={0}>
											<Group gap="xs">
												<Text fw={700} size="md">
													{profile.label}
												</Text>
												{profile.isDefault && (
													<Badge
														color="blue"
														variant="light"
														leftSection={<Star size={12} />}
													>
														Default
													</Badge>
												)}
											</Group>
											<Text size="sm" c="dimmed">
												{profile.profile.firstName} {profile.profile.lastName} •{" "}
												{profile.profile.email}
											</Text>
										</Stack>
									</Group>

									<Group gap="xs">
										{!profile.isDefault && (
											<Tooltip label="Set as default">
												<ActionIcon
													variant="subtle"
													color="gray"
													onClick={() => setDefaultProfile(profile.id)}
												>
													<Star size={18} />
												</ActionIcon>
											</Tooltip>
										)}
										<Tooltip label="Edit profile">
											<ActionIcon
												variant="subtle"
												color="gray"
												onClick={() => handleOpenEdit(profile)}
											>
												<Pencil size={18} />
											</ActionIcon>
										</Tooltip>
										<Tooltip label="Delete profile">
											<ActionIcon
												variant="subtle"
												color="red"
												onClick={() => handleDelete(profile.id)}
												disabled={
													profile.isDefault && profilePresets.length > 1
												}
											>
												<Trash2 size={18} />
											</ActionIcon>
										</Tooltip>
									</Group>
								</Group>
							</SurfaceCard>
						))}
					</Stack>
				)}
			</PresetManager>

			<ProfileModal
				opened={modalOpened}
				onClose={() => setModalOpened(false)}
				profileWithMeta={editingProfile}
				onSave={(profile, options) => {
					if (editingProfile) {
						updateProfilePreset(editingProfile.id, profile, options);
					} else {
						addProfilePreset(profile, options);
					}
					setModalOpened(false);
				}}
			/>
		</>
	);
}

interface ProfileModalProps {
	opened: boolean;
	onClose: () => void;
	profileWithMeta: InvoiceProfileWithMeta | null;
	onSave: (profile: InvoiceProfile, options?: { isDefault?: boolean }) => void;
}

function ProfileModal({
	opened,
	onClose,
	profileWithMeta,
	onSave,
}: ProfileModalProps) {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [isDefault, setIsDefault] = useState(false);

	useEffect(() => {
		if (profileWithMeta) {
			setFirstName(profileWithMeta.profile.firstName);
			setLastName(profileWithMeta.profile.lastName);
			setEmail(profileWithMeta.profile.email);
			setIsDefault(profileWithMeta.isDefault);
		} else {
			setFirstName("");
			setLastName("");
			setEmail("");
			setIsDefault(false);
		}
	}, [profileWithMeta]);

	return (
		<AppModal
			opened={opened}
			onClose={onClose}
			title={profileWithMeta ? "Edit Invoice Profile" : "New Invoice Profile"}
			size="md"
		>
			<Stack gap="md">
				<Group grow>
					<TextInput
						label="First Name"
						placeholder="Jane"
						value={firstName}
						onChange={(e) => setFirstName(e.currentTarget.value)}
						required
					/>
					<TextInput
						label="Last Name"
						placeholder="Doe"
						value={lastName}
						onChange={(e) => setLastName(e.currentTarget.value)}
						required
					/>
				</Group>

				<TextInput
					label="Email Address"
					placeholder="jane@example.com"
					value={email}
					onChange={(e) => setEmail(e.currentTarget.value)}
					required
				/>

				{/* In a more advanced version, we could add address, phone, etc. here */}

				<Group justify="flex-end" mt="xl">
					<Button variant="subtle" color="gray" onClick={onClose}>
						Cancel
					</Button>
					<Button
						color="blue"
						onClick={() =>
							onSave({ firstName, lastName, email }, { isDefault })
						}
						disabled={!firstName || !lastName || !email}
					>
						{profileWithMeta ? "Save Changes" : "Create Profile"}
					</Button>
				</Group>
			</Stack>
		</AppModal>
	);
}
