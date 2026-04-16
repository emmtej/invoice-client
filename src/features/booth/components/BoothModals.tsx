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

	const editorScripts = useScriptStore((s) => s.scripts);

	const handleCloseScriptEditor = useCallback(() => {
		setIsScriptEditorEditing(false);
		setEditorOpened(false);
	}, [setEditorOpened]);

	const scriptInEditorStore = script
		? (editorScripts.find((s) => s.id === script.id) ?? null)
		: null;

	useEffect(() => {
		if (!isEditorOpened || !script || !scriptInEditorStore) return;
		// Only update if it's the same script and content has changed
		if (
			scriptInEditorStore.id === script.id &&
			scriptInEditorStore.html !== script.html
		) {
			updateScript(scriptInEditorStore);
		}
	}, [isEditorOpened, script, scriptInEditorStore, updateScript]);

	return (
		<AppModal
			opened={isEditorOpened}
			onClose={handleCloseScriptEditor}
			title={script ? `Script Editor: ${script.name}` : "Script Editor"}
			size="90vw"
		>
			<Box h="70vh" mih={500}>
				{scriptInEditorStore && (
					<ScriptEditor
						script={scriptInEditorStore}
						isEditing={isScriptEditorEditing}
						onStartEdit={() => setIsScriptEditorEditing(true)}
						onStopEdit={() => setIsScriptEditorEditing(false)}
					/>
				)}
			</Box>
		</AppModal>
	);
}
