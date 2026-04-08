import { Group, SegmentedControl, Stack } from "@mantine/core";
import type { Folder, ScriptSummary } from "@/features/storage/types";
import { sortByName } from "../utils/sortByName";
import { FolderCard } from "./FolderCard";
import { ScriptLibraryTile } from "./ScriptLibraryTile";

interface ScriptsLibraryItemsProps {
	folders: Folder[];
	scripts: ScriptSummary[];
	sortAscending: boolean;
	onSortAscendingChange: (ascending: boolean) => void;
	selectedScriptId: string | null;
	onNavigateFolder: (folderId: string) => void;
	onDeleteFolder: (folder: Folder) => void;
	onSelectScript: (scriptId: string) => void;
	onDeleteScript: (script: ScriptSummary) => void;
}

export function ScriptsLibraryItems({
	folders,
	scripts,
	sortAscending,
	onSortAscendingChange,
	selectedScriptId,
	onNavigateFolder,
	onDeleteFolder,
	onSelectScript,
	onDeleteScript,
}: ScriptsLibraryItemsProps) {
	const sortedFolders = sortByName(folders, sortAscending);
	const sortedScripts = sortByName(scripts, sortAscending);

	return (
		<Stack gap="lg">
			<Group justify="flex-end">
				<SegmentedControl
					size="sm"
					value={sortAscending ? "asc" : "desc"}
					onChange={(v) => onSortAscendingChange(v === "asc")}
					data={[
						{ label: "A–Z", value: "asc" },
						{ label: "Z–A", value: "desc" },
					]}
				/>
			</Group>

			{sortedFolders.length > 0 && (
				<Stack gap="xs" w="100%">
					{sortedFolders.map((folder) => (
						<FolderCard
							key={folder.id}
							folder={folder}
							onClick={() => onNavigateFolder(folder.id)}
							onDelete={() => onDeleteFolder(folder)}
						/>
					))}
				</Stack>
			)}

			{sortedScripts.length > 0 && (
				<Stack gap="xs" w="100%">
					{sortedScripts.map((script) => (
						<ScriptLibraryTile
							key={script.id}
							script={script}
							isSelected={script.id === selectedScriptId}
							onClick={() => onSelectScript(script.id)}
							onDelete={() => onDeleteScript(script)}
						/>
					))}
				</Stack>
			)}
		</Stack>
	);
}
