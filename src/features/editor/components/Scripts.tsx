import { Alert, Box, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AlertCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useFileUpload } from "../hooks/useFileUpload";
import { useScriptStore } from "../store/scriptEditorStore";
import { processDocuments, reparseHtmlToScript } from "../utils/documentParser";
import { ClearAllScriptsModal } from "./ClearAllScriptsModal";
import { GettingStarted } from "./GettingStarted";
import { SaveToStorageModal } from "./SaveToStorageModal";
import { ScriptEditor } from "./ScriptEditor";
import { ScriptsLoading } from "./ScriptsLoading";
import { WorkspaceExplorer } from "./WorkspaceExplorer";
import { pgliteStore } from "../store/pgliteStore";

/**
 * Main Scripts Feature Component
 * Manages the collection of scripts, their selection, and the editor layout.
 */
export default function Scripts() {
	const { docFiles, handleFileChange, reset } = useFileUpload();

	const {
		scripts,
		addScripts,
		removeScript,
		removeScripts,
		init,
		isLoading,
		persistenceEnabled,
	} = useScriptStore(
		useShallow((s) => ({
			scripts: s.scripts,
			addScripts: s.addScripts,
			removeScript: s.removeScript,
			removeScripts: s.removeScripts,
			init: s.init,
			isLoading: s.isLoading,
			persistenceEnabled: s.persistenceEnabled,
		})),
	);

	// Initial store initialization
	useEffect(() => {
		init();
	}, [init]);

	// Local UI State
	const [activeScriptId, setActiveScriptId] = useState<string | null>(null);
	const [editingScriptId, setEditingScriptId] = useState<string | null>(null);
	const [initialSelectDone, setInitialSelectDone] = useState(false);
	const [pasteError, setPasteError] = useState<string | null>(null);

	const [
		clearAllModalOpened,
		{ open: openClearAllModal, close: closeClearAllModal },
	] = useDisclosure(false);

	const [
		saveModalOpened,
		{ open: openSaveModal, close: closeSaveModal },
	] = useDisclosure(false);

	/**
	 * Logic: File Processing
	 * Converts uploaded DocFiles into Scripts and adds them to the store.
	 */
	useEffect(() => {
		if (!docFiles || docFiles.length === 0) return;

		const processed = processDocuments(docFiles);
		addScripts(processed);

		if (processed.length > 0) {
			setActiveScriptId(processed[0].id);
			setInitialSelectDone(true);
		}
		reset(); // Clear temporary file state
	}, [docFiles, addScripts, reset]);

	/**
	 * Logic: Auto-selection Fallback
	 * Ensures a script is selected if available.
	 */
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
			setActiveScriptId(null);
			setInitialSelectDone(false);
		}
	}, [scripts, activeScriptId, docFiles.length, initialSelectDone]);

	/**
	 * Logic: Selection Sync
	 * Handles cases where the active script is removed from the list.
	 */
	useEffect(() => {
		if (activeScriptId !== null && scripts.length > 0) {
			const exists = scripts.some((s) => s.id === activeScriptId);
			if (!exists) {
				setActiveScriptId(scripts[0].id);
			}
		}
	}, [activeScriptId, scripts]);

	// Handlers
	const handleConfirmClearAll = useCallback(async () => {
		await removeScripts(scripts.map((s) => s.id));
		reset();
		setActiveScriptId(null);
		setInitialSelectDone(false);
		setEditingScriptId(null);
		setPasteError(null);
		closeClearAllModal();
	}, [scripts, removeScripts, reset, closeClearAllModal]);

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

	const handleSaveToStorage = useCallback(
		async (ids: string[], groupName: string, label: string) => {
			const selectedScripts = scripts
				.filter((s) => ids.includes(s.id))
				.map((s) => ({
					...s,
					groupName,
					label,
				}));

			if (persistenceEnabled) {
				await pgliteStore.saveScripts(selectedScripts);
			}
		},
		[scripts, persistenceEnabled],
	);

	if (isLoading) {
		return <ScriptsLoading persistenceEnabled={persistenceEnabled} />;
	}

	const activeScript = scripts.find((s) => s.id === activeScriptId);
	const hasScripts = scripts.length > 0;

	return (
		<Flex
			h="100%"
			direction="column"
			gap={0}
			className="overflow-hidden bg-transparent"
		>
			<Flex flex={1} mih={0}>
				{/* Main Editor Area */}
				<Flex direction="column" flex={1} miw={0} bg="white">
					{pasteError && (
						<Box px="lg" pt="md">
							<Alert
								icon={<AlertCircle size={16} />}
								title="Paste Error"
								color="red"
								withCloseButton
								onClose={() => setPasteError(null)}
							>
								{pasteError}
							</Alert>
						</Box>
					)}
					{activeScript ? (
						<ScriptEditor
							script={activeScript}
							isEditing={editingScriptId === activeScript.id}
							onStartEdit={setEditingScriptId}
							onStopEdit={() => setEditingScriptId(null)}
						/>
					) : (
						<GettingStarted
							onFileChange={handleFileChange}
							onPasteProcessed={handlePasteProcessed}
						/>
					)}
				</Flex>

				{/* Right Sidebar: Workspace Explorer */}
				{hasScripts && (
					<WorkspaceExplorer
						scripts={scripts}
						activeScriptId={activeScriptId}
						onSelect={setActiveScriptId}
						onRemove={removeScript}
						onOpenSaveModal={openSaveModal}
					/>
				)}
			</Flex>

			<ClearAllScriptsModal
				opened={clearAllModalOpened}
				onClose={closeClearAllModal}
				onConfirm={handleConfirmClearAll}
			/>

			<SaveToStorageModal
				opened={saveModalOpened}
				onClose={closeSaveModal}
				scripts={scripts}
				onConfirm={handleSaveToStorage}
			/>
		</Flex>
	);
}
