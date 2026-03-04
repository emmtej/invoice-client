import { useScriptStore } from "@/features/editor/store/scriptEditorStore";
import { useFileUpload } from "@/features/editor/hooks/useFileUpload";
import { processDocuments } from "@/features/editor/utils/documentParser";
import { UploadDocumentsOverview } from "@/features/editor/components/UploadDocumentsOverview";
import { InvoiceSummary } from "@/features/invoice/components/InvoiceSummary";
import { useInvoiceStore } from "@/features/invoice/store/invoiceStore";
import {
	Box,
	Button,
	FileButton,
	Flex,
	Group,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";

const sidebarBoxStyle = { overflowY: "auto" as const };

export default function InvoicePage() {
	const { docFiles, handleFileChange } = useFileUpload();
	const { scripts, setScripts } = useScriptStore();
	const { invoice, addEmptyItem } = useInvoiceStore();
	const [newItemName, setNewItemName] = useState("");

	useEffect(() => {
		if (!docFiles || docFiles.length === 0) return;
		let cancelled = false;
		processDocuments(docFiles).then((s) => {
			if (!cancelled) setScripts(s);
		});
		return () => {
			cancelled = true;
		};
	}, [docFiles, setScripts]);

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

			<Flex gap="md" align="flex-start" style={{ flex: 1, minHeight: 0 }}>
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
								No items yet. Add an item above or upload documents in the panel to add
								subitems from scripts.
							</Text>
						) : (
							<InvoiceSummary />
						)}
					</Stack>
				</Box>

				<Box w={300} visibleFrom="sm" h="100%" style={sidebarBoxStyle}>
					<Text fw={700} mb="sm" c="dimmed" tt="uppercase" fz="xs">
						Upload scripts
					</Text>
					<FileButton
						onChange={handleFileChange}
						accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
						multiple
					>
						{(props) => (
							<Button {...props} variant="default" size="xs" mb="md" fullWidth>
								Upload Document(s)
							</Button>
						)}
					</FileButton>
					<Text fw={700} mb="sm" mt="lg" c="dimmed" tt="uppercase" fz="xs">
						Documents Overview
					</Text>
					<UploadDocumentsOverview scripts={scripts} />
				</Box>
			</Flex>
		</Box>
	);
}
