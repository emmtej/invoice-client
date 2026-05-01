import {
	ActionIcon,
	Box,
	Button,
	Group,
	Stack,
	Table,
	Text,
	TextInput,
	Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SurfaceCard } from "@/components/ui/card/SurfaceCard";
import { AppModal } from "@/components/ui/modal/AppModal";
import {
	type InvoiceTitlePreset,
	useInvoicePresetsStore,
} from "../../store/invoicePresetsStore";

export function InvoiceTitlePresetsManager() {
	const { titlePresets, addTitlePreset, updateTitlePreset, deleteTitlePreset } =
		useInvoicePresetsStore();

	const [modalOpened, setModalOpened] = useState(false);
	const [editingPreset, setEditingPreset] = useState<InvoiceTitlePreset | null>(
		null,
	);

	const handleOpenAdd = () => {
		setEditingPreset(null);
		setModalOpened(true);
	};

	const handleOpenEdit = (preset: InvoiceTitlePreset) => {
		setEditingPreset(preset);
		setModalOpened(true);
	};

	const handleDelete = (id: string) => {
		modals.openConfirmModal({
			title: "Delete title preset",
			children: (
				<Text size="sm">
					Are you sure you want to delete this title preset?
				</Text>
			),
			labels: { confirm: "Delete", cancel: "Cancel" },
			confirmProps: { color: "red" },
			onConfirm: () => deleteTitlePreset(id),
		});
	};

	return (
		<Stack gap="md">
			<Group justify="space-between">
				<Box>
					<Text fw={700} size="lg">
						Invoice Titles
					</Text>
					<Text size="sm" c="dimmed">
						Commonly used titles for your invoices (e.g. Session Invoice,
						Project Fee).
					</Text>
				</Box>
				<Button
					leftSection={<Plus size={16} />}
					color="studio"
					onClick={handleOpenAdd}
				>
					Add Title
				</Button>
			</Group>

			{titlePresets.length > 0 ? (
				<SurfaceCard p={0}>
					<Table verticalSpacing="md" horizontalSpacing="lg">
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Invoice Title</Table.Th>
								<Table.Th style={{ textAlign: "right" }}>Actions</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{titlePresets.map((preset) => (
								<Table.Tr key={preset.id}>
									<Table.Td>
										<Text fw={600}>{preset.title}</Text>
									</Table.Td>
									<Table.Td>
										<Group justify="flex-end" gap="xs">
											<Tooltip label="Edit title">
												<ActionIcon
													variant="subtle"
													color="gray"
													onClick={() => handleOpenEdit(preset)}
												>
													<Pencil size={16} />
												</ActionIcon>
											</Tooltip>
											<Tooltip label="Delete title">
												<ActionIcon
													variant="subtle"
													color="on-air-red"
													onClick={() => handleDelete(preset.id)}
												>
													<Trash2 size={16} />
												</ActionIcon>
											</Tooltip>
										</Group>
									</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</SurfaceCard>
			) : (
				<SurfaceCard p="xl">
					<Stack align="center" gap="xs">
						<Text c="dimmed" fs="italic">
							No invoice title presets created yet.
						</Text>
						<Button
							variant="subtle"
							color="studio"
							onClick={handleOpenAdd}
							leftSection={<Plus size={16} />}
						>
							Create your first title preset
						</Button>
					</Stack>
				</SurfaceCard>
			)}

			<TitlePresetModal
				opened={modalOpened}
				onClose={() => setModalOpened(false)}
				preset={editingPreset}
				onSave={(title) => {
					if (editingPreset) {
						updateTitlePreset(editingPreset.id, title);
					} else {
						addTitlePreset(title);
					}
					setModalOpened(false);
				}}
			/>
		</Stack>
	);
}

interface TitlePresetModalProps {
	opened: boolean;
	onClose: () => void;
	preset: InvoiceTitlePreset | null;
	onSave: (title: string) => void;
}

function TitlePresetModal({
	opened,
	onClose,
	preset,
	onSave,
}: TitlePresetModalProps) {
	const [title, setTitle] = useState("");

	useEffect(() => {
		if (preset) {
			setTitle(preset.title);
		} else {
			setTitle("");
		}
	}, [preset]);

	return (
		<AppModal
			opened={opened}
			onClose={onClose}
			title={preset ? "Edit Title Preset" : "New Title Preset"}
			size="sm"
		>
			<Stack gap="md">
				<TextInput
					label="Invoice Title"
					placeholder="e.g. Session Invoice"
					value={title}
					onChange={(e) => setTitle(e.currentTarget.value)}
					required
					autoFocus
				/>

				<Group justify="flex-end" mt="xl">
					<Button variant="subtle" color="gray" onClick={onClose}>
						Cancel
					</Button>
					<Button
						color="studio"
						onClick={() => onSave(title)}
						disabled={!title.trim()}
					>
						{preset ? "Save Changes" : "Create Preset"}
					</Button>
				</Group>
			</Stack>
		</AppModal>
	);
}
