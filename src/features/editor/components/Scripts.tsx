import {
	ActionIcon,
	Box,
	Flex,
	Group,
	NavLink,
	ScrollArea,
	Stack,
	Text,
	Tooltip,
} from "@mantine/core";
import {
	FilePlus,
	FileText,
	Layers,
	LayoutDashboard,
	Plus,
	Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { loadInvoiceDefaults } from "@/features/invoice/details";
import { useInvoiceStore } from "@/features/invoice/store/invoiceStore";
import { InvoiceSummary } from "@/features/invoice/summary";
import { useFileUpload } from "../hooks/useFileUpload";
import { useScriptStore } from "../store/scriptEditorStore";
import { processDocuments, reparseHtmlToScript } from "../utils/documentParser";
import { GettingStarted } from "./GettingStarted";
import { ScriptEditor } from "./ScriptEditor";
import { UploadDocumentsOverview } from "./UploadDocumentsOverview";

export default function Scripts() {
	const { docFiles, handleFileChange, reset } = useFileUpload();

	const scripts = useScriptStore((s) => s.scripts);
	const addScripts = useScriptStore((s) => s.addScripts);
	const removeScript = useScriptStore((s) => s.removeScript);
	const removeScripts = useScriptStore((s) => s.removeScripts);

	const { invoice } = useInvoiceStore();

	const [activeScriptId, setActiveScriptId] = useState<string | null>(null);
	const [editingScriptId, setEditingScriptId] = useState<string | null>(null);
	const [initialSelectDone, setInitialSelectDone] = useState(false);

	const scriptIds = scripts.map((s) => s.id).join(",");

	useEffect(() => {
		if (!docFiles || docFiles.length === 0) return;
		let cancelled = false;
		processDocuments(docFiles).then((s) => {
			if (!cancelled) {
				addScripts(s);
				if (s.length > 0) {
					setActiveScriptId(s[0].id);
					setInitialSelectDone(true);
				}
				reset(); // Clear the temporary docFiles from hook
			}
		});
		return () => {
			cancelled = true;
		};
	}, [docFiles, addScripts, reset]);

	// Auto-select first script if none selected but scripts exist (initial load)
	useEffect(() => {
		if (
			!initialSelectDone &&
			scripts.length > 0 &&
			activeScriptId === null &&
			!docFiles.length
		) {
			setActiveScriptId(scripts[0].id);
			setInitialSelectDone(true);
		} else if (scripts.length === 0 && activeScriptId !== null) {
			// Clear active ID if all scripts were deleted
			setActiveScriptId(null);
			setInitialSelectDone(false);
		}
	}, [scripts, activeScriptId, docFiles.length, initialSelectDone]);

	// Clear editing state when active script changes
	useEffect(() => {
		setEditingScriptId(null);
	}, []);

	// Effect to handle selection fallback if the active one is removed
	useEffect(() => {
		if (activeScriptId !== null && scripts.length > 0) {
			const exists = scripts.some((s) => s.id === activeScriptId);
			if (!exists) {
				setActiveScriptId(scripts[0].id);
			}
		}
	}, [activeScriptId, scripts]);

	const handleStopEdit = useCallback(() => {
		setEditingScriptId(null);
	}, []);

	const handleStartEdit = useCallback((scriptId: string) => {
		setEditingScriptId(scriptId);
	}, []);

	const handlePasteProcessed = useCallback(
		(html: string) => {
			const { lines, overview, html: parsedHtml } = reparseHtmlToScript(html);

			if (lines.length === 0) {
				alert(
					"No billable dialogue or lines were found in the pasted content. Please check the format.",
				);
				return;
			}

			const newId = `pasted-${Date.now()}`;
			const newScript = {
				id: newId,
				name: `Pasted Content ${scripts.length + 1}`,
				source: document.implementation.createHTMLDocument(),
				lines,
				overview,
				html: parsedHtml,
			};

			addScripts([newScript]);
			setActiveScriptId(newId);
		},
		[scripts.length, addScripts],
	);

	const activeScript = scripts.find((s) => s.id === activeScriptId);
	const hasScripts = scripts.length > 0;
	const hasInvoiceItems = invoice.items.length > 0;

	return (
		<Flex
			h="100%"
			gap={0}
			className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm"
		>
			{/* Left Sidebar: Navigation */}
			<Box
				w={220}
				className="border-r border-slate-100 flex flex-col bg-slate-50/30"
			>
				<Stack gap="xs" p="md" className="flex-1 overflow-hidden">
					<Group justify="space-between" px="xs" mb="xs">
						<Text fw={800} size="xs" c="dimmed" tt="uppercase" lts={0.5}>
							Documents
						</Text>
						<Tooltip label="Add new document" position="right">
							<ActionIcon
								variant="light"
								color="studio"
								size="sm"
								radius="md"
								onClick={() => setActiveScriptId(null)}
							>
								<Plus size={16} />
							</ActionIcon>
						</Tooltip>
					</Group>

					<ScrollArea className="flex-1" type="hover" offsetScrollbars>
						<Stack gap={4}>
							{!hasScripts && (
								<NavLink
									label="Getting Started"
									leftSection={<LayoutDashboard size={18} strokeWidth={1.5} />}
									active={activeScriptId === null}
									onClick={() => setActiveScriptId(null)}
									variant="filled"
									color="studio"
									className="rounded-lg py-2.5 transition-all"
									styles={{
										label: { fontWeight: 600 },
									}}
								/>
							)}

							{hasScripts && (
								<Stack gap={4}>
									{scripts.map((script) => (
										<NavLink
											key={script.id}
											label={script.name}
											leftSection={<FileText size={18} strokeWidth={1.5} />}
											active={activeScriptId === script.id}
											onClick={() => setActiveScriptId(script.id)}
											variant="filled"
											color="studio"
											className="rounded-lg py-2.5 group"
											styles={{
												label: {
													fontWeight: activeScriptId === script.id ? 700 : 500,
													whiteSpace: "nowrap",
													overflow: "hidden",
													textOverflow: "ellipsis",
													fontSize: "var(--mantine-font-size-sm)",
												},
											}}
											rightSection={
												<ActionIcon
													variant="subtle"
													color="gray"
													size="xs"
													className="opacity-0 group-hover:opacity-100 transition-opacity"
													onClick={(e) => {
														e.stopPropagation();
														removeScript(script.id);
														if (activeScriptId === script.id) {
															// Selection logic is now handled by useEffect effects
														}
													}}
												>
													<Trash2 size={12} />
												</ActionIcon>
											}
										/>
									))}
								</Stack>
							)}
						</Stack>
					</ScrollArea>
				</Stack>
			</Box>

			{/* Main Content Area */}
			<Box className="flex-1 flex flex-col min-w-0 bg-white">
				{activeScript ? (
					<ScriptEditor
						script={activeScript}
						isEditing={editingScriptId === activeScript.id}
						onStartEdit={handleStartEdit}
						onStopEdit={handleStopEdit}
					/>
				) : (
					<GettingStarted
						onFileChange={(files) => handleFileChange(files)}
						onPasteProcessed={handlePasteProcessed}
					/>
				)}
			</Box>

			{/* Right Sidebar: Summary & Overview */}
			{(hasScripts || hasInvoiceItems) && (
				<Box
					w={320}
					className="border-l border-slate-100 flex flex-col bg-slate-50/30"
					visibleFrom="md"
				>
					<Stack gap="xl" p="lg" className="flex-1 overflow-y-auto">
						{hasScripts && (
							<Box>
								<Group gap="xs" mb="sm">
									<Layers size={16} className="text-studio-500" />
									<Text fw={800} size="xs" c="dimmed" tt="uppercase" lts={0.5}>
										Parsing Overview
									</Text>
								</Group>
								<UploadDocumentsOverview
									scripts={scripts}
									onAddedToInvoice={(addedIds) => {
										removeScripts(addedIds);
									}}
								/>
							</Box>
						)}

						{hasInvoiceItems && (
							<Box>
								<Group gap="xs" mb="sm">
									<FilePlus size={16} className="text-wave-500" />
									<Text fw={800} size="xs" c="dimmed" tt="uppercase" lts={0.5}>
										Invoice Summary
									</Text>
								</Group>
								<InvoiceSummary
									invoiceTitle={loadInvoiceDefaults().invoiceTitle}
									invoiceDate={loadInvoiceDefaults().invoiceDate}
								/>
							</Box>
						)}
					</Stack>
				</Box>
			)}
		</Flex>
	);
}
