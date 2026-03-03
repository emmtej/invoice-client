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
	Modal,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";

const sidebarBoxStyle = { overflowY: "auto" as const };

export default function InvoicePage() {
	const { docFiles, handleFileChange } = useFileUpload();
	const { scripts, setScripts } = useScriptStore();
	const { invoice, addEmptyItem } = useInvoiceStore();
	const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
		useDisclosure(false);
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
		closeAddModal();
	}, [addEmptyItem, newItemName, closeAddModal]);

	const handleOpenAddModal = useCallback(() => {
		setNewItemName("");
		openAddModal();
	}, [openAddModal]);

	const hasItems = invoice.items.length > 0;

	return (
		<Box style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
			<Text fw={700} size="lg" mb="md">
				Invoice
			</Text>

			<Flex gap="md" align="flex-start" style={{ flex: 1, minHeight: 0 }}>
				<Box style={{ flex: 1, minWidth: 0 }}>
					{!hasItems ? (
						<Stack gap="md" py="md">
							<Text size="sm" c="dimmed">
								No items yet. Add an item below or upload documents in the panel to add
								subitems from scripts.
							</Text>
							<Button
								leftSection={<IconPlus size={16} />}
								onClick={handleOpenAddModal}
								variant="filled"
							>
								Add item
							</Button>
						</Stack>
					) : (
						<Stack gap="md">
							<Flex justify="flex-end">
								<Button
									leftSection={<IconPlus size={16} />}
									onClick={handleOpenAddModal}
									variant="light"
									size="xs"
								>
									Add item
								</Button>
							</Flex>
							<InvoiceSummary />
						</Stack>
					)}
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

			<Modal opened={addModalOpened} onClose={closeAddModal} title="Add invoice item(s)" centered>
				<Stack gap="md">
					<TextInput
						label="Item name(s)"
						placeholder="e.g. Episode 1, Episode 2, Episode 3"
						description="Separate multiple names with a comma to add several items at once."
						value={newItemName}
						onChange={(e) => setNewItemName(e.currentTarget.value)}
						onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
					/>
					<Flex justify="flex-end" gap="xs">
						<Button variant="default" onClick={closeAddModal}>
							Cancel
						</Button>
						<Button onClick={handleAddItem}>Add item</Button>
					</Flex>
				</Stack>
			</Modal>
		</Box>
	);
}
