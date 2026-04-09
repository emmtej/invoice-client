import { create } from "zustand";
import type { Script } from "@/types/Script";
import type { Folder, ScriptSummary } from "@/features/storage/types";
import { folderQueries } from "@/features/storage/folderQueries";
import { generateId } from "@/utils/id";
import { scriptsQueries } from "./scriptsQueries";

interface ScriptsLibraryState {
	currentFolderId: string | null;
	breadcrumb: { id: string; name: string }[];
	folders: Folder[];
	scripts: ScriptSummary[];
	/** Direct child count per folder id (subfolders + scripts in that folder). */
	folderChildItemCounts: Record<string, number>;
	selectedScript: Script | null;
	selectedIds: string[];
	lastSelectedId: string | null;
	isLoading: boolean;
	isPreviewLoading: boolean;
}

interface ScriptsLibraryActions {
	init: () => Promise<void>;
	navigateToFolder: (folderId: string | null) => Promise<void>;
	createFolder: (name: string, parentId: string | null) => Promise<void>;
	deleteFolder: (folderId: string) => Promise<void>;
	deleteScript: (scriptId: string) => Promise<void>;
	selectScript: (scriptId: string) => Promise<void>;
	toggleSelection: (id: string, isMulti: boolean, isRange: boolean) => void;
	selectAll: () => void;
	clearSelection: () => void;
	deleteSelected: () => Promise<void>;
	moveSelected: (targetFolderId: string | null) => Promise<void>;
	duplicateSelected: () => Promise<void>;
	refresh: () => Promise<void>;
}

type ScriptsLibraryStore = ScriptsLibraryState & ScriptsLibraryActions;

async function loadFolderChildItemCounts(
	folders: Folder[],
): Promise<Record<string, number>> {
	const ids = folders.map((f) => f.id);
	if (ids.length === 0) return {};
	return folderQueries.getChildItemCountsForFolders(ids);
}

