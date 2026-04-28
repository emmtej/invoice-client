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
		<SurfaceCard
			p={0}
			style={{
				backgroundColor: "white",
				border: "1px solid var(--mantine-color-gray-1)",
			}}
		>
			<Stack gap={0}>
				{/* Section Header */}
				<Group justify="space-between" bg="gray.0" px="xl" py="md">
					<Group gap="xs">
						<Text fw={800} size="md" c="gray.9" lts={-0.2}>
							{item.name}
						</Text>
						<ActionIcon
							variant="subtle"
							color="gray"
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
						color="on-air-red"
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
						<Table
							verticalSpacing="md"
							horizontalSpacing="sm"
							className="border-b border-gray-50"
						>
							<Table.Thead>
								<Table.Tr>
									<Table.Th
										style={{
											color: "var(--mantine-color-gray-8)",
											fontSize: "11px",
											fontWeight: 800,
											textTransform: "uppercase",
											letterSpacing: "1px",
										}}
									>
										Line Item / Description
									</Table.Th>
									<Table.Th
										style={{
											color: "var(--mantine-color-gray-8)",
											fontSize: "11px",
											fontWeight: 800,
											textTransform: "uppercase",
											letterSpacing: "1px",
											textAlign: "right",
										}}
									>
										Qty
									</Table.Th>
									<Table.Th
										style={{
											color: "var(--mantine-color-gray-8)",
											fontSize: "11px",
											fontWeight: 800,
											textTransform: "uppercase",
											letterSpacing: "1px",
											textAlign: "right",
										}}
									>
										Rate
									</Table.Th>
									<Table.Th
										style={{
											color: "var(--mantine-color-gray-8)",
											fontSize: "11px",
											fontWeight: 800,
											textTransform: "uppercase",
											letterSpacing: "1px",
											textAlign: "right",
										}}
									>
										Total
									</Table.Th>
									<Table.Th w={50} />
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{item.subitems.map((sub) => (
									<Table.Tr key={sub.id}>
										<Table.Td>
											<Stack gap={2}>
												<Group gap={6}>
													<Text size="sm" fw={700} c="gray.9">
														{sub.label || "Service Item"}
													</Text>
													<ActionIcon
														variant="subtle"
														color="gray"
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
												<Text size="xs" c="gray.5" fw={500}>
													{sub.scriptName}
												</Text>
											</Stack>
										</Table.Td>
										<Table.Td style={{ textAlign: "right" }}>
											<Text size="sm" fw={600} className="tabular-nums">
												{sub.wordCount.toLocaleString()}
											</Text>
										</Table.Td>
										<Table.Td style={{ textAlign: "right" }}>
											<Group justify="flex-end" gap={4}>
												<Text size="sm" fw={600} className="tabular-nums">
													${sub.ratePerWord.toFixed(2)}
												</Text>
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
											</Group>
										</Table.Td>
										<Table.Td style={{ textAlign: "right" }}>
											<Text
												size="sm"
												fw={800}
												c="gray.9"
												className="tabular-nums"
											>
												${sub.amount.toFixed(2)}
											</Text>
										</Table.Td>
										<Table.Td style={{ textAlign: "right" }}>
											<ActionIcon
												variant="subtle"
												color="gray"
												onClick={() => handleDeleteSubitem(sub.id)}
												size="sm"
												className="hover:text-red-600 hover:bg-red-50"
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
							className="border-2 border-dashed border-gray-100 rounded-md"
						>
							<Text size="sm" c="gray.5" fw={500}>
								No line items added to this category yet.
							</Text>
						</Box>
					)}

					<Group justify="center" mt="xl">
						<Button
							leftSection={<Plus size={16} />}
							variant="light"
							color="studio-blue"
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
		</SurfaceCard>
	);
}
