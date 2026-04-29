import { Alert, Box, Flex } from "@mantine/core";
import { AlertCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { SaveToLibraryModal } from "@/features/storage";
import { notify } from "@/utils/notifications";
import { useFileUpload } from "../hooks/useFileUpload";
import { usePasteHandler } from "../hooks/usePasteHandler";
import { useScriptModals } from "../hooks/useScriptModals";
import { useScriptStore } from "../store/scriptEditorStore";
import { processDocuments } from "../utils/documentParser";
import { ClearAllScriptsModal } from "./ClearAllScriptsModal";
import { GettingStarted } from "./GettingStarted";
import { ScriptEditor } from "./ScriptEditor";
import { ScriptsLoading } from "./ScriptsLoading";
import { WorkspaceExplorer } from "./WorkspaceExplorer";

export default function Scripts() {
	const {
		docFiles,
		handleFileChange,
		reset,
		isLoading: isUploading,
		processedCount,
		totalCount,
	} = useFileUpload();

	const {
		scripts,
		activeScript,
		activeScriptId,
		addScripts,
		removeScript,
		removeScripts,
		init,
		selectScript,
		isLoading: isStoreLoading,
		persistenceEnabled,
		promoteScriptsToLibrary,
	} = useScriptStore(
		useShallow((s) => ({
			scripts: s.scripts,
			activeScript: s.activeScript,
			activeScriptId: s.activeScriptId,
			addScripts: s.addScripts,
			removeScript: s.removeScript,
			removeScripts: s.removeScripts,
			init: s.init,
			selectScript: s.selectScript,
			isLoading: s.isLoading,
			persistenceEnabled: s.persistenceEnabled,
			promoteScriptsToLibrary: s.promoteScriptsToLibrary,
		})),
	);

	const [isProcessing, setIsProcessing] = useState(false);
	const modals = useScriptModals();
	const { pasteError, clearPasteError, handlePasteProcessed } =
		usePasteHandler(scripts.length);

	useEffect(() => {
		init();
	}, [init]);

	// Restore activeScript if cleared externally (e.g. booth editor modal close)
	useEffect(() => {
		if (activeScriptId !== null && activeScript === null && !isStoreLoading) {
			void selectScript(activeScriptId);
		}
	}, [activeScriptId, activeScript, isStoreLoading, selectScript]);

	useEffect(() => {
		if (!docFiles || docFiles.length === 0) return;

		const handleProcessing = async () => {
			setIsProcessing(true);
			try {
				const processed = await processDocuments(docFiles);
				await addScripts(processed);
				if (processed.length > 0) {
					await selectScript(processed[0].id);
				}
				reset();
			} finally {
				setIsProcessing(false);
			}
		};

		handleProcessing();
	}, [docFiles, addScripts, reset, selectScript]);

	const handleConfirmClearAll = useCallback(async () => {
		const count = scripts.length;
		await removeScripts(scripts.map((s) => s.id));
		// Reset file upload state in case an upload was pending
		reset();
		clearPasteError();
		modals.clearAll.close();
		notify.success({
			message: `Cleared ${count} ${count === 1 ? "draft" : "drafts"}`,
		});
	}, [scripts, removeScripts, reset, clearPasteError, modals.clearAll]);

	const isBusy = isStoreLoading || isUploading || isProcessing;

	if (isBusy) {
		const message = isUploading
			? `Uploading documents (${processedCount}/${totalCount})...`
			: isProcessing
				? "Analyzing script structure..."
				: undefined;
		const subtext = isUploading
			? "Converting Word documents to HTML"
			: isProcessing
				? "Identifying dialogue and speakers"
				: undefined;

		return (
			<ScriptsLoading
				persistenceEnabled={persistenceEnabled}
				message={message}
				subtext={subtext}
			/>
		);
	}

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
				<Flex direction="column" flex={1} miw={0} bg="transparent">
					{pasteError && (
						<Box px="lg" pt="md">
							<Alert
								icon={<AlertCircle size={16} />}
								title="Paste Error"
								color="red"
								withCloseButton
								onClose={clearPasteError}
							>
								{pasteError}
							</Alert>
						</Box>
					)}
					{activeScript ? (
						<ScriptEditor script={activeScript} />
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
						onSelect={selectScript}
						onRemove={removeScript}
						onOpenSaveModal={modals.save.open}
						onOpenClearAll={modals.clearAll.open}
					/>
				)}
			</Flex>

			<ClearAllScriptsModal
				opened={modals.clearAll.opened}
				onClose={modals.clearAll.close}
				onConfirm={handleConfirmClearAll}
			/>

			<SaveToLibraryModal
				opened={modals.save.opened}
				onClose={modals.save.close}
				scripts={scripts}
				onConfirm={promoteScriptsToLibrary}
			/>
		</Flex>
	);
}
