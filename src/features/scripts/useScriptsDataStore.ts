import { create } from "zustand";
import { folderRepository } from "@/features/storage/folderRepository";
import { scriptRepository } from "@/features/storage/scriptRepository";
import { generateId } from "@/utils/id";

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
		await folderRepository.createFolder(id, name, parentId);
	},

	deleteFolder: async (folderId) => {
		await folderRepository.deleteFolder(folderId);
	},

	deleteScript: async (scriptId) => {
		await scriptRepository.deleteScripts([scriptId]);
	},

	moveItems: async (_ids, _targetFolderId) => {
		// Not implemented in queries yet
	},

	duplicateItems: async (_ids) => {
		// Not implemented in queries yet
	},
}));
