import { Box, Button, FileButton, Flex, Tabs, Text } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { loadInvoiceDefaults } from "@/features/invoice/details";
import { useInvoiceStore } from "@/features/invoice/store/invoiceStore";
import { InvoiceSummary } from "@/features/invoice/summary";
import { useFileUpload } from "../hooks/useFileUpload";
import { useScriptStore } from "../store/scriptEditorStore";
import { processDocuments } from "../utils/documentParser";
import { ScriptEditor } from "./ScriptEditor";
import { TextEditor } from "./TextEditor";
import { UploadDocumentsOverview } from "./UploadDocumentsOverview";

const tabsStyle = {
	display: "flex" as const,
	flexDirection: "column" as const,
	flex: 1,
	minHeight: 0,
};
const flexMainStyle = { flex: 1, minHeight: 0 };
const panelStyle = {
	flex: 1,
	display: "flex" as const,
	flexDirection: "column" as const,
	minHeight: 0,
};
const sidebarBoxStyle = { overflowY: "auto" as const };

export default function Scripts() {
	const { docFiles, handleFileChange, reset } = useFileUpload();
	const { scripts, setScripts } = useScriptStore((store) => store);
	const { invoice } = useInvoiceStore();

	// Default state - empty doc array
	const [activeTab, setActiveTab] = useState<string>("add");
	const [editingScriptId, setEditingScriptId] = useState<string | null>(null);

	useEffect(() => {
		if (!docFiles) return;
		let cancelled = false;
		processDocuments(docFiles).then((s) => {
			if (!cancelled) {
				setScripts(s);
				if (s.length > 0) setActiveTab(s[0].id);
			}
		});
		return () => {
			cancelled = true;
		};
	}, [docFiles, setScripts]);

	useEffect(() => {
		const scriptIds = scripts.map((s) => s.id);
		const currentValid = scriptIds.includes(activeTab) || activeTab === "add";
		if (currentValid) return;
		setActiveTab(scripts.length > 0 ? scripts[0].id : "add");
	}, [scripts, activeTab]);

	const handleTabChange = useCallback((value: string | null) => {
		setActiveTab(value ? value : "add");
		setEditingScriptId(null);
	}, []);

	const handleStopEdit = useCallback(() => {
		setEditingScriptId(null);
	}, []);

	const handleStartEdit = useCallback((scriptId: string) => {
		setEditingScriptId(scriptId);
	}, []);

	const noopContentChange = useCallback(() => {}, []);

	const hasScripts = scripts.length > 0;
	const hasInvoiceItems = invoice.items.length > 0;
	const showSidebar = hasScripts || hasInvoiceItems;

	return (
		<Tabs
			defaultValue="add"
			value={activeTab}
			onChange={handleTabChange}
			variant="outline"
			radius="md"
			style={tabsStyle}
		>
			<Tabs.List mb="md">
				{scripts.map((script) => (
					<Tabs.Tab key={script.id} value={script.id}>
						{script.name}
					</Tabs.Tab>
				))}
				<Tabs.Tab value="add">
					<Text fw={700} c="dimmed" tt="uppercase" fz="xs">
						{scripts.length > 0 ? "Add Document" : "New Document"}
					</Text>
				</Tabs.Tab>
			</Tabs.List>

			<Flex gap={showSidebar ? "md" : 0} align="flex-start" style={flexMainStyle}>
				<Box
					style={{
						flex: 1,
						minWidth: 0,
						height: "100%",
						display: "flex",
						flexDirection: "column",
					}}
				>
					{scripts.map((script) => (
						<Tabs.Panel
							key={script.id}
							value={script.id}
							keepMounted={false}
							style={panelStyle}
						>
							<ScriptEditor
								script={script}
								isEditing={editingScriptId === script.id}
								onStartEdit={handleStartEdit}
								onStopEdit={handleStopEdit}
							/>
						</Tabs.Panel>
					))}
					<Tabs.Panel value="add" keepMounted={false} style={panelStyle}>
						<TextEditor
							content=""
							onContentChange={noopContentChange}
							additionalMenu={
								<Flex gap="xs" align="center">
									<FileButton
										onChange={handleFileChange}
										accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
										multiple
									>
										{(props) => (
											<Button {...props} variant="default" size="xs">
												Upload Document(s)
											</Button>
										)}
									</FileButton>
								</Flex>
							}
						/>
					</Tabs.Panel>
				</Box>

				{showSidebar && (
					<Box w={300} visibleFrom="sm" h="100%" style={sidebarBoxStyle}>
						{hasScripts && (
							<Box mb="xl">
								<Text fw={700} mb="sm" mt="lg" c="dimmed" tt="uppercase" fz="xs">
									Documents Overview
								</Text>
								<UploadDocumentsOverview scripts={scripts} onAddedToInvoice={reset} />
							</Box>
						)}

						{hasInvoiceItems && (
							<Box>
								<Text fw={700} mb="sm" c="dimmed" tt="uppercase" fz="xs">
									Invoice Summary
								</Text>
								<InvoiceSummary
									invoiceTitle={loadInvoiceDefaults().invoiceTitle}
									invoiceDate={loadInvoiceDefaults().invoiceDate}
								/>
							</Box>
						)}
					</Box>
				)}
			</Flex>
		</Tabs>
	);
}
