import { Box, Button, Center, Flex, Group, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FolderPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { DocxUploadButton } from "@/components/ui/button/DocxUploadButton";
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
		hasMoreScripts,
		init,
		fetchFolderData,
		loadMoreScripts,
		duplicateItems,
	} = useScriptsDataStore(
		useShallow((s) => ({
			folders: s.folders,
			scripts: s.scripts,
			breadcrumb: s.breadcrumb,
			folderChildItemCounts: s.folderChildItemCounts,
			isLoading: s.isLoading,
			hasMoreScripts: s.hasMoreScripts,
			init: s.init,
			fetchFolderData: s.fetchFolderData,
			loadMoreScripts: s.loadMoreScripts,
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

	const [isLoadingMore, setIsLoadingMore] = useState(false);

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

	const handleLoadMore = async () => {
		setIsLoadingMore(true);
		try {
			await loadMoreScripts(currentFolderId);
		} finally {
			setIsLoadingMore(false);
		}
	};

	const isRoot = currentFolderId === null;
	const isEmpty = folders.length === 0 && scripts.length === 0;
	const currentFolderName =
		breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1].name : undefined;

	return (
		<Flex direction="column" h="100%" rowGap="md">
			<ScriptsHeader uploadErrors={uploadErrors} onResetUpload={resetUpload} />

			{breadcrumb.length > 0 && (
				<Box px="md">
					<BreadcrumbNav breadcrumb={breadcrumb} onNavigate={handleNavigate} />
				</Box>
			)}

			{isLoading ? (
				<Center flex={1}>
					<Loader color="wave" size="sm" />
				</Center>
			) : isEmpty ? (
				<Box flex={1} px="md">
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
							hasMoreScripts={hasMoreScripts}
							isLoadingMore={isLoadingMore}
							onLoadMore={handleLoadMore}
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