export const useScriptsLibraryStore = create<ScriptsLibraryStore>()(
	(set, get) => ({
		currentFolderId: null,
		breadcrumb: [],
		folders: [],
		scripts: [],
		folderChildItemCounts: {},
		selectedScript: null,
		selectedIds: [],
		lastSelectedId: null,
		isLoading: false,
		isPreviewLoading: false,

		init: async () => {
			set({ isLoading: true });
			try {
				await folderQueries.initSchema();
				const folders = await folderQueries.getFoldersAtLevel(null);
				const scripts = await scriptsQueries.getScriptsInFolder(null);
				const folderChildItemCounts = await loadFolderChildItemCounts(folders);
				set({ folders, scripts, folderChildItemCounts, isLoading: false });
			} catch (error) {
				console.error("Failed to initialize scripts library:", error);
				set({ isLoading: false });
			}
		},

		navigateToFolder: async (folderId) => {
			set({ isLoading: true, selectedScript: null, selectedIds: [] });
			try {
				const folders = await folderQueries.getFoldersAtLevel(folderId);
				const scripts = await scriptsQueries.getScriptsInFolder(folderId);
				const breadcrumb = folderId
					? await folderQueries.getFolderBreadcrumb(folderId)
					: [];
				const folderChildItemCounts = await loadFolderChildItemCounts(folders);
				set({
					currentFolderId: folderId,
					folders,
					scripts,
					breadcrumb,
					folderChildItemCounts,
					isLoading: false,
				});
			} catch (error) {
				console.error("Failed to navigate to folder:", error);
				set({ isLoading: false });
			}
		},

		createFolder: async (name, parentId) => {
			const id = generateId();
			await folderQueries.createFolder(id, name, parentId);
			await get().refresh();
		},

		deleteFolder: async (folderId) => {
			set({
				folders: get().folders.filter((f) => f.id !== folderId),
				selectedIds: get().selectedIds.filter((id) => id !== folderId),
				selectedScript:
					get().selectedScript?.folderId === folderId
						? null
						: get().selectedScript,
			});
			await folderQueries.deleteFolder(folderId);
			await get().refresh();
		},

		deleteScript: async (scriptId) => {
			set({
				scripts: get().scripts.filter((s) => s.id !== scriptId),
				selectedIds: get().selectedIds.filter((id) => id !== scriptId),
				selectedScript:
					get().selectedScript?.id === scriptId ? null : get().selectedScript,
			});
			await scriptsQueries.deleteScript(scriptId);
			await get().refresh();
		},

		selectScript: async (scriptId) => {
			set({ isPreviewLoading: true });
			try {
				const script = await scriptsQueries.getScriptById(scriptId);
				set({ selectedScript: script, isPreviewLoading: false });
			} catch (error) {
				console.error("Failed to load script preview:", error);
				set({ isPreviewLoading: false });
			}
		},

		toggleSelection: (id, isMulti, isRange) => {
			const { selectedIds, lastSelectedId, folders, scripts } = get();
			const allIds = [...folders.map((f) => f.id), ...scripts.map((s) => s.id)];

			if (isRange && lastSelectedId) {
				const lastIndex = allIds.indexOf(lastSelectedId);
				const currentIndex = allIds.indexOf(id);
				if (lastIndex !== -1 && currentIndex !== -1) {
					const start = Math.min(lastIndex, currentIndex);
					const end = Math.max(lastIndex, currentIndex);
					const rangeIds = allIds.slice(start, end + 1);
					const newSelected = new Set(isMulti ? selectedIds : []);
					for (const rid of rangeIds) newSelected.add(rid);
					set({ selectedIds: Array.from(newSelected), lastSelectedId: id });
					return;
				}
			}

			if (isMulti) {
				const newSelected = new Set(selectedIds);
				if (newSelected.has(id)) {
					newSelected.delete(id);
				} else {
					newSelected.add(id);
				}
				set({ selectedIds: Array.from(newSelected), lastSelectedId: id });
			} else {
				set({ selectedIds: [id], lastSelectedId: id });
			}
		},

		selectAll: () => {
			const { folders, scripts } = get();
			set({
				selectedIds: [...folders.map((f) => f.id), ...scripts.map((s) => s.id)],
			});
		},

		clearSelection: () =>
			set({ selectedScript: null, selectedIds: [], lastSelectedId: null }),

		deleteSelected: async () => {
			const { selectedIds, folders, scripts } = get();
			const folderIds = selectedIds.filter((id) =>
				folders.some((f) => f.id === id),
			);
			const scriptIds = selectedIds.filter((id) =>
				scripts.some((s) => s.id === id),
			);

			for (const id of folderIds) await folderQueries.deleteFolder(id);
			for (const id of scriptIds) await scriptsQueries.deleteScript(id);

			set({ selectedIds: [], lastSelectedId: null });
			await get().refresh();
		},

		moveSelected: async (targetFolderId) => {
			const { selectedIds, folders, scripts } = get();
			const folderIds = selectedIds.filter((id) =>
				folders.some((f) => f.id === id),
			);
			const scriptIds = selectedIds.filter((id) =>
				scripts.some((s) => s.id === id),
			);

			if (folderIds.length > 0) {
				await folderQueries.moveFolders(folderIds, targetFolderId);
			}
			if (scriptIds.length > 0) {
				await scriptsQueries.moveScripts(scriptIds, targetFolderId);
			}

			set({ selectedIds: [], lastSelectedId: null });
			await get().refresh();
		},

		duplicateSelected: async () => {
			const { selectedIds, scripts } = get();
			const scriptIds = selectedIds.filter((id) =>
				scripts.some((s) => s.id === id),
			);

			for (const id of scriptIds) {
				await scriptsQueries.duplicateScript(id, generateId());
			}

			set({ selectedIds: [], lastSelectedId: null });
			await get().refresh();
		},

		refresh: async () => {
			const { currentFolderId } = get();
			const folders = await folderQueries.getFoldersAtLevel(currentFolderId);
			const scripts = await scriptsQueries.getScriptsInFolder(currentFolderId);
			const folderChildItemCounts = await loadFolderChildItemCounts(folders);
			set({ folders, scripts, folderChildItemCounts });
		},
	}),
);
