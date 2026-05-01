import { create } from "zustand";
import { folderQueries } from "@/features/storage/folderQueries";
import { generateId } from "@/utils/id";
import { scriptsQueries } from "./scriptsQueries";

interface ScriptsDataState {
	breadcrumb: { id: string; name: string }[];
}

interface ScriptsDataActions {
	createFolder: (name: string, parentId: string | null) => Promise<void>;
	deleteFolder: (folderId: string) => Promise<void>;
	deleteScript: (scriptId: string) => Promise<void>;
	moveItems: (ids: string[], targetFolderId: string | null) => Promise<void>;
	duplicateItems: (ids: string[]) => Promise<void>;
}

export type ScriptsDataStore = ScriptsDataState & ScriptsDataActions;

export const useScriptsDataStore = create<ScriptsDataStore>()((_set, _get) => ({
	breadcrumb: [],

	createFolder: async (name, parentId) => {
		const id = generateId();
		await folderQueries.createFolder(id, name, parentId);
	},

	deleteFolder: async (folderId) => {
		await folderQueries.deleteFolder(folderId);
	},

	deleteScript: async (scriptId) => {
		await scriptsQueries.deleteScripts([scriptId]);
	},

	moveItems: async (_ids, _targetFolderId) => {
		// Not implemented in queries yet
	},

	duplicateItems: async (_ids) => {
		// Not implemented in queries yet
	},
}));
