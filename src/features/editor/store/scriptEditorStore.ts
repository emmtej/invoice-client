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
	updateHtml: (id: string, html: string) => void;
	resetScript: (id: string) => void;
	updateScriptFromHtml: (id: string, html: string) => void;
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

	updateScriptFromHtml: (id, html) =>
		set((state) => {
			const { lines, overview, html: newHtml } = reparseHtmlToScript(html);
			const existingScript = state.scripts.find((s) => s.id === id);

			if (existingScript && existingScript.html === newHtml) {
				return state;
			}

			return {
				scripts: state.scripts.map((s) =>
					s.id === id ? { ...s, lines, overview, html: newHtml } : s,
				),
			};
		}),
}));
