import { Box, Button, SimpleGrid, Stack, Text, UnstyledButton } from "@mantine/core";
import { ArrowDown, ArrowUp } from "lucide-react";
import { SectionLabel } from "@/components/ui/text/SectionLabel";
import type { Folder, ScriptSummary } from "@/features/storage/types";
import { sortByName } from "../utils/sortByName";
import { FolderCard } from "./FolderCard";
import { ScriptLibraryTile } from "./ScriptLibraryTile";
import { FolderCardGrid } from "./FolderCardGrid";
import { ScriptLibraryTileGrid } from "./ScriptLibraryTileGrid";

interface ScriptsLibraryItemsProps {
	folders: Folder[];
	scripts: ScriptSummary[];
	folderItemCounts: Record<string, number>;
	sortAscending: boolean;
	onSortAscendingChange: (ascending: boolean) => void;
	selectedScriptId: string | null;
	selectedIds: string[];
	onNavigateFolder: (folderId: string) => void;
	onDeleteFolder: (folder: Folder) => void;
	onSelectScript: (scriptId: string) => void;
	onDeleteScript: (script: ScriptSummary) => void;
	onToggleSelection: (id: string, isMulti: boolean, isRange: boolean) => void;
	hasMoreScripts: boolean;
	isLoadingMore: boolean;
	onLoadMore: () => void;
	viewMode: "grid" | "list";
}

export function ScriptsLibraryItems({
	folders,
	scripts,
	folderItemCounts,
	sortAscending,
	onSortAscendingChange,
	selectedScriptId,
	selectedIds,
	onNavigateFolder,
	onDeleteFolder,
	onSelectScript,
	onDeleteScript,
	onToggleSelection,
	hasMoreScripts,
	isLoadingMore,
	onLoadMore,
	viewMode,
}: ScriptsLibraryItemsProps) {
	const sortedFolders = sortByName(folders, sortAscending);
	const sortedScripts = sortByName(scripts, sortAscending);

	const handleItemClick = (
		e: React.MouseEvent,
		id: string,
		onPrimaryAction: () => void,
	) => {
		const isMulti = e.ctrlKey || e.metaKey;
		const isRange = e.shiftKey;
		if (isMulti || isRange) {
			onToggleSelection(id, isMulti, isRange);
		} else {
			onToggleSelection(id, false, false);
			onPrimaryAction();
		}
	};

	if (viewMode === "grid") {
		return (
			<Stack gap="xl">
				<Box px="md">
					<UnstyledButton
						onClick={() => onSortAscendingChange(!sortAscending)}
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: "4px",
							padding: "4px 8px",
							marginLeft: "-8px",
							borderRadius: "var(--mantine-radius-sm)",
							transition: "background-color 150ms ease",
						}}
						styles={{
							root: {
								"&:hover": {
									backgroundColor: "rgba(0,0,0,0.03)",
								},
							},
						}}
					>
						<SectionLabel size="xs" c="dimmed">
							Name
						</SectionLabel>
						{sortAscending ? (
							<ArrowUp size={14} color="rgba(0,0,0,0.3)" />
						) : (
							<ArrowDown size={14} color="rgba(0,0,0,0.3)" />
						)}
					</UnstyledButton>
				</Box>

				{sortedFolders.length > 0 && (
					<Box>
						<Text size="sm" fw={600} c="dimmed" mb="md" px="md">
							Folders
						</Text>
						<SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="md">
							{sortedFolders.map((folder) => (
								<FolderCardGrid
									key={folder.id}
									folder={folder}
									itemCount={folderItemCounts[folder.id] ?? 0}
									isSelected={selectedIds.includes(folder.id)}
									onClick={(e) =>
										handleItemClick(e, folder.id, () => onNavigateFolder(folder.id))
									}
									onDelete={() => onDeleteFolder(folder)}
								/>
							))}
						</SimpleGrid>
					</Box>
				)}

				{sortedScripts.length > 0 && (
					<Box>
						<Text size="sm" fw={600} c="dimmed" mb="md" px="md">
							Files
						</Text>
						<SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="md">
							{sortedScripts.map((script) => (
								<ScriptLibraryTileGrid
									key={script.id}
									script={script}
									isSelected={
										script.id === selectedScriptId ||
										selectedIds.includes(script.id)
									}
									onClick={(e) =>
										handleItemClick(e, script.id, () => onSelectScript(script.id))
									}
									onDelete={() => onDeleteScript(script)}
								/>
							))}
						</SimpleGrid>
					</Box>
				)}

				{hasMoreScripts && (
					<Box ta="center" pt="sm">
						<Button
							variant="light"
							color="studio-blue"
							onClick={onLoadMore}
							loading={isLoadingMore}
						>
							Show more scripts
						</Button>
					</Box>
				)}
			</Stack>
		);
	}

	return (
		<Stack gap="lg">
			<Box px="md">
				<UnstyledButton
					onClick={() => onSortAscendingChange(!sortAscending)}
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: "4px",
						padding: "4px 8px",
						marginLeft: "-8px",
						borderRadius: "var(--mantine-radius-sm)",
						transition: "background-color 150ms ease",
					}}
					styles={{
						root: {
							"&:hover": {
								backgroundColor: "rgba(0,0,0,0.03)",
							},
						},
					}}
				>
					<SectionLabel size="xs" c="dimmed">
						Name
					</SectionLabel>
					{sortAscending ? (
						<ArrowUp size={14} color="rgba(0,0,0,0.3)" />
					) : (
						<ArrowDown size={14} color="rgba(0,0,0,0.3)" />
					)}
				</UnstyledButton>
			</Box>

			{sortedFolders.length > 0 && (
				<Stack gap="xs" w="100%">
					{sortedFolders.map((folder) => (
						<FolderCard
							key={folder.id}
							folder={folder}
							itemCount={folderItemCounts[folder.id] ?? 0}
							isSelected={selectedIds.includes(folder.id)}
							onClick={(e) =>
								handleItemClick(e, folder.id, () => onNavigateFolder(folder.id))
							}
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
							isSelected={
								script.id === selectedScriptId ||
								selectedIds.includes(script.id)
							}
							onClick={(e) =>
								handleItemClick(e, script.id, () => onSelectScript(script.id))
							}
							onDelete={() => onDeleteScript(script)}
						/>
					))}
				</Stack>
			)}

			{hasMoreScripts && (
				<Box ta="center" pt="sm">
					<Button
						variant="light"
						color="studio-blue"
						onClick={onLoadMore}
						loading={isLoadingMore}
					>
						Show more scripts
					</Button>
				</Box>
			)}
		</Stack>
	);
}
