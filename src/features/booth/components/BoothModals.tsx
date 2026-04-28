import { Box } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
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

	const [isScriptEditorEditing, setIsScriptEditorEditing] = useState(true);

	const { activeScript, loadScript, closeActiveScript } = useScriptStore(
		useShallow((s) => ({
			activeScript: s.activeScript,
			loadScript: s.loadScript,
			closeActiveScript: s.closeActiveScript,
		})),
	);

	const handleCloseScriptEditor = useCallback(() => {
		setIsScriptEditorEditing(false);
		setEditorOpened(false);
		closeActiveScript();
	}, [setEditorOpened, closeActiveScript]);

	// Load script when editor opens
	useEffect(() => {
		if (isEditorOpened && script) {
			if (activeScript?.id !== script.id) {
				loadScript(script.id);
			}
			setIsScriptEditorEditing(true);
		}
	}, [isEditorOpened, script, activeScript?.id, loadScript]);

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
				{activeScript && (
					<ScriptEditor
						script={activeScript}
						isEditing={isScriptEditorEditing}
						onStartEdit={() => setIsScriptEditorEditing(true)}
						onStopEdit={() => setIsScriptEditorEditing(false)}
					/>
				)}
			</Box>
		</AppModal>
	);
}
