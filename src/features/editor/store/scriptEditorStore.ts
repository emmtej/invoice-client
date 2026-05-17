import { create } from "zustand";
import { reparseHtmlToScript } from "@/features/editor/utils/documentParser";
import { scriptRepository } from "@/features/storage/repository/scriptRepository";
import type { Script, ScriptMetadata } from "@/types/Script";

interface ScriptStoreState {
	scripts: ScriptMetadata[];
	activeScriptId: string | null;
	activeScript: Script | null;
	editingScriptId: string | null;
	isLoading: boolean;
	persistenceEnabled: boolean;
}

interface ScriptStoreActions {
	init: () => Promise<void>;
	addScripts: (newScripts: Script[]) => Promise<void>;
	loadScript: (id: string) => Promise<void>;
	selectScript: (id: string | null) => Promise<void>;
	closeActiveScript: () => void;
	setEditingScriptId: (id: string | null) => void;
	removeScript: (id: string) => Promise<void>;
	removeScripts: (ids: string[]) => Promise<void>;
	promoteScriptsToLibrary: (
		ids: string[],
		folderId: string | null,
	) => Promise<void>;
	updateActiveScript: (content: string) => void;
	saveActiveScript: () => Promise<void>;
	resetScript: (id: string) => Promise<void>;
	syncScriptFromHtml: (
		id: string,
		html: string,
		save?: boolean,
	) => Promise<void>;
}

export type ScriptStore = ScriptStoreState & ScriptStoreActions;

export const useScriptStore = create<ScriptStore>((set, get) => ({
	scripts: [],
	activeScriptId: null,
	activeScript: null,
	editingScriptId: null,
	isLoading: false,
	persistenceEnabled: true,

	init: async () => {
		set({ isLoading: true });
		try {
			await scriptRepository.cleanExpiredDrafts();
			const drafts = await scriptRepository.getAllDrafts();
			set({
				scripts: drafts,
				isLoading: false,
			});

			const { activeScriptId } = get();
			if (activeScriptId) {
				const script = await scriptRepository.getScriptById(activeScriptId);
				if (script) {
					set({ activeScript: script });
				} else {
					set({ activeScriptId: null, activeScript: null });
				}
			}
		} catch (error) {
			console.error("Failed to initialize script store:", error);
			set({ isLoading: false });
		}
	},

	addScripts: async (newScripts) => {
		const { scripts: currentScripts } = get();
		const currentIds = new Set(currentScripts.map((s) => s.id));
		const uniqueNewScripts = newScripts.filter((s) => !currentIds.has(s.id));

		if (uniqueNewScripts.length === 0) return;

		try {
			for (const s of uniqueNewScripts) {
				await scriptRepository.saveDraft(s);
			}
			const newMetadata: ScriptMetadata[] = uniqueNewScripts.map((s) => ({
				id: s.id,
				name: s.name,
				overview: s.overview,
				createdAt: s.createdAt,
			}));

			set((state) => ({
				scripts: [...state.scripts, ...newMetadata],
			}));
		} catch (error) {
			console.error("Failed to add scripts:", error);
		}
	},

	loadScript: async (id) => {
		set({ activeScriptId: id, isLoading: true });
		try {
			const script = await scriptRepository.getScriptById(id);
			set({ activeScript: script, isLoading: false });
		} catch (error) {
			console.error("Failed to load script:", error);
			set({ isLoading: false });
		}
	},

	selectScript: async (id) => {
		if (id === null) {
			set({ activeScriptId: null, activeScript: null });
			return;
		}
		await get().loadScript(id);
	},

	closeActiveScript: () => {
		set({ activeScriptId: null, activeScript: null, editingScriptId: null });
	},

	setEditingScriptId: (id) => {
		set({ editingScriptId: id });
	},

	removeScript: async (id) => {
		try {
			await scriptRepository.deleteDrafts([id]);
			set((state) => ({
				scripts: state.scripts.filter((s) => s.id !== id),
				activeScriptId:
					state.activeScriptId === id ? null : state.activeScriptId,
				activeScript: state.activeScriptId === id ? null : state.activeScript,
				editingScriptId:
					state.editingScriptId === id ? null : state.editingScriptId,
			}));
		} catch (error) {
			console.error("Failed to remove script:", error);
		}
	},

	removeScripts: async (ids) => {
		try {
			await scriptRepository.deleteDrafts(ids);
			const idSet = new Set(ids);
			set((state) => ({
				scripts: state.scripts.filter((s) => !idSet.has(s.id)),
				activeScriptId:
					state.activeScriptId && idSet.has(state.activeScriptId)
						? null
						: state.activeScriptId,
				activeScript:
					state.activeScriptId && idSet.has(state.activeScriptId)
						? null
						: state.activeScript,
				editingScriptId:
					state.editingScriptId && idSet.has(state.editingScriptId)
						? null
						: state.editingScriptId,
			}));
		} catch (error) {
			console.error("Failed to remove scripts:", error);
		}
	},

	promoteScriptsToLibrary: async (ids, folderId) => {
		set({ isLoading: true });
		try {
			await scriptRepository.promoteDrafts(ids, folderId);
			const idSet = new Set(ids);
			set((state) => ({
				scripts: state.scripts.filter((s) => !idSet.has(s.id)),
				activeScriptId:
					state.activeScriptId && idSet.has(state.activeScriptId)
						? null
						: state.activeScriptId,
				activeScript:
					state.activeScriptId && idSet.has(state.activeScriptId)
						? null
						: state.activeScript,
				isLoading: false,
			}));
		} catch (error) {
			console.error("Failed to promote scripts:", error);
			set({ isLoading: false });
		}
	},

	updateActiveScript: (content) => {
		const { activeScript } = get();
		if (!activeScript) return;

		set({
			activeScript: {
				...activeScript,
				html: content,
			},
		});
	},

	saveActiveScript: async () => {
		const { activeScript } = get();
		if (!activeScript) return;

		try {
			await scriptRepository.saveDraft(activeScript);
		} catch (error) {
			console.error("Failed to save active script:", error);
		}
	},

	resetScript: async (id) => {
		// Just re-load from DB to reset
		await get().loadScript(id);
	},

	syncScriptFromHtml: async (id, html, save = true) => {
		const { activeScript } = get();
		if (!activeScript || activeScript.id !== id) return;

		const { lines, overview } = reparseHtmlToScript(html);

		const updatedScript: Script = {
			...activeScript,
			html,
			lines,
			overview,
		};

		set({ activeScript: updatedScript });

		if (save) {
			await scriptRepository.saveDraft(updatedScript);
		}
	},
}));

// Backward compatibility or named export if needed
export const scriptEditorStore = useScriptStore;
