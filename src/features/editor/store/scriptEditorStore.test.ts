/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Script } from "@/types/Script";

// Mock PGLite and pgliteStore
vi.mock("./pgliteStore", () => ({
	pgliteStore: {
		getAllDraftScripts: vi.fn().mockResolvedValue([]),
		saveDraftScript: vi.fn().mockResolvedValue(undefined),
		saveDraftScripts: vi.fn().mockResolvedValue(undefined),
		deleteDraftScript: vi.fn().mockResolvedValue(undefined),
		deleteDraftScripts: vi.fn().mockResolvedValue(undefined),
		promoteDraftsToScripts: vi.fn().mockResolvedValue(undefined),
	},
}));

import { pgliteStore } from "./pgliteStore";
import { useScriptStore } from "./scriptEditorStore";

describe("scriptEditorStore", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useScriptStore.setState({
			scripts: [],
			activeScript: null,
			isDbReady: false,
			isLoading: false,
			persistenceEnabled: true,
		});
	});

	it("should initialize the store with metadata from draft storage", async () => {
		const mockScripts: Script[] = [
			{
				id: "1",
				name: "Stored Script",
				html: "<p>00:01 Speaker: Hello</p>",
				lines: [],
				overview: {
					validLines: [],
					invalidLines: [],
					actionLines: [],
					scenes: [],
					wordCount: 0,
					totalLines: 0,
				},
				source: document.implementation.createHTMLDocument(),
				createdAt: new Date(),
			},
		];
		vi.mocked(pgliteStore.getAllDraftScripts).mockResolvedValue(mockScripts);

		await useScriptStore.getState().init();

		expect(useScriptStore.getState().scripts[0].id).toBe("1");
		// @ts-expect-error - html should not exist on metadata
		expect(useScriptStore.getState().scripts[0].html).toBeUndefined();
		expect(useScriptStore.getState().isDbReady).toBe(true);
		expect(pgliteStore.getAllDraftScripts).toHaveBeenCalled();
	});

	it("should update lines and overview but preserve html when shouldUpdateHtml is false in activeScript", async () => {
		const initialHtml = "<p>00:01 Speaker: Hello</p>";
		const initialScript: Script = {
			id: "1",
			name: "Test",
			source: document.implementation.createHTMLDocument(),
			lines: [],
			overview: {
				validLines: [],
				invalidLines: [],
				actionLines: [],
				scenes: [],
				wordCount: 0,
				totalLines: 0,
			},
			html: initialHtml,
			createdAt: new Date(),
		};

		useScriptStore.setState({
			activeScript: initialScript,
			scripts: [{ ...initialScript }],
		});

		const updatedHtmlFromEditor = "<p>00:01 Speaker: Hello World</p>";

		// Update store with current editor HTML first
		await useScriptStore.getState().updateHtml("1", updatedHtmlFromEditor);

		// Now trigger debounced reparse with shouldUpdateHtml = false
		await useScriptStore
			.getState()
			.updateScriptFromHtml("1", updatedHtmlFromEditor, false);

		const updatedActiveScript = useScriptStore.getState().activeScript;

		// HTML should remain EXACTLY as passed from editor
		expect(updatedActiveScript?.html).toBe(updatedHtmlFromEditor);

		// Lines should be updated (reparsed)
		expect(updatedActiveScript?.lines.length).toBe(1);
		const firstLine = updatedActiveScript?.lines[0];
		expect(firstLine?.type).toBe("dialogue");
		if (firstLine?.type === "dialogue") {
			expect(firstLine.content).toBe("Hello World");
		}

		// Overview should be updated
		expect(updatedActiveScript?.overview.wordCount).toBe(2);
		expect(pgliteStore.saveDraftScript).toHaveBeenCalled();
	});

	it("should update HTML when shouldUpdateHtml is true (default) in activeScript", async () => {
		const initialHtml = "<p>Original</p>";
		const initialScript: Script = {
			id: "1",
			name: "Test",
			source: document.implementation.createHTMLDocument(),
			lines: [],
			overview: {
				validLines: [],
				invalidLines: [],
				actionLines: [],
				scenes: [],
				wordCount: 0,
				totalLines: 0,
			},
			html: initialHtml,
			createdAt: new Date(),
		};

		useScriptStore.setState({ activeScript: initialScript });

		// This HTML would be reformatted by reparseHtmlToScript
		const dirtyHtml = "<p>  00:01 Speaker: Clean  </p>";

		await useScriptStore.getState().updateScriptFromHtml("1", dirtyHtml, true);

		const updatedActiveScript = useScriptStore.getState().activeScript;

		// The HTML should be formatted/cleaned by generateHtmlFromScript
		expect(updatedActiveScript?.html).toBe("<p>00:01 Speaker: Clean</p>");
	});

	it("promotes selected drafts and removes them from workspace", async () => {
		const scripts = [
			{
				id: "s1",
				name: "One",
				overview: {
					validLines: [],
					invalidLines: [],
					actionLines: [],
					scenes: [],
					wordCount: 0,
					totalLines: 0,
				},
				createdAt: new Date(),
			},
		];

		useScriptStore.setState({ scripts, persistenceEnabled: true });
		await useScriptStore.getState().promoteScriptsToLibrary(["s1"], "folder-1");

		expect(pgliteStore.promoteDraftsToScripts).toHaveBeenCalledWith(
			["s1"],
			"folder-1",
		);
		expect(useScriptStore.getState().scripts.map((s) => s.id)).toEqual([]);
	});
});
