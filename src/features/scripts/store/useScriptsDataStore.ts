import { create } from "zustand";
import { folderQueries } from "@/features/storage/folderQueries";
import { initDb } from "@/features/storage/pgliteClient";
import type { Folder, ScriptSummary } from "@/features/storage/types";
import { generateId } from "@/utils/id";
import { scriptsQueries } from "./scriptsQueries";

const INITIAL_SCRIPT_LIMIT = 5;
const INITIAL_FOLDER_LIMIT = 1;
const LOAD_MORE_BATCH = 10;

interface ScriptsDataState {
	folders: Folder[];
	scripts: ScriptSummary[];
	breadcrumb: { id: string; name: string }[];
	folderChildItemCounts: Record<string, number>;
	isLoading: boolean;
	scriptsTotalCount: number;
	scriptsOffset: number;
	hasMoreScripts: boolean;
}

interface ScriptsDataActions {
	init: () => Promise<void>;
	fetchFolderData: (folderId: string | null) => Promise<{
		folders: Folder[];
		scripts: ScriptSummary[];
		breadcrumb: { id: string; name: string }[];
	}>;
	loadMoreScripts: (folderId: string | null) => Promise<void>;
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
	scriptsTotalCount: 0,
	scriptsOffset: 0,
	hasMoreScripts: false,

	init: async () => {
		set({ isLoading: true });
		try {
			await initDb();
			const [folders, scripts, scriptsTotalCount] = await Promise.all([
				folderQueries.getRecentFolders(null, INITIAL_FOLDER_LIMIT),
				scriptsQueries.getScriptsInFolderPaginated(
					null,
					INITIAL_SCRIPT_LIMIT,
					0,
				),
				scriptsQueries.countScriptsInFolder(null),
			]);
			const folderChildItemCounts = await loadFolderChildItemCounts(folders);
			set({
				folders,
				scripts,
				breadcrumb: [],
				folderChildItemCounts,
				isLoading: false,
				scriptsTotalCount,
				scriptsOffset: INITIAL_SCRIPT_LIMIT,
				hasMoreScripts: scriptsTotalCount > INITIAL_SCRIPT_LIMIT,
			});
		} catch (error) {
			console.error("Failed to initialize scripts data:", error);
			set({ isLoading: false });
		}
	},

	fetchFolderData: async (folderId) => {
		set({ isLoading: true });
		try {
			const [folders, scripts, breadcrumb, scriptsTotalCount] =
				await Promise.all([
					folderQueries.getRecentFolders(folderId, INITIAL_FOLDER_LIMIT),
					scriptsQueries.getScriptsInFolderPaginated(
						folderId,
						INITIAL_SCRIPT_LIMIT,
						0,
					),
					folderId
						? folderQueries.getFolderBreadcrumb(folderId)
						: Promise.resolve([]),
					scriptsQueries.countScriptsInFolder(folderId),
				]);
			const folderChildItemCounts = await loadFolderChildItemCounts(folders);
			set({
				folders,
				scripts,
				breadcrumb,
				folderChildItemCounts,
				isLoading: false,
				scriptsTotalCount,
				scriptsOffset: INITIAL_SCRIPT_LIMIT,
				hasMoreScripts: scriptsTotalCount > INITIAL_SCRIPT_LIMIT,
			});
			return { folders, scripts, breadcrumb };
		} catch (error) {
			console.error("Failed to fetch folder data:", error);
			set({ isLoading: false });
			throw error;
		}
	},

	loadMoreScripts: async (folderId) => {
		const {
			scriptsOffset,
			scripts: currentScripts,
			folders: currentFolders,
		} = get();
		const isFirstLoadMore = scriptsOffset <= INITIAL_SCRIPT_LIMIT;

		const [newScripts, allFolders] = await Promise.all([
			scriptsQueries.getScriptsInFolderPaginated(
				folderId,
				LOAD_MORE_BATCH,
				scriptsOffset,
			),
			isFirstLoadMore
				? folderQueries.getFoldersAtLevel(folderId)
				: Promise.resolve(currentFolders),
		]);

		const newOffset = scriptsOffset + newScripts.length;
		const { scriptsTotalCount } = get();
		const folderChildItemCounts = isFirstLoadMore
			? await loadFolderChildItemCounts(allFolders)
			: get().folderChildItemCounts;

		set({
			scripts: [...currentScripts, ...newScripts],
			folders: allFolders,
			folderChildItemCounts,
			scriptsOffset: newOffset,
			hasMoreScripts: newOffset < scriptsTotalCount,
		});
	},

	createFolder: async (name, parentId) => {
		const id = generateId();
		await folderQueries.createFolder(id, name, parentId);
		await get().refresh(parentId);
	},

	deleteFolder: async (folderId) => {
		await folderQueries.deleteFolder(folderId);
	},

	deleteScript: async (scriptId) => {
		await scriptsQueries.deleteScript(scriptId);
	},

	moveItems: async (ids, targetFolderId) => {
		try {
			await folderQueries.moveFolders(ids, targetFolderId);
			await scriptsQueries.moveScripts(ids, targetFolderId);
			await get().refresh(targetFolderId);
		} catch (error) {
			console.error("Failed to move items:", error);
			throw error;
		}
	},

	duplicateItems: async (ids) => {
		for (const id of ids) {
			await scriptsQueries.duplicateScript(id, generateId());
		}
	},

	refresh: async (currentFolderId) => {
		const { scriptsOffset } = get();
		const loadCount = Math.max(scriptsOffset, INITIAL_SCRIPT_LIMIT);

		const [folders, scripts, scriptsTotalCount] = await Promise.all([
			folderQueries.getFoldersAtLevel(currentFolderId),
			scriptsQueries.getScriptsInFolderPaginated(currentFolderId, loadCount, 0),
			scriptsQueries.countScriptsInFolder(currentFolderId),
		]);
		const folderChildItemCounts = await loadFolderChildItemCounts(folders);

		set({
			folders,
			scripts,
			folderChildItemCounts,
			scriptsTotalCount,
			scriptsOffset: loadCount,
			hasMoreScripts: loadCount < scriptsTotalCount,
		});
	},
}));
