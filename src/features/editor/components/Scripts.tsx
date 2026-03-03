import { useScriptStore } from "../store/scriptEditorStore";
import { processDocuments } from "../utils/documentParser";
import { Box, Button, FileButton, Flex, Tabs, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { TextEditor } from "./TextEditor";
import { useFileUpload } from "../hooks/useFileUpload";
import { ScriptEditor } from "./ScriptEditor";
import { UploadDocumentsOverview } from "./UploadDocumentsOverview";

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
			defaultValue="add"
			value={activeTab}
			onChange={(value) => {
				setActiveTab(value ? value : "add");
				setEditingScriptId(null);
			}}
			variant="outline"
			radius="md"
			style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}
		>
			<Tabs.List mb="md">
				{scripts.map((script) => (
					<Tabs.Tab key={script.id} value={script.id}>
						{script.name}
					</Tabs.Tab>
				))}
				<Tabs.Tab value="add">
					<Text fw={700} c="dimmed" tt="uppercase" fz="xs">
					{scripts.length > 0 ? "Add Document" : "New Document"}
					</Text>
				</Tabs.Tab>
			</Tabs.List>

			<Flex gap="md" align="flex-start" style={{ flex: 1, minHeight: 0 }}>
				<Box style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column" }}>
					{scripts.map((script) => (
						<Tabs.Panel 
							key={script.id} 
							value={script.id} 
							keepMounted={false}
							style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
						>
							<ScriptEditor
								script={script}
								isEditing={editingScriptId === script.id}
								onStartEdit={() => setEditingScriptId(script.id)}
								onStopEdit={() => setEditingScriptId(null)}
							/>
						</Tabs.Panel>
					))}
					<Tabs.Panel 
						value="add" 
						keepMounted={false}
						style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
					>
						<TextEditor
							content=""
							onContentChange={() => {}}
							additionalMenu={
								<Flex gap="xs" align="center">
									<Button variant="filled" size="xs">
										Add to Invoice
									</Button>
									<FileButton
										onChange={handleFileChange}
										accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
										multiple
									>
										{(props) => (
											<Button {...props} variant="default" size="xs">
												Upload Document(s)
											</Button>
										)}
									</FileButton>
								</Flex>
							}
						/>
					</Tabs.Panel>
				</Box>

				{/* Future Documents Overview Placeholder */}
				<Box
					w={300}
					visibleFrom="md"
					pl="md"
					h="100%"
					style={{
						borderLeft: "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))",
						overflowY: "auto",
					}}
				>
					<Text fw={700} mb="sm" c="dimmed" tt="uppercase" fz="xs">
						Documents Overview
					</Text>
					<UploadDocumentsOverview scripts={scripts} />
				</Box>
			</Flex>
		</Tabs>
	);
}
