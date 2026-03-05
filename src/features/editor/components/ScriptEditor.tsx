import { Button, Flex } from "@mantine/core";
import { memo, useCallback, useEffect } from "react";
import type { Script } from "@/types/Script";
import { useScriptStore } from "../store/scriptEditorStore";
import { ScriptOverview } from "./ScriptOverview";
import { TextEditor } from "./TextEditor";

const flexColumnStyle = { flex: 1, minHeight: 0 };

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
	const { updateHtml, resetScript, updateScriptFromHtml } = useScriptStore(
		(store) => store,
	);

	// Debounced reparse of the document while editing
	useEffect(() => {
		if (!isEditing) return;

		const timer = setTimeout(() => {
			updateScriptFromHtml(script.id, script.html);
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
			<Flex style={flexColumnStyle} direction="column">
				<ScriptOverview script={script} onEdit={handleStartEditClick} />
			</Flex>
		);
	}

	return (
		<Flex style={flexColumnStyle} direction="column">
			<TextEditor
				content={script.html}
				onContentChange={handleContentChange}
				additionalMenu={
					<Flex gap="sm">
						<Button variant="subtle" size="xs" onClick={onStopEdit}>
							Back to overview
						</Button>
						<Button size="xs" variant="filled" onClick={handleSubmit}>
							Submit
						</Button>
						<Button variant="subtle" size="xs" onClick={handleReset}>
							Reset to parsed
						</Button>
					</Flex>
				}
			/>
		</Flex>
	);
}

export const ScriptEditor = memo(ScriptEditorInner);
