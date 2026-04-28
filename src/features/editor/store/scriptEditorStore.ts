import { create } from "zustand";
import type { Script, ScriptMetadata } from "@/types/Script";
import { reparseHtmlToScript } from "../utils/documentParser";
import { generateHtmlFromScript } from "../utils/formatParsedLines";
import { pgliteStore } from "./pgliteStore";

const PERSISTENCE_KEY = "invoice-editor-persistence-enabled";

interface ScriptStoreProps {
	scripts: ScriptMetadata[];
	activeScript: Script | null;
	isDbReady: boolean;
	isLoading: boolean;
	persistenceEnabled: boolean;
}

interface ScriptStoreActions {
	init: () => Promise<void>;
	togglePersistence: (enabled: boolean) => Promise<void>;
	setScripts: (newScripts: ScriptMetadata[]) => void;
	addScripts: (newScripts: Script[]) => Promise<void>;
	removeScript: (id: string) => Promise<void>;
	removeScripts: (ids: string[]) => Promise<void>;
	loadScript: (id: string) => Promise<void>;
	closeActiveScript: () => void;
	updateHtml: (id: string, html: string) => Promise<void>;
	resetScript: (id: string) => Promise<void>;
	updateScriptFromHtml: (
		id: string,
		html: string,
		shouldUpdateHtml?: boolean,
	) => Promise<void>;
	syncScriptFromHtml: (
		id: string,
		html: string,
		shouldUpdateHtml?: boolean,
	) => Promise<void>;
	promoteScriptsToLibrary: (
		ids: string[],
		folderId: string | null,
	) => Promise<void>;
}

type ScriptStore = ScriptStoreProps & ScriptStoreActions;

