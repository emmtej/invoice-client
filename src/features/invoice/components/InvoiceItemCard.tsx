import {
	ActionIcon,
	Button,
	Group,
	Stack,
	Table,
	Text,
	Tooltip,
} from "@mantine/core";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { SurfaceCard } from "@/components/ui/card/SurfaceCard";
import { type InvoiceItem, useInvoiceStore } from "../store/invoiceStore";
import { EditValueModal } from "./EditValueModal";
import { SubitemModal } from "./SubitemModal";

interface InvoiceItemCardProps {
	item: InvoiceItem;
}

export function InvoiceItemCard({ item }: InvoiceItemCardProps) {
	const updateItemName = useInvoiceStore((s) => s.updateItemName);
	const removeItem = useInvoiceStore((s) => s.removeItem);
	const removeSubitem = useInvoiceStore((s) => s.removeSubitem);
	const updateSubitemRate = useInvoiceStore((s) => s.updateSubitemRate);
	const updateSubitemLabel = useInvoiceStore((s) => s.updateSubitemLabel);
	const updateSubitemUnit = useInvoiceStore((s) => s.updateSubitemUnit);

	const [subitemModalOpened, setSubitemModalOpened] = useState(false);
	const [editConfig, setEditConfig] = useState<{
		field: "name" | "subitemLabel" | "subitemRate" | "subitemUnit";
		subitemId?: string;
		initialValue: string | number;
		title: string;
		label: string;
		inputType: "text" | "number";
	} | null>(null);

	const handleConfirmEdit = (value: string | number) => {
		if (!editConfig) return;

		switch (editConfig.field) {
			case "name":
				updateItemName(item.id, String(value));
				break;
			case "subitemLabel":
				if (editConfig.subitemId) {
					updateSubitemLabel(item.id, editConfig.subitemId, String(value));
				}
				break;
			case "subitemRate":
				if (editConfig.subitemId) {
					updateSubitemRate(item.id, editConfig.subitemId, Number(value));
				}
				break;
			case "subitemUnit":
				if (editConfig.subitemId) {
					updateSubitemUnit(item.id, editConfig.subitemId, Number(value));
				}
				break;
		}
		setEditConfig(null);
	};

	const handleDeleteItem = () => {
		removeItem(item.id);
	};

	const handleDeleteSubitem = (subitemId: string) => {
		removeSubitem(item.id, subitemId);
	};

	return (
		<SurfaceCard>
			<Stack gap="md">
				{/* Card Header */}
				<Group justify="space-between">
					<Group gap="xs">
						<Text fw={700} size="lg">
							{item.name}
						</Text>
						<Tooltip label="Edit item name">
							<ActionIcon
								variant="subtle"
								color="gray"
								onClick={() =>
									setEditConfig({
										field: "name",
										initialValue: item.name,
										title: "Edit Item Name",
										label: "Item Name",
										inputType: "text",
									})
								}
								size="sm"
							>
								<Pencil size={16} />
							</ActionIcon>
						</Tooltip>
					</Group>

					<Tooltip label="Remove entire item group">
						<ActionIcon
							variant="subtle"
							color="on-air-red"
							onClick={handleDeleteItem}
							size="md"
						>
							<Trash2 size={18} />
						</ActionIcon>
					</Tooltip>
					</Group>

					{/* Sub-item Table */}
					{item.subitems.length > 0 ? (
					<Table.ScrollContainer minWidth={500}>
						<Table verticalSpacing="sm">
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Service / Scripts</Table.Th>
									<Table.Th style={{ textAlign: "right" }}>Words</Table.Th>
									<Table.Th style={{ textAlign: "right" }}>Rate</Table.Th>
									<Table.Th style={{ textAlign: "right" }}>Amount</Table.Th>
									<Table.Th />
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{item.subitems.map((sub) => (
									<Table.Tr key={sub.id}>
										<Table.Td>
											<Stack gap={2}>
												<Group gap={4}>
													<Text size="sm" fw={700}>
														{sub.label || "Service"}
													</Text>
													<Tooltip label="Edit label">
														<ActionIcon
															variant="subtle"
															color="gray"
															size="xs"
															onClick={() =>
																setEditConfig({
																	field: "subitemLabel",
																	subitemId: sub.id,
																	initialValue: sub.label || "",
																	title: "Edit Label",
																	label: "Label",
																	inputType: "text",
																})
															}
														>
															<Pencil size={12} />
														</ActionIcon>
													</Tooltip>
												</Group>
												<Text size="xs" c="dimmed">
													{sub.scriptName}
												</Text>
											</Stack>
										</Table.Td>
										<Table.Td style={{ textAlign: "right" }}>
											<Text size="sm">{sub.wordCount.toLocaleString()}</Text>
										</Table.Td>
										<Table.Td style={{ textAlign: "right" }}>
											<Group justify="flex-end" gap="xs">
												<Group gap={4}>
													<Text size="sm" c="dimmed">
														$
														{sub.ratePerWord.toLocaleString(undefined, {
															minimumFractionDigits: 2,
															maximumFractionDigits: 4,
														})}
													</Text>
													<Tooltip label="Edit rate">
														<ActionIcon
															variant="subtle"
															color="gray"
															size="xs"
															onClick={() =>
																setEditConfig({
																	field: "subitemRate",
																	subitemId: sub.id,
																	initialValue: sub.ratePerWord,
																	title: "Edit Rate",
																	label: "Rate (per word)",
																	inputType: "number",
																})
															}
														>
															<Pencil size={12} />
														</ActionIcon>
													</Tooltip>
												</Group>
												<Text size="sm" c="dimmed">
													/
												</Text>
												<Group gap={4}>
													<Text size="sm" c="dimmed">
														{sub.ratePerWords} words
													</Text>
													<Tooltip label="Edit unit">
														<ActionIcon
															variant="subtle"
															color="gray"
															size="xs"
															onClick={() =>
																setEditConfig({
																	field: "subitemUnit",
																	subitemId: sub.id,
																	initialValue: sub.ratePerWords,
																	title: "Edit Unit",
																	label: "Words per unit",
																	inputType: "number",
																})
															}
														>
															<Pencil size={12} />
														</ActionIcon>
													</Tooltip>
												</Group>
											</Group>
										</Table.Td>
										<Table.Td style={{ textAlign: "right" }}>
											<Text size="sm" fw={700}>
												${sub.amount.toFixed(2)}
											</Text>
										</Table.Td>
										<Table.Td style={{ textAlign: "right" }}>
											<ActionIcon
												variant="subtle"
												color="on-air-red"
												onClick={() => handleDeleteSubitem(sub.id)}
												size="sm"
											>
												<Trash2 size={14} />
											</ActionIcon>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					</Table.ScrollContainer>
					) : (
					<Text size="sm" c="dimmed" fs="italic" ta="center" py="xl">
						No sub-items added yet.
					</Text>
					)}

					{/* Card Footer */}
					<Group justify="center" mt="sm">
					<Button
						leftSection={<Plus size={16} />}
						variant="subtle"
						color="studio-blue"
						onClick={() => setSubitemModalOpened(true)}
						size="sm"
					>
						Add Sub-item
					</Button>
					</Group>

			</Stack>

			{/* Modals */}
			<EditValueModal
				opened={!!editConfig}
				onClose={() => setEditConfig(null)}
				onConfirm={handleConfirmEdit}
				initialValue={editConfig?.initialValue ?? ""}
				title={editConfig?.title ?? ""}
				label={editConfig?.label ?? ""}
				inputType={editConfig?.inputType ?? "text"}
			/>

			<SubitemModal
				opened={subitemModalOpened}
				onClose={() => setSubitemModalOpened(false)}
				itemId={item.id}
				itemName={item.name}
			/>
		</SurfaceCard>
	);
}
