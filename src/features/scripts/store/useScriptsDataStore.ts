import { create } from "zustand";
import { folderQueries } from "@/features/storage/folderQueries";
import type { Folder, ScriptSummary } from "@/features/storage/types";
import { generateId } from "@/utils/id";
import { scriptsQueries } from "./scriptsQueries";

interface ScriptsDataState {
	folders: Folder[];
	scripts: ScriptSummary[];
	breadcrumb: { id: string; name: string }[];
	/** Direct child count per folder id (subfolders + scripts in that folder). */
	folderChildItemCounts: Record<string, number>;
	isLoading: boolean;
}

interface ScriptsDataActions {
	init: () => Promise<void>;
	fetchFolderData: (folderId: string | null) => Promise<{
		folders: Folder[];
		scripts: ScriptSummary[];
		breadcrumb: { id: string; name: string }[];
	}>;
	createFolder: (name: string, parentId: string | null) => Promise<void>;
	deleteFolder: (folderId: string) => Promise<void>;
	deleteScript: (scriptId: string) => Promise<void>;
	moveItems: (ids: string[], targetFolderId: string | null) => Promise<void>;
	duplicateItems: (ids: string[]) => Promise<void>;
	refresh: (currentFolderId: string | null) => Promise<void>;
}

export type ScriptsDataStore = ScriptsDataState & ScriptsDataActions;

async function loadFolderChildItemCounts(
	folders: Folder[],
): Promise<Record<string, number>> {
	const ids = folders.map((f) => f.id);
	if (ids.length === 0) return {};
	return folderQueries.getChildItemCountsForFolders(ids);
}

export const useScriptsDataStore = create<ScriptsDataStore>()((set, get) => ({
	folders: [],
	scripts: [],
	breadcrumb: [],
	folderChildItemCounts: {},
	isLoading: false,

	init: async () => {
		set({ isLoading: true });
		try {
			await folderQueries.initSchema();
			const folders = await folderQueries.getFoldersAtLevel(null);
			const scripts = await scriptsQueries.getScriptsInFolder(null);
			const folderChildItemCounts = await loadFolderChildItemCounts(folders);
			set({
				folders,
				scripts,
				breadcrumb: [],
				folderChildItemCounts,
				isLoading: false,
			});
		} catch (error) {
			console.error("Failed to initialize scripts data:", error);
			set({ isLoading: false });
		}
	},

	fetchFolderData: async (folderId) => {
		set({ isLoading: true });
		try {
			const folders = await folderQueries.getFoldersAtLevel(folderId);
			const scripts = await scriptsQueries.getScriptsInFolder(folderId);
			const breadcrumb = folderId
				? await folderQueries.getFolderBreadcrumb(folderId)
				: [];
			const folderChildItemCounts = await loadFolderChildItemCounts(folders);
			set({
				folders,
				scripts,
				breadcrumb,
				folderChildItemCounts,
				isLoading: false,
			});
			return { folders, scripts, breadcrumb };
		} catch (error) {
			console.error("Failed to fetch folder data:", error);
			set({ isLoading: false });
			throw error;
		}
	},

	createFolder: async (name, parentId) => {
		const id = generateId();
		await folderQueries.createFolder(id, name, parentId);
		await get().refresh(parentId);
	},

	deleteFolder: async (folderId) => {
		await folderQueries.deleteFolder(folderId);
		// Note: caller is responsible for currentFolderId refresh if needed,
		// or we can refresh the current view if we know it.
	},

	deleteScript: async (scriptId) => {
		await scriptsQueries.deleteScript(scriptId);
	},

	moveItems: async (_ids, _targetFolderId) => {
		// In a real app, we'd need to know which are folders and which are scripts.
		// For now, we'll follow the pattern from the old store.
		// This action is better orchestrated by a hook or component that knows the types.
	},

	duplicateItems: async (ids) => {
		for (const id of ids) {
			await scriptsQueries.duplicateScript(id, generateId());
		}
	},

	refresh: async (currentFolderId) => {
		const folders = await folderQueries.getFoldersAtLevel(currentFolderId);
		const scripts = await scriptsQueries.getScriptsInFolder(currentFolderId);
		const folderChildItemCounts = await loadFolderChildItemCounts(folders);
		set({ folders, scripts, folderChildItemCounts });
	},
}));
