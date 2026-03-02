import { useScriptStore } from "../store/scriptEditorStore";
import { processDocuments } from "../utils/documentParser";
import { Button, FileButton, Flex, Tabs, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { TextEditor } from "./TextEditor";
import { useFileUpload } from "../hooks/useFileUpload";
import { ScriptEditor } from "./ScriptEditor";

export default function Scripts() {
	const { docFiles, handleFileChange } = useFileUpload();
	const { scripts, setScripts } = useScriptStore((store) => store);

	// Default state - empty doc array
	const [activeTab, setActiveTab] = useState<string>("add");
	const [editingScriptId, setEditingScriptId] = useState<string | null>(null);

	useEffect(() => {
		if (!docFiles) return;
		processDocuments(docFiles).then((s) => setScripts(s));
	}, [docFiles, setScripts]);

	useEffect(() => {
		setActiveTab(scripts.length > 0 ? scripts[0].id : "add");
	}, [scripts]);

	return (
		<Tabs
			defaultValue={"add"}
			value={activeTab}
			onChange={(value) => {
				setActiveTab(value ? value : "add");
				setEditingScriptId(null);
			}}
			orientation="vertical"
		>
			<Tabs.List>
				{scripts && scripts.length > 0 && (
					<Text
						size="xs"
						fw={700}
						c="dimmed"
						tt="uppercase"
						pl="sm"
						mb={5}
						mt="md"
					>
						Uploaded Files
					</Text>
				)}
				{scripts.map((script) => (
					<Tabs.Tab key={script.id} value={script.id}>
						{script.name}
					</Tabs.Tab>
				))}
				<Tabs.Tab value="add">
					{scripts.length > 0 ? "Add Document" : "New Document"}
				</Tabs.Tab>
			</Tabs.List>
			{scripts.map((script) => (
				<Tabs.Panel key={script.id} value={script.id} keepMounted={false}>
					<ScriptEditor
						script={script}
						isEditing={editingScriptId === script.id}
						onStartEdit={() => setEditingScriptId(script.id)}
						onStopEdit={() => setEditingScriptId(null)}
					/>
				</Tabs.Panel>
			))}
			<Tabs.Panel value={"add"} keepMounted={false}>
				<TextEditor
					content=""
					onContentChange={() => {}}
					additionalMenu={
						<Flex gap={3}>
							<Button>Add to Invoice</Button>
							<FileButton
								onChange={handleFileChange}
								accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
								multiple
							>
								{(props) => <Button {...props}>Upload Document(s)</Button>}
							</FileButton>
						</Flex>
					}
				/>
			</Tabs.Panel>
		</Tabs>
	);
}
