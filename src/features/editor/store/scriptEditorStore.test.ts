/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock PGLite and pgliteStore
vi.mock("./pgliteStore", () => ({
	pgliteStore: {
		getAllScripts: vi.fn().mockResolvedValue([]),
		saveScript: vi.fn().mockResolvedValue(undefined),
		saveScripts: vi.fn().mockResolvedValue(undefined),
		deleteScript: vi.fn().mockResolvedValue(undefined),
		deleteScripts: vi.fn().mockResolvedValue(undefined),
	},
}));

import { useScriptStore } from "./scriptEditorStore";
import { pgliteStore } from "./pgliteStore";

describe("scriptEditorStore", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useScriptStore.setState({
			scripts: [],
			isDbReady: false,
			isLoading: false,
			persistenceEnabled: true,
		});
	});

	it("should initialize the store from PGLite", async () => {
		const mockScripts = [
			{
				id: "1",
				name: "Stored Script",
				html: "<p>00:01 Speaker: Hello</p>",
				lines: [],
				overview: { wordCount: 0 },
				source: document.implementation.createHTMLDocument(),
			},
		];
		(pgliteStore.getAllScripts as any).mockResolvedValue(mockScripts);

		await useScriptStore.getState().init();

		expect(useScriptStore.getState().scripts).toEqual(mockScripts);
		expect(useScriptStore.getState().isDbReady).toBe(true);
		expect(pgliteStore.getAllScripts).toHaveBeenCalled();
	});

	it("should update lines and overview but preserve html when shouldUpdateHtml is false", async () => {
		const initialHtml = "<p>00:01 Speaker: Hello</p>";
		const initialScript = {
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
		};

		useScriptStore.setState({ scripts: [initialScript] });

		const updatedHtmlFromEditor = "<p>00:01 Speaker: Hello World</p>";

		// Update store with current editor HTML first
		await useScriptStore.getState().updateHtml("1", updatedHtmlFromEditor);

		// Now trigger debounced reparse with shouldUpdateHtml = false
		await useScriptStore
			.getState()
			.updateScriptFromHtml("1", updatedHtmlFromEditor, false);

		const updatedScript = useScriptStore.getState().scripts[0];

		// HTML should remain EXACTLY as passed from editor
		expect(updatedScript.html).toBe(updatedHtmlFromEditor);

		// Lines should be updated (reparsed)
		expect(updatedScript.lines.length).toBe(1);
		const firstLine = updatedScript.lines[0];
		expect(firstLine.type).toBe("dialogue");
		if (firstLine.type === "dialogue") {
			expect(firstLine.content).toBe("Hello World");
		}

		// Overview should be updated
		expect(updatedScript.overview.wordCount).toBe(2);
		expect(pgliteStore.saveScript).toHaveBeenCalled();
	});

	it("should update HTML when shouldUpdateHtml is true (default)", async () => {
		const initialHtml = "<p>Original</p>";
		const initialScript = {
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
		};

		useScriptStore.setState({ scripts: [initialScript] });

		// This HTML would be reformatted by reparseHtmlToScript
		const dirtyHtml = "<p>  00:01 Speaker: Clean  </p>";

		await useScriptStore.getState().updateScriptFromHtml("1", dirtyHtml, true);

		const updatedScript = useScriptStore.getState().scripts[0];

		// The HTML should be formatted/cleaned by generateHtmlFromScript
		expect(updatedScript.html).toBe("<p>00:01 Speaker: Clean</p>");
	});
});
