import { Button, Group, Stack, Text } from "@mantine/core";
import { AppModal } from "@/components/ui/modal/AppModal";
import type { Folder, ScriptSummary } from "@/features/storage/types";
import { useScriptsDataStore } from "../store/useScriptsDataStore";
import { useScriptsUiStore } from "../store/useScriptsUiStore";
import { CreateFolderModal } from "./CreateFolderModal";
import { DeleteFolderModal } from "./DeleteFolderModal";
import { DeleteScriptModal } from "./DeleteScriptModal";
import { MoveToFolderModal } from "./MoveToFolderModal";

interface ScriptsModalsProps {
	// Targets for deletion
	deleteFolderTarget: Folder | null;
	setDeleteFolderTarget: (folder: Folder | null) => void;
	deleteScriptTarget: ScriptSummary | null;
	setDeleteScriptTarget: (script: ScriptSummary | null) => void;

	// Disclosure states
	createFolderOpened: boolean;
	closeCreateFolder: () => void;
	moveModalOpened: boolean;
	closeMoveModal: () => void;
	deleteItemsOpened: boolean;
	closeDeleteItems: () => void;

	// Context
	currentFolderName?: string;
}

export function ScriptsModals({
	deleteFolderTarget,
	setDeleteFolderTarget,
	deleteScriptTarget,
	setDeleteScriptTarget,
	createFolderOpened,
	closeCreateFolder,
	moveModalOpened,
	closeMoveModal,
	deleteItemsOpened,
	closeDeleteItems,
	currentFolderName,
}: ScriptsModalsProps) {
	const { currentFolderId, selectedIds, clearSelection } = useScriptsUiStore();
	const {
		createFolder,
		deleteFolder,
		deleteScript,
		refresh,
		folders,
		scripts,
	} = useScriptsDataStore();

	const onConfirmDeleteSelected = async () => {
		// Identify folders vs scripts in selection
		const folderIds = selectedIds.filter((id) =>
			folders.some((f) => f.id === id),
		);
		const scriptIds = selectedIds.filter((id) =>
			scripts.some((s) => s.id === id),
		);

		for (const id of folderIds) await deleteFolder(id);
		for (const id of scriptIds) await deleteScript(id);

		await refresh(currentFolderId);
		clearSelection();
		closeDeleteItems();
	};

	const onConfirmMoveSelected = async (targetFolderId: string | null) => {
		const folderIds = selectedIds.filter((id) =>
			folders.some((f) => f.id === id),
		);
		const scriptIds = selectedIds.filter((id) =>
			scripts.some((s) => s.id === id),
		);

		// Implementation of move logic (as noted in DataStore)
		// We'll need to ensure the DataStore or a utility can handle the move
		// For now, let's use the folderQueries/scriptsQueries directly if store is incomplete
		const { folderQueries } = await import("@/features/storage/folderQueries");
		const { scriptsQueries } = await import("../store/scriptsQueries");

		if (folderIds.length > 0) {
			await folderQueries.moveFolders(folderIds, targetFolderId);
		}
		if (scriptIds.length > 0) {
			await scriptsQueries.moveScripts(scriptIds, targetFolderId);
		}

		await refresh(currentFolderId);
		clearSelection();
		closeMoveModal();
	};

	return (
		<>
			<AppModal
				opened={deleteItemsOpened}
				onClose={closeDeleteItems}
				title="Delete items"
				centered
				size="sm"
			>
				<Stack gap="md">
					<Text size="sm">
						Are you sure you want to delete {selectedIds.length} selected{" "}
						{selectedIds.length === 1 ? "item" : "items"}? This action cannot be
						undone.
					</Text>
					<Group justify="flex-end">
						<Button variant="subtle" color="gray" onClick={closeDeleteItems}>
							Cancel
						</Button>
						<Button color="red" onClick={onConfirmDeleteSelected}>
							Delete
						</Button>
					</Group>
				</Stack>
			</AppModal>

			<CreateFolderModal
				opened={createFolderOpened}
				onClose={closeCreateFolder}
				onConfirm={async (name) => {
					await createFolder(name, currentFolderId);
					closeCreateFolder();
				}}
				parentFolderName={currentFolderName}
			/>

			<MoveToFolderModal
				opened={moveModalOpened}
				onClose={closeMoveModal}
				onConfirm={onConfirmMoveSelected}
				itemCount={selectedIds.length}
				currentFolderId={currentFolderId}
			/>

			<DeleteFolderModal
				opened={deleteFolderTarget !== null}
				onClose={() => setDeleteFolderTarget(null)}
				onConfirm={async () => {
					if (deleteFolderTarget) {
						await deleteFolder(deleteFolderTarget.id);
						await refresh(currentFolderId);
						setDeleteFolderTarget(null);
					}
				}}
				folderName={deleteFolderTarget?.name ?? ""}
			/>

			<DeleteScriptModal
				opened={deleteScriptTarget !== null}
				onClose={() => setDeleteScriptTarget(null)}
				onConfirm={async () => {
					if (deleteScriptTarget) {
						await deleteScript(deleteScriptTarget.id);
						await refresh(currentFolderId);
						setDeleteScriptTarget(null);
					}
				}}
				scriptName={deleteScriptTarget?.name ?? ""}
			/>
		</>
	);
}
