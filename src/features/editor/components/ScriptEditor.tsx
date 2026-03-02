import { Button, Tabs } from "@mantine/core";
import { useScriptStore } from "../store/scriptEditorStore";
import type { Script } from "@/types/Script";
import { TextEditor } from "./TextEditor";
import { ScriptOverview } from "./ScriptOverview";

interface ScriptEditorProps {
	script: Script;
}

export function ScriptEditor({ script }: ScriptEditorProps) {
	const { updateHtml, resetScript } = useScriptStore((store) => store);

	return (
		<Tabs
			defaultValue={"editor"}
			color="rgba(0, 0, 0, 1)"
			variant="pills"
			radius="xs"
		>
			<Tabs.List grow>
				<Tabs.Tab value="editor">Editor</Tabs.Tab>
				<Tabs.Tab value="overview">Overview</Tabs.Tab>
			</Tabs.List>
			<Tabs.Panel value="editor">
				<TextEditor
					content={script.html}
					onContentChange={(newHtml) => {
						updateHtml(script.id, newHtml);
					}}
					additionalMenu={
						<Button variant="subtle" size="xs" onClick={() => resetScript(script.id)}>
							Reset to parsed
						</Button>
					}
				/>
			</Tabs.Panel>
			<Tabs.Panel value="overview">
				<ScriptOverview script={script} />
			</Tabs.Panel>
		</Tabs>
	);
}
