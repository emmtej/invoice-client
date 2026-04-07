import { create } from "zustand";
import type { Script } from "@/types/Script";
import { reparseHtmlToScript } from "../utils/documentParser";
import { generateHtmlFromScript } from "../utils/formatParsedLines";
import { pgliteStore } from "./pgliteStore";

const PERSISTENCE_KEY = "invoice-editor-persistence-enabled";

interface ScriptStoreProps {
  scripts: Script[];
  isDbReady: boolean;
  isLoading: boolean;
  persistenceEnabled: boolean;
}

interface ScriptStoreActions {
  init: () => Promise<void>;
  togglePersistence: (enabled: boolean) => Promise<void>;
  setScripts: (newScripts: Script[]) => void;
  addScripts: (newScripts: Script[]) => Promise<void>;
  removeScript: (id: string) => Promise<void>;
  removeScripts: (ids: string[]) => Promise<void>;
  updateHtml: (id: string, html: string) => Promise<void>;
  resetScript: (id: string) => Promise<void>;
  updateScriptFromHtml: (
    id: string,
    html: string,
    shouldUpdateHtml?: boolean,
  ) => Promise<void>;
}

type ScriptStore = ScriptStoreProps & ScriptStoreActions;

export const useScriptStore = create<ScriptStore>()((set, get) => ({
  scripts: [],
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
			const scripts = await pgliteStore.getAllScripts();
			set({ scripts, isDbReady: true, isLoading: false });
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
				// Initialize DB and migrate current scripts
				await pgliteStore.saveScripts(get().scripts);
				const scripts = await pgliteStore.getAllScripts();
				if (typeof localStorage !== "undefined") {
					localStorage.setItem(PERSISTENCE_KEY, "true");
				}
				set({
					scripts,
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
			// Note: We keep current scripts in memory
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
			// Auto-enable persistence on first upload/paste
			if (!get().persistenceEnabled) {
				await get().togglePersistence(true);
			}

			if (get().persistenceEnabled) {
				await pgliteStore.saveScripts(uniqueNewScripts);
			}
			set((state) => ({
				scripts: [...state.scripts, ...uniqueNewScripts],
			}));
		}
	},

  removeScript: async (id) => {
    if (get().persistenceEnabled) {
      await pgliteStore.deleteScript(id);
    }
    set((state) => ({
      scripts: state.scripts.filter((s) => s.id !== id),
    }));
  },

  removeScripts: async (ids) => {
    if (get().persistenceEnabled) {
      await pgliteStore.deleteScripts(ids);
    }
    const idsToRemove = new Set(ids);
    set((state) => ({
      scripts: state.scripts.filter((s) => !idsToRemove.has(s.id)),
    }));
  },

  updateHtml: async (id, html) => {
    const existingScript = get().scripts.find((s) => s.id === id);
    if (!existingScript) return;

    const updatedScript = { ...existingScript, html };
    if (get().persistenceEnabled) {
      await pgliteStore.saveScript(updatedScript);
    }

    set((state) => ({
      scripts: state.scripts.map((s) => (s.id === id ? updatedScript : s)),
    }));
  },

  resetScript: async (id) => {
    const existingScript = get().scripts.find((s) => s.id === id);
    if (!existingScript) return;

    const updatedScript = {
      ...existingScript,
      html: generateHtmlFromScript(existingScript.lines),
    };
    if (get().persistenceEnabled) {
      await pgliteStore.saveScript(updatedScript);
    }

    set((state) => ({
      scripts: state.scripts.map((s) => (s.id === id ? updatedScript : s)),
    }));
  },

  updateScriptFromHtml: async (
    id: string,
    html: string,
    shouldUpdateHtml = true,
  ) => {
    const { lines, overview, html: newHtml } = reparseHtmlToScript(html);
    const existingScript = get().scripts.find((s) => s.id === id);

    if (!existingScript) return;

    // If we shouldn't update the HTML field (to avoid disrupting the editor),
    // we keep the HTML that was passed in (which should be the current editor HTML).
    const finalHtml = shouldUpdateHtml ? newHtml : html;

    // Optimization: if nothing changed, don't trigger a state update
    const hasStructureChanged =
      existingScript.lines.length !== lines.length ||
      existingScript.overview.wordCount !== overview.wordCount ||
      existingScript.lines[0]?.source !== lines[0]?.source ||
      existingScript.lines[existingScript.lines.length - 1]?.source !==
        lines[lines.length - 1]?.source;

    if (existingScript.html === finalHtml && !hasStructureChanged) {
      return;
    }

    const updatedScript = {
      ...existingScript,
      lines,
      overview,
      html: finalHtml,
    };
    if (get().persistenceEnabled) {
      await pgliteStore.saveScript(updatedScript);
    }

    set((state) => ({
      scripts: state.scripts.map((s) => (s.id === id ? updatedScript : s)),
    }));
  },
}));
