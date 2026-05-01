import { Button, Group, Stack, Text } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { AppModal } from "@/components/ui/modal/AppModal";
import type { Folder, ScriptSummary } from "@/features/storage/types";
import { scriptKeys } from "../hooks/useScriptsQuery";
import { useScriptsDataStore } from "../store/useScriptsDataStore";
import { useScriptsUiStore } from "../store/useScriptsUiStore";
import { CreateFolderModal } from "./CreateFolderModal";
import { DeleteFolderModal } from "./DeleteFolderModal";
import { DeleteScriptModal } from "./DeleteScriptModal";
import { MoveToFolderModal } from "./MoveToFolderModal";

interface ModalsState {
	deleteFolderTarget: Folder | null;
	deleteScriptTarget: ScriptSummary | null;
	createFolderOpened: boolean;
	moveModalOpened: boolean;
	deleteItemsOpened: boolean;
	setDeleteFolderTarget: (target: Folder | null) => void;
	setDeleteScriptTarget: (target: ScriptSummary | null) => void;
	setCreateFolderOpened: (opened: boolean) => void;
	setMoveModalOpened: (opened: boolean) => void;
	setDeleteItemsOpened: (opened: boolean) => void;
}

export const useScriptsModalsStore = create<ModalsState>((set) => ({
	deleteFolderTarget: null,
	deleteScriptTarget: null,
	createFolderOpened: false,
	moveModalOpened: false,
	deleteItemsOpened: false,
	setDeleteFolderTarget: (target) => set({ deleteFolderTarget: target }),
	setDeleteScriptTarget: (target) => set({ deleteScriptTarget: target }),
	setCreateFolderOpened: (opened) => set({ createFolderOpened: opened }),
	setMoveModalOpened: (opened) => set({ moveModalOpened: opened }),
	setDeleteItemsOpened: (opened) => set({ deleteItemsOpened: opened }),
}));

interface ScriptsModalsProps {
	currentFolderName?: string;
	folders: Folder[];
	scripts: ScriptSummary[];
}

export function ScriptsModals({
	currentFolderName,
	folders,
	scripts,
}: ScriptsModalsProps) {
	const queryClient = useQueryClient();
	const { currentFolderId, selectedIds, clearSelection } = useScriptsUiStore();
	const { createFolder, deleteFolder, deleteScript, moveItems } =
		useScriptsDataStore();

	const {
		deleteFolderTarget,
		deleteScriptTarget,
		createFolderOpened,
		moveModalOpened,
		deleteItemsOpened,
		setDeleteFolderTarget,
		setDeleteScriptTarget,
		setCreateFolderOpened,
		setMoveModalOpened,
		setDeleteItemsOpened,
	} = useScriptsModalsStore();

	const invalidateScripts = () =>
		queryClient.invalidateQueries({ queryKey: scriptKeys.all });

	const onConfirmDeleteSelected = async () => {
		const folderIds = selectedIds.filter((id) =>
			folders.some((f) => f.id === id),
		);
		const scriptIds = selectedIds.filter((id) =>
			scripts.some((s) => s.id === id),
		);

		for (const id of folderIds) await deleteFolder(id);
		for (const id of scriptIds) await deleteScript(id);

		await invalidateScripts();
		clearSelection();
		setDeleteItemsOpened(false);
	};

	const onConfirmMoveSelected = async (targetFolderId: string | null) => {
		await moveItems(selectedIds, targetFolderId);
		await invalidateScripts();
		clearSelection();
		setMoveModalOpened(false);
	};

	return (
		<>
			<AppModal
				opened={deleteItemsOpened}
				onClose={() => setDeleteItemsOpened(false)}
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
						<Button
							variant="subtle"
							color="gray"
							onClick={() => setDeleteItemsOpened(false)}
						>
							Cancel
						</Button>
						<Button color="on-air-red" onClick={onConfirmDeleteSelected}>
							Delete
						</Button>
					</Group>
				</Stack>
			</AppModal>

			<CreateFolderModal
				opened={createFolderOpened}
				onClose={() => setCreateFolderOpened(false)}
				onConfirm={async (name) => {
					await createFolder(name, currentFolderId);
					await invalidateScripts();
					setCreateFolderOpened(false);
				}}
				parentFolderName={currentFolderName}
			/>

			<MoveToFolderModal
				opened={moveModalOpened}
				onClose={() => setMoveModalOpened(false)}
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
						await invalidateScripts();
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
						await invalidateScripts();
						setDeleteScriptTarget(null);
					}
				}}
				scriptName={deleteScriptTarget?.name ?? ""}
			/>
		</>
	);
}
