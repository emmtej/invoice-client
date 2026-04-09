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
	clearSelection: () => void;
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
		isLoading: false,
		isPreviewLoading: false,

		init: async () => {
			set({ isLoading: true });
			try {
				await folderQueries.initSchema();
				const folders = await folderQueries.getFoldersAtLevel(null);
				const scripts = await scriptsQueries.getScriptsInFolder(null);
				const folderChildItemCounts =
					await loadFolderChildItemCounts(folders);
				set({ folders, scripts, folderChildItemCounts, isLoading: false });
			} catch (error) {
				console.error("Failed to initialize scripts library:", error);
				set({ isLoading: false });
			}
		},

		navigateToFolder: async (folderId) => {
			set({ isLoading: true, selectedScript: null });
			try {
				const folders = await folderQueries.getFoldersAtLevel(folderId);
				const scripts = await scriptsQueries.getScriptsInFolder(folderId);
				const breadcrumb = folderId
					? await folderQueries.getFolderBreadcrumb(folderId)
					: [];
				const folderChildItemCounts =
					await loadFolderChildItemCounts(folders);
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
				selectedScript:
					get().selectedScript?.id === scriptId
						? null
						: get().selectedScript,
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

		clearSelection: () => set({ selectedScript: null }),

		refresh: async () => {
			const { currentFolderId } = get();
			const folders = await folderQueries.getFoldersAtLevel(currentFolderId);
			const scripts = await scriptsQueries.getScriptsInFolder(currentFolderId);
			const folderChildItemCounts =
				await loadFolderChildItemCounts(folders);
			set({ folders, scripts, folderChildItemCounts });
		},
	}),
);
