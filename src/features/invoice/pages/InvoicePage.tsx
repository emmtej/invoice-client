import { Box, Stack, Text } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { useInvoiceStore } from "@/features/invoice/store/invoiceStore";
import {
	InvoiceDetailsSection,
	loadInvoiceDefaults,
	saveInvoiceDefaults,
} from "../details";
import { InvoiceItemAdder } from "../items";
import { ProfileSection, useProfileManager } from "../profile";
import { InvoiceSummary } from "../summary";

export default function InvoicePage() {
	const { invoice, addEmptyItem } = useInvoiceStore();
	const [newItemName, setNewItemName] = useState<string>("");

	const profileManager = useProfileManager();

	const [invoiceTitle, setInvoiceTitle] = useState<string>(
		() => loadInvoiceDefaults().invoiceTitle,
	);
	const [invoiceDate, setInvoiceDate] = useState<string>(
		() => loadInvoiceDefaults().invoiceDate,
	);

	useEffect(() => {
		saveInvoiceDefaults({ invoiceTitle, invoiceDate });
	}, [invoiceTitle, invoiceDate]);

	const handleAddItem = useCallback(() => {
		const names = newItemName
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean);
		if (names.length === 0) {
			addEmptyItem("New item");
		} else {
			for (const name of names) {
				addEmptyItem(name);
			}
		}
		setNewItemName("");
	}, [addEmptyItem, newItemName]);

	const hasItems = invoice.items.length > 0;

	return (
		<Box
			style={{
				flex: 1,
				minHeight: 0,
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Text fw={700} size="xl" mb="lg">
				Invoice
			</Text>

			<Box style={{ flex: 1, minWidth: 0 }}>
				<Stack gap="lg">
					<Box>
						<ProfileSection {...profileManager} />
						<InvoiceDetailsSection
							invoiceTitle={invoiceTitle}
							setInvoiceTitle={setInvoiceTitle}
							invoiceDate={invoiceDate}
							setInvoiceDate={setInvoiceDate}
						/>
					</Box>

					<InvoiceItemAdder
						newItemName={newItemName}
						setNewItemName={setNewItemName}
						handleAddItem={handleAddItem}
					/>

					{hasItems && (
						<InvoiceSummary
							profile={profileManager.activeProfileForSummary}
							invoiceTitle={invoiceTitle}
							invoiceDate={invoiceDate}
						/>
					)}
				</Stack>
			</Box>
		</Box>
	);
}
