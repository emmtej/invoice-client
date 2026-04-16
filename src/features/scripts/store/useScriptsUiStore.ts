import { create } from "zustand";
import type { Script } from "@/types/Script";
import { scriptsQueries } from "./scriptsQueries";

interface ScriptsUiState {
	currentFolderId: string | null;
	selectedScript: Script | null;
	selectedIds: string[];
	lastSelectedId: string | null;
	isPreviewLoading: boolean;
}

interface ScriptsUiActions {
	setCurrentFolder: (folderId: string | null) => void;
	setSelectedScript: (script: Script | null) => void;
	selectScript: (scriptId: string) => Promise<void>;
	setSelectedIds: (ids: string[]) => void;
	toggleSelection: (
		id: string,
		isMulti: boolean,
		isRange: boolean,
		allCurrentIds: string[],
	) => void;
	selectAll: (allCurrentIds: string[]) => void;
	clearSelection: () => void;
}

export type ScriptsUiStore = ScriptsUiState & ScriptsUiActions;

export const useScriptsUiStore = create<ScriptsUiStore>()((set, get) => ({
	currentFolderId: null,
	selectedScript: null,
	selectedIds: [],
	lastSelectedId: null,
	isPreviewLoading: false,

	setCurrentFolder: (folderId) =>
		set({ currentFolderId: folderId, selectedScript: null, selectedIds: [] }),

	setSelectedScript: (script) => set({ selectedScript: script }),

	selectScript: async (scriptId) => {
		set({ isPreviewLoading: true });
		try {
			const script = await scriptsQueries.getScriptById(scriptId);
			set({ selectedScript: script, isPreviewLoading: false });
			if (script) {
				scriptsQueries.touchScript(scriptId); // fire-and-forget
			}
		} catch (error) {
			console.error("Failed to load script preview:", error);
			set({ isPreviewLoading: false });
		}
	},

	setSelectedIds: (ids) => set({ selectedIds: ids }),

	toggleSelection: (id, isMulti, isRange, allCurrentIds) => {
		const { selectedIds, lastSelectedId } = get();

		if (isRange && lastSelectedId) {
			const lastIndex = allCurrentIds.indexOf(lastSelectedId);
			const currentIndex = allCurrentIds.indexOf(id);
			if (lastIndex !== -1 && currentIndex !== -1) {
				const start = Math.min(lastIndex, currentIndex);
				const end = Math.max(lastIndex, currentIndex);
				const rangeIds = allCurrentIds.slice(start, end + 1);
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

	selectAll: (allCurrentIds) => {
		set({ selectedIds: allCurrentIds });
	},

	clearSelection: () =>
		set({ selectedScript: null, selectedIds: [], lastSelectedId: null }),
}));
