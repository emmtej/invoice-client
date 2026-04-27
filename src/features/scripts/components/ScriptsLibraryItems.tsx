import { Box, Button, SimpleGrid, Stack, Text, UnstyledButton } from "@mantine/core";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { SectionLabel } from "@/components/ui/text/SectionLabel";
import { useScriptsDataStore } from "../store/useScriptsDataStore";
import { useScriptsUiStore } from "../store/useScriptsUiStore";
import { useScriptsModalsStore } from "./ScriptsModals";
import { sortByName } from "../utils/sortByName";
import { FolderCard } from "./FolderCard";
import { ScriptLibraryTile } from "./ScriptLibraryTile";
import { FolderCardGrid } from "./FolderCardGrid";
import { ScriptLibraryTileGrid } from "./ScriptLibraryTileGrid";

interface ScriptsLibraryItemsProps {
	onNavigateFolder: (folderId: string) => void;
	hasMoreScripts: boolean;
	isLoadingMore: boolean;
	onLoadMore: () => void;
	allCurrentIds: string[];
}

export function ScriptsLibraryItems({
	onNavigateFolder,
	hasMoreScripts,
	isLoadingMore,
	onLoadMore,
	allCurrentIds,
}: ScriptsLibraryItemsProps) {
	const folders = useScriptsDataStore((s) => s.folders);
	const scripts = useScriptsDataStore((s) => s.scripts);
	const folderItemCounts = useScriptsDataStore((s) => s.folderChildItemCounts);
	
	const viewMode = useScriptsUiStore((s) => s.viewMode);
	const selectedScriptId = useScriptsUiStore((s) => s.selectedScript?.id ?? null);
	const selectedIds = useScriptsUiStore((s) => s.selectedIds);
	const selectScript = useScriptsUiStore((s) => s.selectScript);
	const toggleSelection = useScriptsUiStore((s) => s.toggleSelection);

	const setDeleteFolderTarget = useScriptsModalsStore((s) => s.setDeleteFolderTarget);
	const setDeleteScriptTarget = useScriptsModalsStore((s) => s.setDeleteScriptTarget);

	const [sortAscending, setSortAscending] = useState(true);

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
			toggleSelection(id, isMulti, isRange, allCurrentIds);
		} else {
			toggleSelection(id, false, false, allCurrentIds);
			onPrimaryAction();
		}
	};

	if (viewMode === "grid") {
		return (
			<Stack gap="xl">
				<Box px="md">
					<UnstyledButton
						onClick={() => setSortAscending(!sortAscending)}
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
									onDelete={() => setDeleteFolderTarget(folder)}
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
										handleItemClick(e, script.id, () => selectScript(script.id))
									}
									onDelete={() => setDeleteScriptTarget(script)}
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
					onClick={() => setSortAscending(!sortAscending)}
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
							onDelete={() => setDeleteFolderTarget(folder)}
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
								handleItemClick(e, script.id, () => selectScript(script.id))
							}
							onDelete={() => setDeleteScriptTarget(script)}
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
