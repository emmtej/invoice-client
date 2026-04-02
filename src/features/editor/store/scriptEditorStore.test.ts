/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "vitest";
import { useScriptStore } from "./scriptEditorStore";

describe("scriptEditorStore", () => {
	beforeEach(() => {
		useScriptStore.setState({ scripts: [] });
	});

	it("should update lines and overview but preserve html when shouldUpdateHtml is false", () => {
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
		
		// Update store with current editor HTML first (simulating onUpdate from Tiptap)
		useScriptStore.getState().updateHtml("1", updatedHtmlFromEditor);

		// Now trigger debounced reparse with shouldUpdateHtml = false
		useScriptStore.getState().updateScriptFromHtml("1", updatedHtmlFromEditor, false);

		const updatedScript = useScriptStore.getState().scripts[0];

		// HTML should remain EXACTLY as passed from editor
		expect(updatedScript.html).toBe(updatedHtmlFromEditor);
		
		// Lines should be updated (reparsed)
		expect(updatedScript.lines.length).toBe(1);
		expect(updatedScript.lines[0].type).toBe("dialogue");
		expect((updatedScript.lines[0] as any).content).toBe("Hello World");
		
		// Overview should be updated
		expect(updatedScript.overview.wordCount).toBe(2);
	});

	it("should update HTML when shouldUpdateHtml is true (default)", () => {
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

		// This HTML would be reformatted by reparseHtmlToScript (stripped or wrapped in <s> if invalid)
		const dirtyHtml = "<p>  00:01 Speaker: Clean  </p>";
		
		useScriptStore.getState().updateScriptFromHtml("1", dirtyHtml, true);

		const updatedScript = useScriptStore.getState().scripts[0];

		// The HTML should be formatted/cleaned by generateHtmlFromScript
		// reparseHtmlToScript will trim it and produce <p>00:01 Speaker: Clean</p>
		expect(updatedScript.html).toBe("<p>00:01 Speaker: Clean</p>");
	});
});
