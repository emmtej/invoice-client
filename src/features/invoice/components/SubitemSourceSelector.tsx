import { MultiSelect, Stack, Tabs, Text } from "@mantine/core";
import { FileUp, Library } from "lucide-react";
import { DocxUploadButton } from "@/components/ui/button/DocxUploadButton";
import type { ScriptForInvoice } from "../store/invoiceStore";

interface SubitemSourceSelectorProps {
	activeTab: "upload" | "library";
	onTabChange: (tab: "upload" | "library") => void;
	onFileUpload: (files: File[]) => void;
	uploadedScripts: ScriptForInvoice[];
	libraryScripts: ScriptForInvoice[];
	selectedLibraryScriptIds: string[];
	onLibrarySelectionChange: (ids: string[]) => void;
}

export function SubitemSourceSelector({
	activeTab,
	onTabChange,
	onFileUpload,
	uploadedScripts,
	libraryScripts,
	selectedLibraryScriptIds,
	onLibrarySelectionChange,
}: SubitemSourceSelectorProps) {
	return (
		<Tabs
			value={activeTab}
			onChange={(val) => onTabChange(val as "upload" | "library")}
			color="blue"
		>
			<Tabs.List grow>
				<Tabs.Tab value="upload" leftSection={<FileUp size={16} />}>
					Upload New
				</Tabs.Tab>
				<Tabs.Tab value="library" leftSection={<Library size={16} />}>
					Select from Library
				</Tabs.Tab>
			</Tabs.List>

			<Tabs.Panel value="upload" pt="md">
				<Stack gap="sm">
					<DocxUploadButton onChange={onFileUpload} multiple>
						Upload Script(s)
					</DocxUploadButton>
					{uploadedScripts.length > 0 && (
						<Stack gap={4}>
							<Text size="xs" fw={700} c="dimmed">
								UPLOADED DOCUMENTS:
							</Text>
							{uploadedScripts.map((s) => (
								<Text key={s.id} size="sm">
									• {s.name} ({s.overview.wordCount} words)
								</Text>
							))}
						</Stack>
					)}
				</Stack>
			</Tabs.Panel>

			<Tabs.Panel value="library" pt="md">
				<MultiSelect
					label="Library Scripts"
					placeholder="Search and select scripts"
					data={libraryScripts.map((s) => ({
						value: s.id,
						label: `${s.name} (${s.overview.wordCount} words)`,
					}))}
					value={selectedLibraryScriptIds}
					onChange={onLibrarySelectionChange}
					searchable
					clearable
					nothingFoundMessage="No scripts found"
				/>
			</Tabs.Panel>
		</Tabs>
	);
}
