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
		return (
			<Flex style={{ flex: 1, minHeight: 0 }} direction="column">
				<ScriptOverview script={script} onEdit={onStartEdit} />
			</Flex>
		);
	}

	const handleSubmit = () => {
		updateScriptFromHtml(script.id, script.html);
		onStopEdit();
	};

	return (
		<Flex style={{ flex: 1, minHeight: 0 }} direction="column">
			<TextEditor
				content={script.html}
				onContentChange={(html) => updateHtml(script.id, html)}
				additionalMenu={
					<Flex gap="sm">
						<Button variant="subtle" size="xs" onClick={onStopEdit}>
							Back to overview
						</Button>
						<Button size="xs" variant="filled" onClick={handleSubmit}>
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
		</Flex>
	);
}
