import { InvoiceSummary } from "@/features/invoice/components/InvoiceSummary";
import { useInvoiceStore } from "@/features/invoice/store/invoiceStore";
import { Box, Button, Group, Stack, Text, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useCallback, useState } from "react";

export default function InvoicePage() {
	const { invoice, addEmptyItem } = useInvoiceStore();
	const [newItemName, setNewItemName] = useState("");

	const handleAddItem = useCallback(() => {
		const names = newItemName
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean);
		if (names.length === 0) {
			addEmptyItem("New item");
		} else {
			names.forEach((name) => addEmptyItem(name));
		}
		setNewItemName("");
	}, [addEmptyItem, newItemName]);

	const hasItems = invoice.items.length > 0;

	return (
		<Box style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
			<Text fw={700} size="lg" mb="md">
				Invoice
			</Text>

			<Box style={{ flex: 1, minWidth: 0 }}>
				<Stack gap="md">
					<Group align="flex-end" gap="sm">
						<TextInput
							label="Item name(s)"
							placeholder="e.g. Episode 1, Episode 2, Episode 3"
							description="Separate multiple names with a comma to add several items at once."
							value={newItemName}
							onChange={(e) => setNewItemName(e.currentTarget.value)}
							onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
							style={{ flex: 1 }}
						/>
						<Button
							leftSection={<IconPlus size={16} />}
							onClick={handleAddItem}
							variant="filled"
						>
							Add item
						</Button>
					</Group>

					{!hasItems ? (
						<Text size="sm" c="dimmed" py="md">
							No items yet. Add an item above.
						</Text>
					) : (
						<InvoiceSummary />
					)}
				</Stack>
			</Box>
		</Box>
	);
}