export const useScriptStore = create<ScriptStore>()((set, get) => ({
	scripts: [],
	activeScript: null,
	isDbReady: false,
	isLoading: false,
	persistenceEnabled:
		typeof localStorage !== "undefined" &&
		typeof localStorage.getItem === "function"
			? localStorage.getItem(PERSISTENCE_KEY) === "true"
			: false,

	init: async () => {
		if (!get().persistenceEnabled) return;

		set({ isLoading: true });
		try {
			// Drafts are still full Script objects
			const drafts = await pgliteStore.getAllDraftScripts();
			set({
				scripts: drafts.map(({ html, lines, source, ...meta }) => meta),
				isDbReady: true,
				isLoading: false,
			});
		} catch (error) {
			console.error("Failed to initialize PGLite database:", error);
			set({ isDbReady: false, isLoading: false });
		}
	},

	togglePersistence: async (enabled: boolean) => {
		if (enabled === get().persistenceEnabled) return;

		if (enabled) {
			set({ isLoading: true });
			try {
				// Note: this part might need more care since get().scripts is now metadata
				// For simplicity in this refactor, we'll assume persistence is usually
				// enabled early or handled via promotion.
				if (typeof localStorage !== "undefined") {
					localStorage.setItem(PERSISTENCE_KEY, "true");
				}
				set({
					persistenceEnabled: true,
					isDbReady: true,
					isLoading: false,
				});
			} catch (error) {
				console.error("Failed to enable PGLite persistence:", error);
				set({ isLoading: false });
			}
		} else {
			if (typeof localStorage !== "undefined") {
				localStorage.setItem(PERSISTENCE_KEY, "false");
			}
			set({ persistenceEnabled: false, isDbReady: false });
		}
	},

	setScripts: (scripts) =>
		set({
			scripts,
		}),

	addScripts: async (newScripts) => {
		const existingIds = new Set(get().scripts.map((s) => s.id));
		const uniqueNewScripts = newScripts.filter((s) => !existingIds.has(s.id));

		if (uniqueNewScripts.length > 0) {
			if (!get().persistenceEnabled) {
				await get().togglePersistence(true);
			}

			if (get().persistenceEnabled) {
				await pgliteStore.saveDraftScripts(uniqueNewScripts);
			}

			const newMetadata = uniqueNewScripts.map(
				({ html, lines, source, ...meta }) => meta,
			);

			set((state) => ({
				scripts: [...state.scripts, ...newMetadata],
			}));
		}
	},

	removeScript: async (id) => {
		if (get().persistenceEnabled) {
			await pgliteStore.deleteDraftScript(id);
		}
		set((state) => ({
			scripts: state.scripts.filter((s) => s.id !== id),
			activeScript: get().activeScript?.id === id ? null : get().activeScript,
		}));
	},

	removeScripts: async (ids) => {
		if (get().persistenceEnabled) {
			await pgliteStore.deleteDraftScripts(ids);
		}
		const idsToRemove = new Set(ids);
		set((state) => ({
			scripts: state.scripts.filter((s) => !idsToRemove.has(s.id)),
			activeScript:
				get().activeScript && idsToRemove.has(get().activeScript!.id)
					? null
					: get().activeScript,
		}));
	},

	loadScript: async (id) => {
		set({ isLoading: true });
		try {
			// First check drafts
			const drafts = await pgliteStore.getAllDraftScripts();
			const draft = drafts.find((d) => d.id === id);
			if (draft) {
				set({ activeScript: draft, isLoading: false });
				return;
			}

			// Then check library
			const script = await pgliteStore.getScriptFull(id);
			set({ activeScript: script, isLoading: false });
		} catch (error) {
			console.error("Failed to load script:", error);
			set({ isLoading: false });
		}
	},

	closeActiveScript: () => set({ activeScript: null }),

	updateHtml: async (id, html) => {
		const activeScript = get().activeScript;
		if (!activeScript || activeScript.id !== id) return;

		const updatedScript = { ...activeScript, html };
		if (get().persistenceEnabled) {
			await pgliteStore.saveDraftScript(updatedScript);
		}

		set({ activeScript: updatedScript });
	},

	resetScript: async (id) => {
		const activeScript = get().activeScript;
		if (!activeScript || activeScript.id !== id) return;

		const updatedScript = {
			...activeScript,
			html: generateHtmlFromScript(activeScript.lines),
		};
		if (get().persistenceEnabled) {
			await pgliteStore.saveDraftScript(updatedScript);
		}

		set({ activeScript: updatedScript });
	},

	updateScriptFromHtml: async (
		id: string,
		html: string,
		shouldUpdateHtml = true,
	) => {
		await get().syncScriptFromHtml(id, html, shouldUpdateHtml);
	},

	syncScriptFromHtml: async (
		id: string,
		html: string,
		shouldUpdateHtml = true,
	) => {
		const activeScript = get().activeScript;
		if (!activeScript || activeScript.id !== id) return;

		const { lines, overview, html: newHtml } = reparseHtmlToScript(html);
		const finalHtml = shouldUpdateHtml ? newHtml : html;

		const hasStructureChanged =
			activeScript.lines.length !== lines.length ||
			activeScript.overview.wordCount !== overview.wordCount ||
			activeScript.lines[0]?.source !== lines[0]?.source ||
			activeScript.lines[activeScript.lines.length - 1]?.source !==
				lines[lines.length - 1]?.source;

		if (activeScript.html === finalHtml && !hasStructureChanged) {
			return;
		}

		const updatedScript = {
			...activeScript,
			lines,
			overview,
			html: finalHtml,
		};

		if (get().persistenceEnabled) {
			await pgliteStore.saveDraftScript(updatedScript);
		}

		// Update active script AND metadata in the list if overview changed
		set((state) => ({
			activeScript: updatedScript,
			scripts: state.scripts.map((s) => (s.id === id ? { ...s, overview } : s)),
		}));
	},

	promoteScriptsToLibrary: async (ids, folderId) => {
		if (ids.length === 0 || !get().persistenceEnabled) return;
		await pgliteStore.promoteDraftsToScripts(ids, folderId);
		const idsToPromote = new Set(ids);
		set((state) => ({
			scripts: state.scripts.filter((script) => !idsToPromote.has(script.id)),
		}));
	},
}));
