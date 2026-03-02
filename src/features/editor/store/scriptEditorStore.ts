import { create } from "zustand";
import type { Script } from "@/types/Script";
import { generateHtmlFromScript } from "../utils/formatParsedLines";
import { reparseHtmlToScript } from "../utils/documentParser";

interface ScriptStoreProps {
	scripts: Script[];
}

interface ScriptStoreActions {
	setScripts: (newScripts: Script[]) => void;
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
			return {
				scripts: state.scripts.map((s) =>
					s.id === id ? { ...s, lines, overview, html: newHtml } : s,
				),
			};
		}),
}));
