import {
	ActionIcon,
	Box,
	Button,
	Group,
	Stack,
	Table,
	Text,
} from "@mantine/core";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
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
		<Box
			style={{
				backgroundColor: "white",
				border: "1px solid var(--mantine-color-sage-1)",
				borderRadius: "var(--mantine-radius-md)",
				overflow: "hidden",
			}}
		>
			<Stack gap={0}>
				{/* Section Header */}
				<Group justify="space-between" bg="sage.0" px="xl" py="md">
					<Group gap="xs">
						<Text fw={800} size="md" c="forest.9" lts={-0.2}>
							{item.name}
						</Text>
						<ActionIcon
							variant="subtle"
							color="sage"
							onClick={() =>
								setEditConfig({
									field: "name",
									initialValue: item.name,
									title: "Rename Category",
									label: "Category Name",
									inputType: "text",
								})
							}
							size="sm"
						>
							<Pencil size={14} />
						</ActionIcon>
					</Group>

					<Button
						variant="subtle"
						color="terracotta"
						onClick={handleDeleteItem}
						size="xs"
						leftSection={<Trash2 size={14} />}
						fw={700}
					>
						Delete Category
					</Button>
				</Group>

				{/* Table Area */}
				<Box p="xl">
					{item.subitems.length > 0 ? (
						<Table verticalSpacing="md" horizontalSpacing="sm">
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Line Item / Description</Table.Th>
									<Table.Th style={{ textAlign: "right" }}>Qty</Table.Th>
									<Table.Th style={{ textAlign: "right" }}>Rate</Table.Th>
									<Table.Th style={{ textAlign: "right" }}>Total</Table.Th>
									<Table.Th w={50} />
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{item.subitems.map((sub) => (
									<Table.Tr
										key={sub.id}
										style={{
											borderBottom: "1px solid var(--mantine-color-sage-0)",
										}}
									>
										<Table.Td>
											<Stack gap={2}>
												<Group gap={6}>
													<Text size="sm" fw={700} c="forest.9">
														{sub.label || "Service Item"}
													</Text>
													<ActionIcon
														variant="subtle"
														color="sage"
														size="xs"
														onClick={() =>
															setEditConfig({
																field: "subitemLabel",
																subitemId: sub.id,
																initialValue: sub.label || "",
																title: "Edit Line Label",
																label: "Description",
																inputType: "text",
															})
														}
													>
														<Pencil size={12} />
													</ActionIcon>
												</Group>
												<Text size="xs" c="sage.6" fw={500}>
													{sub.scriptName}
												</Text>
											</Stack>
										</Table.Td>
										<Table.Td style={{ textAlign: "right" }}>
											<Text
												size="sm"
												fw={600}
												className="tabular-nums"
												c="forest.9"
											>
												{sub.wordCount.toLocaleString()}
											</Text>
										</Table.Td>
										<Table.Td style={{ textAlign: "right" }}>
											<Group justify="flex-end" gap={4}>
												<Text
													size="sm"
													fw={600}
													className="tabular-nums"
													c="forest.9"
												>
													${sub.ratePerWord.toFixed(2)}
												</Text>
												<ActionIcon
													variant="subtle"
													color="sage"
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
											</Group>
										</Table.Td>
										<Table.Td style={{ textAlign: "right" }}>
											<Text
												size="sm"
												fw={800}
												c="forest.9"
												className="tabular-nums"
											>
												${sub.amount.toFixed(2)}
											</Text>
										</Table.Td>
										<Table.Td style={{ textAlign: "right" }}>
											<ActionIcon
												variant="subtle"
												color="terracotta"
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
					) : (
						<Box
							py="xl"
							ta="center"
							style={{
								border: "2px dashed var(--mantine-color-sage-1)",
								borderRadius: "var(--mantine-radius-md)",
							}}
						>
							<Text size="sm" c="sage.4" fw={500}>
								No line items added to this category yet.
							</Text>
						</Box>
					)}

					<Group justify="center" mt="xl">
						<Button
							leftSection={<Plus size={16} />}
							variant="light"
							color="forest"
							onClick={() => setSubitemModalOpened(true)}
							size="sm"
							fw={700}
						>
							Add Line Item
						</Button>
					</Group>
				</Box>
			</Stack>

			{/* Modals remain the same */}
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
		</Box>
	);
}
