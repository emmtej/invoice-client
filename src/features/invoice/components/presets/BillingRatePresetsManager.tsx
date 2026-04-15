import {
	ActionIcon,
	Button,
	Group,
	NumberInput,
	Stack,
	Table,
	Text,
	TextInput,
	Tooltip,
} from "@mantine/core";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { SurfaceCard } from "@/components/ui/card/SurfaceCard";
import { AppModal } from "@/components/ui/modal/AppModal";
import type { InvoiceSubitemPreset } from "../../presets/subitemPresets";
import { useInvoicePresetsStore } from "../../store/invoicePresetsStore";

export function BillingRatePresetsManager() {
	const { ratePresets, addRatePreset, updateRatePreset, deleteRatePreset } =
		useInvoicePresetsStore();

	const [modalOpened, setModalOpened] = useState(false);
	const [editingPreset, setEditingPreset] =
		useState<InvoiceSubitemPreset | null>(null);

	const handleOpenAdd = () => {
		setEditingPreset(null);
		setModalOpened(true);
	};

	const handleOpenEdit = (preset: InvoiceSubitemPreset) => {
		setEditingPreset(preset);
		setModalOpened(true);
	};

	const handleDelete = (id: string) => {
		if (window.confirm("Are you sure you want to delete this preset?")) {
			deleteRatePreset(id);
		}
	};

	return (
		<Stack gap="md">
			<Group justify="space-between">
				<Box>
					<Text fw={700} size="lg">
						Billing Rates
					</Text>
					<Text size="sm" c="gray.6">
						Standard rates for your services (e.g., Narration, Commercial,
						Editing).
					</Text>
				</Box>
				<Button
					leftSection={<Plus size={16} />}
					color="wave"
					onClick={handleOpenAdd}
				>
					Add Preset
				</Button>
			</Group>

			{ratePresets.length > 0 ? (
				<SurfaceCard p={0}>
					<Table verticalSpacing="md" horizontalSpacing="lg">
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Label</Table.Th>
								<Table.Th style={{ textAlign: "right" }}>Rate ($)</Table.Th>
								<Table.Th style={{ textAlign: "right" }}>Unit (Words)</Table.Th>
								<Table.Th style={{ textAlign: "right" }}>Actions</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{ratePresets.map((preset) => (
								<Table.Tr key={preset.id}>
									<Table.Td>
										<Text fw={600}>{preset.subitemLabel}</Text>
									</Table.Td>
									<Table.Td style={{ textAlign: "right" }}>
										<Text className="tabular-nums">
											$
											{preset.rateAmount.toLocaleString(undefined, {
												minimumFractionDigits: 2,
												maximumFractionDigits: 4,
											})}
										</Text>
									</Table.Td>
									<Table.Td style={{ textAlign: "right" }}>
										<Text className="tabular-nums">
											{preset.ratePerWords.toLocaleString()} words
										</Text>
									</Table.Td>
									<Table.Td>
										<Group justify="flex-end" gap="xs">
											<Tooltip label="Edit preset">
												<ActionIcon
													variant="subtle"
													color="gray"
													onClick={() => handleOpenEdit(preset)}
												>
													<Pencil size={16} />
												</ActionIcon>
											</Tooltip>
											<Tooltip label="Delete preset">
												<ActionIcon
													variant="subtle"
													color="red"
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
						<Text c="gray.5" fs="italic">
							No billing rate presets created yet.
						</Text>
						<Button
							variant="subtle"
							color="wave"
							onClick={handleOpenAdd}
							leftSection={<Plus size={16} />}
						>
							Create your first preset
						</Button>
					</Stack>
				</SurfaceCard>
			)}

			<RatePresetModal
				opened={modalOpened}
				onClose={() => setModalOpened(false)}
				preset={editingPreset}
				onSave={(data) => {
					if (editingPreset) {
						updateRatePreset(editingPreset.id, data);
					} else {
						addRatePreset(data);
					}
					setModalOpened(false);
				}}
			/>
		</Stack>
	);
}

interface RatePresetModalProps {
	opened: boolean;
	onClose: () => void;
	preset: InvoiceSubitemPreset | null;
	onSave: (data: Omit<InvoiceSubitemPreset, "id">) => void;
}

function RatePresetModal({
	opened,
	onClose,
	preset,
	onSave,
}: RatePresetModalProps) {
	const [label, setLabel] = useState("");
	const [rate, setRate] = useState<number>(0.1);
	const [perWords, setPerWords] = useState<number>(1);

	useEffect(() => {
		if (preset) {
			setLabel(preset.subitemLabel);
			setRate(preset.rateAmount);
			setPerWords(preset.ratePerWords);
		} else {
			setLabel("");
			setRate(0.1);
			setPerWords(1);
		}
	}, [preset]);

	return (
		<AppModal
			opened={opened}
			onClose={onClose}
			title={preset ? "Edit Rate Preset" : "New Rate Preset"}
			size="sm"
		>
			<Stack gap="md">
				<TextInput
					label="Preset Label"
					placeholder="e.g. Standard Narration"
					value={label}
					onChange={(e) => setLabel(e.currentTarget.value)}
					required
					autoFocus
				/>

				<Group grow>
					<NumberInput
						label="Rate ($)"
						placeholder="0.10"
						value={rate}
						onChange={(v) => setRate(Number(v))}
						decimalScale={4}
						fixedDecimalScale
						prefix="$"
						required
					/>
					<NumberInput
						label="per [X] words"
						placeholder="1"
						value={perWords}
						onChange={(v) => setPerWords(Number(v))}
						min={1}
						required
					/>
				</Group>

				<Group justify="flex-end" mt="xl">
					<Button variant="subtle" color="gray" onClick={onClose}>
						Cancel
					</Button>
					<Button
						color="wave"
						onClick={() =>
							onSave({
								subitemLabel: label,
								rateAmount: rate,
								ratePerWords: perWords,
							})
						}
						disabled={!label}
					>
						{preset ? "Save Changes" : "Create Preset"}
					</Button>
				</Group>
			</Stack>
		</AppModal>
	);
}

// Helper to use Box
import { Box } from "@mantine/core";
import { useEffect } from "react";
