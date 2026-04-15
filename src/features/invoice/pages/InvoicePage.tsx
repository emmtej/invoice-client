import { Box, Stack, Text } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { PageTitle } from "@/components/ui/text/PageTitle";
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
	const { invoice, addEmptyItem } = useInvoiceStore(
		useShallow((s) => ({
			invoice: s.invoice,
			addEmptyItem: s.addEmptyItem,
		})),
	);
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
		const name = newItemName.trim();
		if (name) {
			addEmptyItem(name);
		} else {
			addEmptyItem("New item");
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
			<Stack gap={4} mb="xl">
				<PageTitle>Invoice</PageTitle>
				<Text size="lg" c="gray.5" className="page-subtitle">
					Build line items from scripts, set rates, and export a clear summary
					for clients.
				</Text>
			</Stack>

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
