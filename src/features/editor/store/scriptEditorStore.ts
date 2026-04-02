import { create } from "zustand";
import type { Script } from "@/types/Script";
import { reparseHtmlToScript } from "../utils/documentParser";
import { generateHtmlFromScript } from "../utils/formatParsedLines";

interface ScriptStoreProps {
	scripts: Script[];
}

interface ScriptStoreActions {
	setScripts: (newScripts: Script[]) => void;
	addScripts: (newScripts: Script[]) => void;
	removeScript: (id: string) => void;
	removeScripts: (ids: string[]) => void;
	updateHtml: (id: string, html: string) => void;
	resetScript: (id: string) => void;
	updateScriptFromHtml: (
		id: string,
		html: string,
		shouldUpdateHtml?: boolean,
	) => void;
}

type ScriptStore = ScriptStoreProps & ScriptStoreActions;

export const useScriptStore = create<ScriptStore>((set) => ({
	scripts: [],
	setScripts: (scripts) =>
		set({
			scripts,
		}),
	addScripts: (newScripts) =>
		set((state) => {
			const existingIds = new Set(state.scripts.map((s) => s.id));
			const uniqueNewScripts = newScripts.filter((s) => !existingIds.has(s.id));
			return {
				scripts: [...state.scripts, ...uniqueNewScripts],
			};
		}),
	removeScript: (id) =>
		set((state) => ({
			scripts: state.scripts.filter((s) => s.id !== id),
		})),
	removeScripts: (ids) =>
		set((state) => {
			const idsToRemove = new Set(ids);
			return {
				scripts: state.scripts.filter((s) => !idsToRemove.has(s.id)),
			};
		}),
	updateHtml: (id, html) =>
		set((state) => ({
			scripts: state.scripts.map((s) => (s.id === id ? { ...s, html } : s)),
		})),

	resetScript: (id) =>
		set((state) => ({
			scripts: state.scripts.map((s) =>
				s.id === id ? { ...s, html: generateHtmlFromScript(s.lines) } : s,
			),
		})),

	updateScriptFromHtml: (id: string, html: string, shouldUpdateHtml = true) =>
		set((state) => {
			const { lines, overview, html: newHtml } = reparseHtmlToScript(html);
			const existingScript = state.scripts.find((s) => s.id === id);

			if (!existingScript) return state;

			// If we shouldn't update the HTML field (to avoid disrupting the editor),
			// we keep the HTML that was passed in (which should be the current editor HTML).
			const finalHtml = shouldUpdateHtml ? newHtml : html;

			// Optimization: if nothing changed, don't trigger a state update
			if (
				existingScript.html === finalHtml &&
				JSON.stringify(existingScript.lines) === JSON.stringify(lines)
			) {
				return state;
			}

			return {
				scripts: state.scripts.map((s) =>
					s.id === id ? { ...s, lines, overview, html: finalHtml } : s,
				),
			};
		}),
}));
