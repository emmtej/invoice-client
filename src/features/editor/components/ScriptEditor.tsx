import { Button, Flex } from "@mantine/core";
import { useScriptStore } from "../store/scriptEditorStore";
import type { Script } from "@/types/Script";
import { TextEditor } from "./TextEditor";
import { ScriptOverview } from "./ScriptOverview";

interface ScriptEditorProps {
	script: Script;
	isEditing: boolean;
	onStartEdit: () => void;
	onStopEdit: () => void;
}

export function ScriptEditor({
	script,
	isEditing,
	onStartEdit,
	onStopEdit,
}: ScriptEditorProps) {
	const { updateHtml, resetScript, updateScriptFromHtml } = useScriptStore(
		(store) => store,
	);

	if (!isEditing) {
		return <ScriptOverview script={script} onEdit={onStartEdit} />;
	}

	const handleSubmit = () => {
		updateScriptFromHtml(script.id, script.html);
		onStopEdit();
	};

	return (
		<TextEditor
			content={script.html}
			onContentChange={(html) => updateHtml(script.id, html)}
			additionalMenu={
				<Flex gap={3}>
					<Button variant="subtle" size="xs" onClick={onStopEdit}>
						Back to overview
					</Button>
					<Button size="xs" onClick={handleSubmit}>
						Submit
					</Button>
					<Button
						variant="subtle"
						size="xs"
						onClick={() => resetScript(script.id)}
					>
						Reset to parsed
					</Button>
				</Flex>
			}
		/>
	);
}
