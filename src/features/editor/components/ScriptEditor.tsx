import { Box, Button, Group } from "@mantine/core";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import { memo, useCallback, useEffect } from "react";
import type { Script } from "@/types/Script";
import { useScriptStore } from "../store/scriptEditorStore";
import { ScriptOverview } from "./ScriptOverview";
import { TextEditor } from "./TextEditor";

interface ScriptEditorProps {
	script: Script;
	isEditing: boolean;
	onStartEdit: (scriptId: string) => void;
	onStopEdit: () => void;
}

function ScriptEditorInner({
	script,
	isEditing,
	onStartEdit,
	onStopEdit,
}: ScriptEditorProps) {
	const updateHtml = useScriptStore((s) => s.updateHtml);
	const resetScript = useScriptStore((s) => s.resetScript);
	const updateScriptFromHtml = useScriptStore((s) => s.updateScriptFromHtml);

	// Debounced reparse of the document while editing
	// This only updates lines and overview (word counts) but preserves the current HTML
	useEffect(() => {
		if (!isEditing) return;

		const timer = setTimeout(() => {
			// Pass 'false' to avoid overwriting editor HTML with re-generated/formatted HTML
			updateScriptFromHtml(script.id, script.html, false);
		}, 500);

		return () => clearTimeout(timer);
	}, [script.id, script.html, isEditing, updateScriptFromHtml]);

	const handleContentChange = useCallback(
		(html: string) => {
			updateHtml(script.id, html);
		},
		[script.id, updateHtml],
	);

	const handleReset = useCallback(() => {
		resetScript(script.id);
	}, [script.id, resetScript]);

	const handleSubmit = useCallback(() => {
		updateScriptFromHtml(script.id, script.html);
		onStopEdit();
	}, [script.id, script.html, updateScriptFromHtml, onStopEdit]);

	const handleStartEditClick = useCallback(() => {
		onStartEdit(script.id);
	}, [onStartEdit, script.id]);

	if (!isEditing) {
		return (
			<Box className="flex-1 flex flex-col min-h-0">
				<ScriptOverview script={script} onEdit={handleStartEditClick} />
			</Box>
		);
	}

	return (
		<Box className="flex-1 flex flex-col min-h-0 bg-white">
			<TextEditor
				content={script.html}
				onContentChange={handleContentChange}
				additionalMenu={
					<Group gap="xs">
						<Button
							variant="subtle"
							color="gray"
							size="xs"
							leftSection={<ArrowLeft size={14} />}
							onClick={onStopEdit}
							radius="md"
						>
							Back to overview
						</Button>
						<Button
							variant="subtle"
							color="orange"
							size="xs"
							leftSection={<RotateCcw size={14} />}
							onClick={handleReset}
							radius="md"
						>
							Reset Changes
						</Button>
						<Button
							size="xs"
							color="studio"
							variant="filled"
							leftSection={<Check size={14} />}
							onClick={handleSubmit}
							radius="md"
							className="shadow-sm shadow-studio-100"
						>
							Finish Editing
						</Button>
					</Group>
				}
			/>
		</Box>
	);
}

export const ScriptEditor = memo(ScriptEditorInner);
