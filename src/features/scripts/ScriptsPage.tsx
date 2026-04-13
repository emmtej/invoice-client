import { Box, Button, Center, Flex, Group, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FolderPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { DocxUploadButton } from "@/components/ui/button/DocxUploadButton";
import { SCRIPT_LIBRARY_LIST_MAX_WIDTH } from "@/components/ui/layout/layout-constants";
import type { Folder, ScriptSummary } from "@/features/storage/types";
import { BreadcrumbNav } from "./components/BreadcrumbNav";
import { MultiSelectToolbar } from "./components/MultiSelectToolbar";
import { PreviewPanel } from "./components/PreviewPanel";
import { ScriptsEmptyState } from "./components/ScriptsEmptyState";
import { ScriptsHeader } from "./components/ScriptsHeader";
import { ScriptsLibraryItems } from "./components/ScriptsLibraryItems";
import { ScriptsModals } from "./components/ScriptsModals";
import { useScriptsEvents } from "./hooks/useScriptsEvents";
import { useScriptsUpload } from "./hooks/useScriptsUpload";
import { useScriptsDataStore } from "./store/useScriptsDataStore";
import { useScriptsUiStore } from "./store/useScriptsUiStore";

export default function ScriptsPage() {
	const {
		folders,
		scripts,
		breadcrumb,
		folderChildItemCounts,
		isLoading,
		init,
		fetchFolderData,
		duplicateItems,
	} = useScriptsDataStore(
		useShallow((s) => ({
			folders: s.folders,
			scripts: s.scripts,
			breadcrumb: s.breadcrumb,
			folderChildItemCounts: s.folderChildItemCounts,
			isLoading: s.isLoading,
			init: s.init,
			fetchFolderData: s.fetchFolderData,
			duplicateItems: s.duplicateItems,
		})),
	);

	const {
		currentFolderId,
		selectedScript,
		selectedIds,
		isPreviewLoading,
		setCurrentFolder,
		selectScript,
		toggleSelection,
		clearSelection,
	} = useScriptsUiStore(
		useShallow((s) => ({
			currentFolderId: s.currentFolderId,
			selectedScript: s.selectedScript,
			selectedIds: s.selectedIds,
			isPreviewLoading: s.isPreviewLoading,
			setCurrentFolder: s.setCurrentFolder,
			selectScript: s.selectScript,
			toggleSelection: s.toggleSelection,
			clearSelection: s.clearSelection,
		})),
	);

	const { isUploading, uploadErrors, handleFileChange, resetUpload } =
		useScriptsUpload();

	const allCurrentIds = useMemo(
		() => [...folders.map((f) => f.id), ...scripts.map((s) => s.id)],
		[folders, scripts],
	);

	useScriptsEvents(allCurrentIds);

	const [
		createFolderOpened,
		{ open: openCreateFolder, close: closeCreateFolder },
	] = useDisclosure(false);
	const [moveModalOpened, { open: openMoveModal, close: closeMoveModal }] =
		useDisclosure(false);
	const [
		deleteItemsOpened,
		{ open: openDeleteItems, close: closeDeleteItems },
	] = useDisclosure(false);

	const [deleteFolderTarget, setDeleteFolderTarget] = useState<Folder | null>(
		null,
	);
	const [deleteScriptTarget, setDeleteScriptTarget] =
		useState<ScriptSummary | null>(null);
	const [sortAscending, setSortAscending] = useState(true);

	useEffect(() => {
		init();
	}, [init]);

	const handleNavigate = async (folderId: string | null) => {
		setCurrentFolder(folderId);
		await fetchFolderData(folderId);
	};

	const isRoot = currentFolderId === null;
	const isEmpty = folders.length === 0 && scripts.length === 0;
	const currentFolderName =
		breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1].name : undefined;

	const listColumnProps = {
		maw: SCRIPT_LIBRARY_LIST_MAX_WIDTH,
		mx: "auto" as const,
		w: "100%" as const,
	};

	return (
		<Flex direction="column" h="100%" rowGap="md">
			<ScriptsHeader uploadErrors={uploadErrors} onResetUpload={resetUpload} />

			{/* Folder breadcrumb navigation */}
			{breadcrumb.length > 0 && (
				<Box px="md" {...listColumnProps}>
					<BreadcrumbNav breadcrumb={breadcrumb} onNavigate={handleNavigate} />
				</Box>
			)}

			{/* Content area */}
			{isLoading ? (
				<Center flex={1}>
					<Loader color="wave" size="sm" />
				</Center>
			) : isEmpty ? (
				<Box flex={1} px="md" {...listColumnProps}>
					<ScriptsEmptyState
						isRoot={isRoot}
						onCreateFolder={openCreateFolder}
						onUpload={handleFileChange}
						isUploading={isUploading}
					/>
				</Box>
			) : (
				<Flex flex={1} mih={0}>
					<Box flex={1} p="md" miw={0} style={{ overflowY: "auto" }}>
						<Box {...listColumnProps}>
							<ScriptsLibraryItems
								folders={folders}
								scripts={scripts}
								folderItemCounts={folderChildItemCounts}
								sortAscending={sortAscending}
								onSortAscendingChange={setSortAscending}
								selectedScriptId={selectedScript?.id ?? null}
								selectedIds={selectedIds}
								onNavigateFolder={handleNavigate}
								onDeleteFolder={(folder) => setDeleteFolderTarget(folder)}
								onSelectScript={selectScript}
								onDeleteScript={(script) => setDeleteScriptTarget(script)}
								onToggleSelection={(id, isMulti, isRange) =>
									toggleSelection(id, isMulti, isRange, allCurrentIds)
								}
							/>
							<Group justify="center" gap="sm" wrap="wrap" pt="lg">
								<DocxUploadButton
									onChange={handleFileChange}
									multiple
									variant="light"
									color="wave"
									loading={isUploading}
								>
									Upload Scripts
								</DocxUploadButton>
								<Button
									color="wave"
									leftSection={<FolderPlus size={16} />}
									onClick={openCreateFolder}
								>
									New Folder
								</Button>
							</Group>
						</Box>
					</Box>

					{selectedScript && (
						<PreviewPanel
							script={selectedScript}
							isLoading={isPreviewLoading}
							onClose={clearSelection}
						/>
					)}

					<MultiSelectToolbar
						selectedCount={selectedIds.length}
						onClear={clearSelection}
						onDelete={openDeleteItems}
						onMove={openMoveModal}
						onCopy={async () => {
							const scriptIds = selectedIds.filter((id) =>
								scripts.some((s) => s.id === id),
							);
							await duplicateItems(scriptIds);
							clearSelection();
						}}
					/>
				</Flex>
			)}

			<ScriptsModals
				deleteFolderTarget={deleteFolderTarget}
				setDeleteFolderTarget={setDeleteFolderTarget}
				deleteScriptTarget={deleteScriptTarget}
				setDeleteScriptTarget={setDeleteScriptTarget}
				createFolderOpened={createFolderOpened}
				closeCreateFolder={closeCreateFolder}
				moveModalOpened={moveModalOpened}
				closeMoveModal={closeMoveModal}
				deleteItemsOpened={deleteItemsOpened}
				closeDeleteItems={closeDeleteItems}
				currentFolderName={currentFolderName}
			/>
		</Flex>
	);
}
