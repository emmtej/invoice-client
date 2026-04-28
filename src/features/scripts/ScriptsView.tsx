import { Box, Center, Flex, Loader } from "@mantine/core";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { BreadcrumbNav } from "./components/BreadcrumbNav";
import { MultiSelectToolbar } from "./components/MultiSelectToolbar";
import { PreviewPanel } from "./components/PreviewPanel";
import { ScriptsEmptyState } from "./components/ScriptsEmptyState";
import { ScriptsHeader } from "./components/ScriptsHeader";
import { ScriptsLibraryItems } from "./components/ScriptsLibraryItems";
import {
	ScriptsModals,
	useScriptsModalsStore,
} from "./components/ScriptsModals";
import { useScriptsEvents } from "./hooks/useScriptsEvents";
import { useScriptsPageController } from "./hooks/useScriptsPageController";
import { useScriptsUpload } from "./hooks/useScriptsUpload";
import { useScriptsDataStore } from "./store/useScriptsDataStore";
import { useScriptsUiStore } from "./store/useScriptsUiStore";

export default function ScriptsView() {
	const init = useScriptsDataStore((s) => s.init);
	const isLoading = useScriptsDataStore((s) => s.isLoading);
	const breadcrumb = useScriptsDataStore((s) => s.breadcrumb);
	const hasMoreScripts = useScriptsDataStore((s) => s.hasMoreScripts);
	const duplicateItems = useScriptsDataStore((s) => s.duplicateItems);
	const scripts = useScriptsDataStore((s) => s.scripts);

	const {
		selectedScript,
		selectedIds,
		viewMode,
		isPreviewLoading,
		clearSelection,
		setViewMode,
	} = useScriptsUiStore(
		useShallow((s) => ({
			selectedScript: s.selectedScript,
			selectedIds: s.selectedIds,
			viewMode: s.viewMode,
			isPreviewLoading: s.isPreviewLoading,
			clearSelection: s.clearSelection,
			setViewMode: s.setViewMode,
		})),
	);

	const setCreateFolderOpened = useScriptsModalsStore(
		(s) => s.setCreateFolderOpened,
	);
	const setMoveModalOpened = useScriptsModalsStore((s) => s.setMoveModalOpened);
	const setDeleteItemsOpened = useScriptsModalsStore(
		(s) => s.setDeleteItemsOpened,
	);

	const { isUploading, uploadErrors, handleFileChange, resetUpload } =
		useScriptsUpload();

	const {
		allCurrentIds,
		isLoadingMore,
		isRoot,
		isEmpty,
		currentFolderName,
		handleNavigate,
		handleLoadMore,
	} = useScriptsPageController();

	useScriptsEvents(allCurrentIds);

	useEffect(() => {
		init();
	}, [init]);

	return (
		<Flex direction="column" h="100%" rowGap="md">
			<ScriptsHeader
				uploadErrors={uploadErrors}
				onResetUpload={resetUpload}
				viewMode={viewMode}
				onViewModeChange={setViewMode}
				onCreateFolder={() => setCreateFolderOpened(true)}
				onUpload={handleFileChange}
				isUploading={isUploading}
			/>

			{breadcrumb.length > 0 && (
				<Box px="md">
					<BreadcrumbNav breadcrumb={breadcrumb} onNavigate={handleNavigate} />
				</Box>
			)}

			{isLoading ? (
				<Center flex={1}>
					<Loader color="studio-blue" size="sm" />
				</Center>
			) : isEmpty ? (
				<Box flex={1} px="md">
					<ScriptsEmptyState
						isRoot={isRoot}
						onCreateFolder={() => setCreateFolderOpened(true)}
						onUpload={handleFileChange}
						isUploading={isUploading}
					/>
				</Box>
			) : (
				<Flex flex={1} mih={0}>
					<Box flex={1} p="md" miw={0} style={{ overflowY: "auto" }}>
						<ScriptsLibraryItems
							onNavigateFolder={handleNavigate}
							hasMoreScripts={hasMoreScripts}
							isLoadingMore={isLoadingMore}
							onLoadMore={handleLoadMore}
							allCurrentIds={allCurrentIds}
						/>
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
						onDelete={() => setDeleteItemsOpened(true)}
						onMove={() => setMoveModalOpened(true)}
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

			<ScriptsModals currentFolderName={currentFolderName} />
		</Flex>
	);
}
