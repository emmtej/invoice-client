import {
	ActionIcon,
	Alert,
	Badge,
	Box,
	Flex,
	Group,
	ScrollArea,
	Stack,
	Text,
	Tooltip,
} from "@mantine/core";
import {
	AlertCircle,
	FilePlus,
	FileText,
	Layers,
	LayoutDashboard,
	Plus,
	Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
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

	const { scripts, addScripts, removeScript, removeScripts } = useScriptStore(
		useShallow((s) => ({
			scripts: s.scripts,
			addScripts: s.addScripts,
			removeScript: s.removeScript,
			removeScripts: s.removeScripts,
		})),
	);

	const invoiceItemsLength = useInvoiceStore((s) => s.invoice.items.length);

	const [activeScriptId, setActiveScriptId] = useState<string | null>(null);
	const [editingScriptId, setEditingScriptId] = useState<string | null>(null);
	const [initialSelectDone, setInitialSelectDone] = useState(false);
	const [pasteError, setPasteError] = useState<string | null>(null);

	useEffect(() => {
		if (!docFiles || docFiles.length === 0) return;

		const s = processDocuments(docFiles);
		addScripts(s);
		if (s.length > 0) {
			setActiveScriptId(s[0].id);
			setInitialSelectDone(true);
		}
		reset(); // Clear the temporary docFiles from hook
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
		setPasteError(null);
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
				setPasteError(
					"No billable dialogue or lines were found in the pasted content. Please check the format.",
				);
				return;
			}

			const newScript = {
				id: `pasted-${Date.now()}`,
				name: `Pasted Content ${scripts.length + 1}`,
				source: document.implementation.createHTMLDocument(),
				lines,
				overview,
				html: parsedHtml,
			};

			addScripts([newScript]);
			setActiveScriptId(newScript.id);
			setPasteError(null);
		},
		[scripts.length, addScripts],
	);

	const activeScript = scripts.find((s) => s.id === activeScriptId);
	const hasScripts = scripts.length > 0;
	const hasInvoiceItems = invoiceItemsLength > 0;

	return (
		<Flex
			h="100%"
			direction="column"
			gap={0}
			className="overflow-hidden bg-transparent"
		>
			{/* Top Header: Horizontal Navigation - Only shown if scripts exist */}
			{hasScripts && (
				<Box className="border-b border-slate-100 bg-white px-4 py-2 shrink-0">
					<Group justify="space-between" align="center" wrap="nowrap" gap="xl">
						<ScrollArea
							className="flex-1"
							type="hover"
							scrollbars="x"
							offsetScrollbars={false}
							styles={{ viewport: { paddingBottom: 4 } }}
						>
							<Group gap={4} wrap="nowrap" align="center">
								<Tooltip
									label="Getting Started"
									position="bottom"
									openDelay={500}
								>
									<Box
										onClick={() => setActiveScriptId(null)}
										className={`
    								px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 border-b-2
    								${
											activeScriptId === null
												? "bg-slate-50 text-slate-900 border-slate-900"
												: "bg-transparent text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-50"
										}
    							`}
									>
										<LayoutDashboard
											size={16}
											strokeWidth={activeScriptId === null ? 2.5 : 2}
										/>
										<span>Getting Started</span>
									</Box>
								</Tooltip>

								<Box className="w-px h-5 bg-slate-200 mx-2" />

								<Group gap={4} wrap="nowrap">
									{scripts.map((script) => (
										<Tooltip
											key={script.id}
											label={script.name}
											position="bottom"
											openDelay={800}
										>
											<Box
												onClick={() => setActiveScriptId(script.id)}
												className={`
    											px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 border-b-2 group
    											${
														activeScriptId === script.id
															? "bg-slate-50 text-slate-900 border-slate-900"
															: "bg-transparent text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-50"
													}
    										`}
											>
												<FileText
													size={16}
													strokeWidth={activeScriptId === script.id ? 2.5 : 2}
												/>
												<span className="max-w-[150px] truncate">
													{script.name}
												</span>
												<ActionIcon
													variant="subtle"
													color={
														activeScriptId === script.id ? "studio" : "gray"
													}
													size="xs"
													className={`
    												transition-all rounded-md
    												${
															activeScriptId === script.id
																? "opacity-100 hover:bg-studio-50"
																: "opacity-0 group-hover:opacity-100"
														}
    											`}
													onClick={(e) => {
														e.stopPropagation();
														removeScript(script.id);
													}}
												>
													<Trash2 size={12} />
												</ActionIcon>
											</Box>
										</Tooltip>
									))}
								</Group>

								<Tooltip label="Upload new document" position="bottom">
									<ActionIcon
										variant="subtle"
										color="studio"
										size={32}
										radius="md"
										onClick={() => setActiveScriptId(null)}
										className="ml-2 hover:bg-studio-50 transition-all"
									>
										<Plus size={18} />
									</ActionIcon>
								</Tooltip>
							</Group>
						</ScrollArea>

						<Group gap="xs" visibleFrom="xs">
							<Badge
								variant="dot"
								color="studio"
								size="md"
								radius="md"
								className="bg-white border-slate-200 text-slate-600 px-3 h-8"
							>
								{scripts.length} Documents
							</Badge>
						</Group>
					</Group>
				</Box>
			)}

			{/* Main Content & Sidebar */}

			<Flex className="flex-1 min-h-0">
				{/* Main Content Area */}
				<Box className="flex-1 flex flex-col min-w-0 bg-white">
					{pasteError && (
						<Box px="lg" pt="md">
							<Alert
								icon={<AlertCircle size={16} />}
								title="Paste Error"
								color="red"
								withCloseButton
								onClose={() => setPasteError(null)}
								radius="md"
							>
								{pasteError}
							</Alert>
						</Box>
					)}
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
						w={300}
						className="border-l border-slate-100 flex flex-col bg-gray-0"
						visibleFrom="md"
					>
						<Stack gap="xl" p="lg" className="flex-1 overflow-y-auto">
							{hasScripts && (
								<Box>
									<Group gap="sm" mb="md" px={4}>
										<Layers size={18} className="text-studio-600" />
										<Text fw={900} size="xs" c="slate.6" tt="uppercase" lts={2}>
											Document Inspector
										</Text>
									</Group>
									<UploadDocumentsOverview
										scripts={scripts}
										onAddedToInvoice={(addedIds: string[]) => {
											removeScripts(addedIds);
										}}
									/>
								</Box>
							)}

							{hasInvoiceItems && (
								<Box>
									<Group gap="sm" mb="md" px={4}>
										<FilePlus size={18} className="text-wave-600" />
										<Text fw={900} size="xs" c="slate.6" tt="uppercase" lts={2}>
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
		</Flex>
	);
}
