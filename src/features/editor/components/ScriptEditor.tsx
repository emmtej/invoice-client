import { Button, Flex, Group } from "@mantine/core";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
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
			updateHtml(script.id, localHtml);
			// Pass 'false' to avoid overwriting editor HTML with re-generated/formatted HTML
			updateScriptFromHtml(script.id, localHtml, false);
		}, 500);

		return () => clearTimeout(timer);
	}, [script.id, localHtml, isEditing, updateHtml, updateScriptFromHtml]);

	const handleContentChange = useCallback((html: string) => {
		setLocalHtml(html);
	}, []);

	const handleReset = useCallback(() => {
		resetScript(script.id);
		// Local state will sync because the component might not re-mount but we need to force it.
		// Since we don't have the original html here synchronously, it will eventually update from store
		// if we briefly stop editing, but we can't easily do that.
		// Actually, resetScript updates script.html in the store. We can add an effect that watches script.html
		// and syncs localHtml if they differ and it's a reset. For now, onStopEdit() is a good way to see it.
		onStopEdit();
	}, [script.id, resetScript, onStopEdit]);

	const handleSubmit = useCallback(() => {
		updateHtml(script.id, localHtml);
		updateScriptFromHtml(script.id, localHtml);
		onStopEdit();
	}, [script.id, localHtml, updateHtml, updateScriptFromHtml, onStopEdit]);

	const handleStartEditClick = useCallback(() => {
		onStartEdit(script.id);
	}, [onStartEdit, script.id]);

	if (!isEditing) {
		return (
			<Flex direction="column" flex={1} mih={0}>
				<ScriptOverview script={script} onEdit={handleStartEditClick} />
			</Flex>
		);
	}

	return (
		<Flex direction="column" flex={1} mih={0} bg="white">
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
						>
							Back to overview
						</Button>
						<Button
							variant="subtle"
							color="orange"
							size="xs"
							leftSection={<RotateCcw size={14} />}
							onClick={handleReset}
						>
							Reset Changes
						</Button>
						<Button
							size="xs"
							color="wave"
							variant="filled"
							leftSection={<Check size={14} />}
							onClick={handleSubmit}
							className="shadow-sm shadow-wave-100"
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
