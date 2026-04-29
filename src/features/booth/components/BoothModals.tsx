import { Box } from "@mantine/core";
import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { AppModal } from "@/components/ui/modal/AppModal";
import { useScriptStore } from "@/features/editor";
import { ScriptEditor } from "@/features/editor/components/ScriptEditor";
import { useBoothStore } from "../store/useBoothStore";

export function BoothModals() {
	const { script, isEditorOpened, setEditorOpened, updateScript } =
		useBoothStore(
			useShallow((s) => ({
				script: s.script,
				isEditorOpened: s.isEditorOpened,
				setEditorOpened: s.setEditorOpened,
				updateScript: s.updateScript,
			})),
		);

	const { activeScript, loadScript, closeActiveScript, setEditingScriptId } =
		useScriptStore(
			useShallow((s) => ({
				activeScript: s.activeScript,
				loadScript: s.loadScript,
				closeActiveScript: s.closeActiveScript,
				setEditingScriptId: s.setEditingScriptId,
			})),
		);

	const handleCloseScriptEditor = useCallback(() => {
		setEditingScriptId(null);
		setEditorOpened(false);
		closeActiveScript();
	}, [setEditorOpened, closeActiveScript, setEditingScriptId]);

	// Load script and force editing mode when editor opens
	useEffect(() => {
		if (isEditorOpened && script) {
			if (activeScript?.id !== script.id) {
				loadScript(script.id);
			}
			setEditingScriptId(script.id);
		}
	}, [isEditorOpened, script, activeScript?.id, loadScript, setEditingScriptId]);

	// Sync changes from editor back to booth session
	useEffect(() => {
		if (!isEditorOpened || !script || !activeScript) return;

		// Only update if it's the same script and content has changed
		if (
			activeScript.id === script.id &&
			(activeScript.html !== script.html ||
				activeScript.lines.length !== script.lines.length)
		) {
			updateScript(activeScript);
		}
	}, [isEditorOpened, script, activeScript, updateScript]);

	return (
		<AppModal
			opened={isEditorOpened}
			onClose={handleCloseScriptEditor}
			title={script ? `Script Editor: ${script.name}` : "Script Editor"}
			size="90vw"
		>
			<Box h="70vh" mih={500}>
				{activeScript && <ScriptEditor script={activeScript} />}
			</Box>
		</AppModal>
	);
}
