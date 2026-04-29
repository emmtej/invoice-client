import { Button, Flex, Group } from "@mantine/core";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import type { Script } from "@/types/Script";
import { useScriptStore } from "../store/scriptEditorStore";
import { ScriptOverview } from "./ScriptOverview";
import { TextEditor } from "./TextEditor";

interface ScriptEditorProps {
	script: Script;
}

function ScriptEditorInner({ script }: ScriptEditorProps) {
	const resetScript = useScriptStore((s) => s.resetScript);
	const syncScriptFromHtml = useScriptStore((s) => s.syncScriptFromHtml);
	const editingScriptId = useScriptStore((s) => s.editingScriptId);
	const setEditingScriptId = useScriptStore((s) => s.setEditingScriptId);

	const isEditing = editingScriptId === script.id;

	const [localHtml, setLocalHtml] = useState(script.html);

	useEffect(() => {
		if (!isEditing) {
			setLocalHtml(script.html);
		}
	}, [script.html, isEditing]);

	// Debounced sync of HTML and reparse of the document while editing
	useEffect(() => {
		if (!isEditing) return;

		const timer = setTimeout(() => {
			// One action avoids double-write races during rapid typing.
			void syncScriptFromHtml(script.id, localHtml, false);
		}, 500);

		return () => clearTimeout(timer);
	}, [script.id, localHtml, isEditing, syncScriptFromHtml]);

	const handleContentChange = useCallback((html: string) => {
		setLocalHtml(html);
	}, []);

	const handleReset = useCallback(() => {
		resetScript(script.id);
		setEditingScriptId(null);
	}, [script.id, resetScript, setEditingScriptId]);

	const handleSubmit = useCallback(() => {
		void syncScriptFromHtml(script.id, localHtml);
		setEditingScriptId(null);
	}, [script.id, localHtml, syncScriptFromHtml, setEditingScriptId]);

	const handleStartEditClick = useCallback(() => {
		setEditingScriptId(script.id);
	}, [setEditingScriptId, script.id]);

	if (!isEditing) {
		return (
			<Flex direction="column" flex={1} mih={0}>
				<ScriptOverview script={script} onEdit={handleStartEditClick} />
			</Flex>
		);
	}

	return (
		<Flex direction="column" flex={1} mih={0} bg="transparent">
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
							onClick={() => setEditingScriptId(null)}
						>
							Back to overview
						</Button>
						<Button
							variant="subtle"
							color="terracotta"
							size="xs"
							leftSection={<RotateCcw size={14} />}
							onClick={handleReset}
						>
							Reset Changes
						</Button>
						<Button
							size="xs"
							color="forest"
							variant="filled"
							leftSection={<Check size={14} />}
							onClick={handleSubmit}
						>
							Finish Editing
						</Button>
					</Group>
				}
			/>
		</Flex>
	);
}

export const ScriptEditor = memo(ScriptEditorInner);
