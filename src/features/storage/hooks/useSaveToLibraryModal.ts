import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
	scriptKeys,
	useAllFolders,
	useFolderChildItemCounts,
} from "@/features/scripts/hooks/useScriptsQuery";
import { folderRepository } from "@/features/storage/repository/folderRepository";
import type { ScriptMetadata } from "@/types/Script";
import { generateId } from "@/utils/id";
import { notify } from "@/utils/notifications";
import { buildFolderRows, type FolderListRow } from "../utils/buildFolderRows";

interface UseSaveToLibraryModalProps {
	opened: boolean;
	onClose: () => void;
	scripts: ScriptMetadata[];
	onConfirm: (selectedIds: string[], folderId: string | null) => Promise<void>;
}

export function useSaveToLibraryModal({
	opened,
	onClose,
	scripts,
	onConfirm,
}: UseSaveToLibraryModalProps) {
	const queryClient = useQueryClient();
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

	const { data: folders = [], isLoading: foldersLoading } = useAllFolders();
	const { data: counts = {} } = useFolderChildItemCounts(folders);

	// Root count is tricky without a separate query, but we can assume 0 or fetch it.
	const rootCount = 0;

	const [createFormOpen, setCreateFormOpen] = useState(false);
	const [newFolderName, setNewFolderName] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [isCreatingFolder, setIsCreatingFolder] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (opened) {
			setSelectedIds(new Set(scripts.map((s) => s.id)));
			setSelectedFolderId(null);
			setCreateFormOpen(false);
			setNewFolderName("");
			setSearchQuery("");
		}
	}, [opened, scripts]);

	const folderRows = useMemo(
		() => buildFolderRows(folders, searchQuery),
		[folders, searchQuery],
	);

	const toggleScript = (id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	const handleCreateFolder = async () => {
		const name = newFolderName.trim();
		if (!name) return;

		setIsCreatingFolder(true);
		try {
			const parentId = selectedFolderId;
			const id = generateId();
			await folderRepository.createFolder(id, name, parentId);

			await queryClient.invalidateQueries({ queryKey: scriptKeys.folders.all });

			setSelectedFolderId(id);
			setNewFolderName("");
			setCreateFormOpen(false);
		} finally {
			setIsCreatingFolder(false);
		}
	};

	const handleSave = async () => {
		setIsSubmitting(true);
		try {
			await onConfirm(Array.from(selectedIds), selectedFolderId);
			notify.success({
				message: `Successfully saved ${selectedIds.size} ${
					selectedIds.size === 1 ? "item" : "items"
				} to library`,
			});
			onClose();
		} catch (error) {
			notify.error({
				message: "Failed to save items to library",
				error,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const isRowSelected = (row: FolderListRow) => {
		if (row.isRoot) return selectedFolderId === null;
		return selectedFolderId === row.id;
	};

	return {
		selectedIds,
		selectedFolderId,
		setSelectedFolderId,
		foldersLoading,
		counts,
		rootCount,
		createFormOpen,
		setCreateFormOpen,
		newFolderName,
		setNewFolderName,
		searchQuery,
		setSearchQuery,
		isCreatingFolder,
		isSubmitting,
		folderRows,
		toggleScript,
		handleCreateFolder,
		handleSave,
		isRowSelected,
	};
}
