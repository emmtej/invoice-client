import {
	Box,
	Button,
	FileButton,
	Flex,
	Group,
	Paper,
	Stack,
	Tabs,
	Text,
	Title,
} from "@mantine/core";
import {
	IconCloudUpload,
	IconFileDescription,
	IconFilePlus,
	IconFileText,
	IconInfoCircle,
	IconPlus,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { loadInvoiceDefaults } from "@/features/invoice/details";
import { useInvoiceStore } from "@/features/invoice/store/invoiceStore";
import { InvoiceSummary } from "@/features/invoice/summary";
import { useFileUpload } from "../hooks/useFileUpload";
import { useScriptStore } from "../store/scriptEditorStore";
import { processDocuments, reparseHtmlToScript } from "../utils/documentParser";
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
	const { scripts, setScripts, addScripts } = useScriptStore((store) => store);
	const { invoice } = useInvoiceStore();

	// Default state - empty doc array
	const [activeTab, setActiveTab] = useState<string>("add");
	const [editingScriptId, setEditingScriptId] = useState<string | null>(null);
	const [pastedContent, setPastedContent] = useState("");

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

	const handlePastedContentChange = useCallback((html: string) => {
		setPastedContent(html);
	}, []);

	const handleCreateFromPaste = useCallback(() => {
		if (!pastedContent.trim()) return;

		const { lines, overview, html } = reparseHtmlToScript(pastedContent);
		const newId = `pasted-${Date.now()}`;
		const newScript = {
			id: newId,
			name: `Pasted Content ${scripts.length + 1}`,
			source: document.implementation.createHTMLDocument(), // Placeholder
			lines,
			overview,
			html,
		};

		addScripts([newScript]);
		setActiveTab(newId);
		setPastedContent("");
	}, [pastedContent, scripts.length, addScripts]);

	const hasScripts = scripts.length > 0;
	const hasInvoiceItems = invoice.items.length > 0;
	const showSidebar = hasScripts || hasInvoiceItems;

	return (
		<Stack gap="xl" h="100%">
			<Box>
				<Title order={2} fw={800} lts={-0.5} c="blue.7">
					Script & Document Editor
				</Title>
				<Text c="dimmed" size="sm" mt={4}>
					Upload, parse, and organize your scripts to automatically calculate
					dialogue word counts for your invoices.
				</Text>
			</Box>

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
						<Tabs.Tab
							key={script.id}
							value={script.id}
							leftSection={<IconFileText size={14} />}
						>
							{script.name}
						</Tabs.Tab>
					))}
					<Tabs.Tab
						value="add"
						leftSection={
							<IconFilePlus
								size={14}
								color="var(--mantine-color-blue-filled)"
							/>
						}
					>
						<Text fw={700} c="blue.7" tt="uppercase" fz="xs">
							{scripts.length > 0 ? "Add Document" : "New Document"}
						</Text>
					</Tabs.Tab>
				</Tabs.List>

				<Flex
					gap={showSidebar ? "md" : 0}
					align="flex-start"
					style={flexMainStyle}
				>
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
							{!hasScripts && (
								<Paper
									withBorder
									p="xl"
									radius="md"
									mb="lg"
									bg="var(--mantine-color-blue-light)"
								>
									<Group align="flex-start" wrap="nowrap" gap="lg">
										<Box
											bg="var(--mantine-color-blue-light-hover)"
											p="md"
											style={{ borderRadius: "50%" }}
										>
											<IconFileDescription
												size={32}
												color="var(--mantine-color-blue-filled)"
											/>
										</Box>
										<Stack gap="xs" style={{ flex: 1 }}>
											<Text fw={700} size="lg">
												Getting Started
											</Text>
											<Text size="sm">
												Paste your script content directly into the editor
												below, or upload existing Word documents (.docx) to
												parse them automatically.
											</Text>
											<Group gap={6} mt="xs">
												<IconInfoCircle size={14} color="gray" />
												<Text size="xs" c="dimmed">
													Word counts are calculated based on dialogue lines
													only.
												</Text>
											</Group>
										</Stack>
									</Group>
								</Paper>
							)}

							<TextEditor
								content={pastedContent}
								onContentChange={handlePastedContentChange}
								additionalMenu={
									<Flex gap="xs" align="center">
										{pastedContent.trim() && (
											<Button
												variant="filled"
												size="xs"
												leftSection={<IconPlus size={14} />}
												onClick={handleCreateFromPaste}
											>
												Process Paste
											</Button>
										)}
										<FileButton
											onChange={handleFileChange}
											accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
											multiple
										>
											{(props) => (
												<Button
													{...props}
													variant="default"
													size="xs"
													leftSection={<IconCloudUpload size={14} />}
												>
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
									<Text
										fw={700}
										mb="sm"
										mt="lg"
										c="dimmed"
										tt="uppercase"
										fz="xs"
									>
										Documents Overview
									</Text>
									<UploadDocumentsOverview
										scripts={scripts}
										onAddedToInvoice={reset}
									/>
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
		</Stack>
	);
}
