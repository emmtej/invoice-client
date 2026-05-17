import { ActionIcon, Box, Button, Group, Stack, Text } from "@mantine/core";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	type InvoiceItem,
	type InvoiceSubitem,
	useInvoiceStore,
} from "../store";
import { EditValueModal } from "./EditValueModal";
import { InvoiceItemTable } from "./InvoiceItemTable";
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

	const handleEditSubitem = (sub: InvoiceSubitem, field: "label" | "rate") => {
		if (field === "label") {
			setEditConfig({
				field: "subitemLabel",
				subitemId: sub.id,
				initialValue: sub.label || "",
				title: "Edit Line Label",
				label: "Description",
				inputType: "text",
			});
		} else {
			setEditConfig({
				field: "subitemRate",
				subitemId: sub.id,
				initialValue: sub.ratePerWord,
				title: "Edit Rate",
				label: "Rate (per word)",
				inputType: "number",
			});
		}
	};

	return (
		<Box className="bg-white border rounded-3xl overflow-hidden shadow-sm">
			<Stack gap={0}>
				{/* Section Header */}
				<Group
					justify="space-between"
					bg="gray.0"
					px="xl"
					py="md"
					className="border-b"
				>
					<Group gap="xs">
						<Text fw={800} size="md"  lts={-0.2}>
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
							radius="md"
						>
							<Pencil size={14} />
						</ActionIcon>
					</Group>

					<Button
						variant="subtle"
						color="blue"
						onClick={() => removeItem(item.id)}
						size="xs"
						radius="xl"
						leftSection={<Trash2 size={14} />}
						fw={700}
					>
						Delete Category
					</Button>
				</Group>

				{/* Table Area */}
				<Box p="xl">
					{item.subitems.length > 0 ? (
						<InvoiceItemTable
							subitems={item.subitems}
							onEditSubitem={handleEditSubitem}
							onDeleteSubitem={(sid) => removeSubitem(item.id, sid)}
						/>
					) : (
						<Box
							py="xl"
							ta="center"
							className="border-2 border-dashed rounded-xl"
						>
							<Text size="sm" c="dimmed" fw={500}>
								No line items added to this category yet.
							</Text>
						</Box>
					)}

					<Group justify="center" mt="xl">
						<Button
							leftSection={<Plus size={16} />}
							variant="light"
							color="blue"
							radius="xl"
							onClick={() => setSubitemModalOpened(true)}
							size="sm"
							fw={700}
							className="shadow-sm transition-transform active:scale-95"
						>
							Add Line Item
						</Button>
					</Group>
				</Box>
			</Stack>

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
