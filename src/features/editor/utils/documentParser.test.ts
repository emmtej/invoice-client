/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from "vitest";
import type { ParsedLine } from "@/types/Script";
import {
	documentLineParser,
	getScriptOverview,
	processDocuments,
	reparseHtmlToScript,
} from "./documentParser";
import { parseHtmlToDocument } from "./parseHtmlToDocument";

describe("documentLineParser", () => {
	it("should parse valid dialogue with H:MM:SS timestamp", () => {
		const line = "1:23:45 Speaker: Hello world";
		const result = documentLineParser(line);

		expect(result).toMatchObject({
			type: "dialogue",
			timestamp: "1:23:45",
			speakers: ["Speaker"],
			content: "Hello world",
			source: line,
		});
		if (result?.type === "dialogue") {
			expect(result.metadata.wordCount).toBe(2);
		}
	});

	it("should parse valid dialogue with MM:SS timestamp", () => {
		const line = "12:34 Speaker: Multiple words here";
		const result = documentLineParser(line);

		expect(result).toMatchObject({
			type: "dialogue",
			timestamp: "12:34",
			speakers: ["Speaker"],
			content: "Multiple words here",
		});
	});

	it("should parse dialogue with multiple speakers", () => {
		const line = "00:01 Alice and Bob: Hi there";
		const result = documentLineParser(line);

		expect(result).toMatchObject({
			type: "dialogue",
			speakers: ["Alice", "Bob"],
			content: "Hi there",
		});
	});

	it("should parse dialogue with speakers separated by comma, slash, 'and', or '&'", () => {
		const line1 = "00:01 Alice, Bob: Hi";
		const line2 = "00:01 Alice/Bob: Hi";
		const line3 = "00:01 Alice and Bob: Hi";
		const line4 = "00:01 Alice & Bob: Hi";

		expect(documentLineParser(line1)).toMatchObject({
			speakers: ["Alice", "Bob"],
		});
		expect(documentLineParser(line2)).toMatchObject({
			speakers: ["Alice", "Bob"],
		});
		expect(documentLineParser(line3)).toMatchObject({
			speakers: ["Alice", "Bob"],
		});
		expect(documentLineParser(line4)).toMatchObject({
			speakers: ["Alice", "Bob"],
		});
	});

	it("should extract notes in parentheses", () => {
		const line = "00:01 Speaker (shouting): Hello!";
		const result = documentLineParser(line);

		expect(result).toMatchObject({
			type: "dialogue",
			speakers: ["Speaker"],
			notes: ["shouting"],
			content: "Hello!",
		});
	});

	it("should handle multiple notes", () => {
		const line = "00:01 Speaker (shouting) (angry): Hello!";
		const result = documentLineParser(line);

		expect(result).toMatchObject({
			notes: ["shouting", "angry"],
		});
	});

	it("should parse as action if line has timestamp, speaker, notes but no content", () => {
		const line = "00:01 Speaker: (Door slams)";
		const result = documentLineParser(line);

		expect(result).toMatchObject({
			type: "action",
			timestamp: "00:01",
			speakers: ["Speaker"],
			notes: ["Door slams"],
		});
	});

	it("should parse markers case-insensitively", () => {
		expect(documentLineParser("SCENE 1")).toMatchObject({ type: "marker" });
		expect(documentLineParser("scene 2")).toMatchObject({ type: "marker" });
		expect(documentLineParser("BLOOPERS")).toMatchObject({ type: "marker" });
		expect(documentLineParser("vlog 5")).toMatchObject({ type: "marker" });
		expect(documentLineParser("Scena 10")).toMatchObject({ type: "marker" });
	});

	it("should return malformed if missing colon after timestamp/speaker", () => {
		const line = "00:01 Speaker No Colon";
		const result = documentLineParser(line);
		expect(result?.type).toBe("malformed");
	});

	it("should return invalid for unknown formats", () => {
		const line = "Just some random text";
		const result = documentLineParser(line);
		expect(result?.type).toBe("invalid");
	});

	it("should return null for empty or whitespace-only lines", () => {
		expect(documentLineParser("")).toBeNull();
		expect(documentLineParser("   ")).toBeNull();
	});
});

describe("reparseHtmlToScript", () => {
	it("should parse HTML into structured script data", () => {
		const html = "<h3>Scene 1</h3><p>00:01 Alice: Hello</p><p>Invalid line</p>";
		const result = reparseHtmlToScript(html);

		expect(result.lines).toHaveLength(3);
		expect(result.lines[0].type).toBe("marker");
		expect(result.lines[1].type).toBe("dialogue");
		expect(result.lines[2].type).toBe("invalid");
		expect(result.overview.totalLines).toBe(3);
		expect(result.overview.wordCount).toBe(1);
		expect(result.html).toContain("<h3>Scene 1</h3>");
		expect(result.html).toContain("<p>00:01 Alice: Hello</p>");
		expect(result.html).toContain("<p><s>Invalid line</s></p>");
	});
});

describe("processDocuments", () => {
	it("should process multiple documents", () => {
		const doc1 = parseHtmlToDocument("<p>00:01 Alice: Hello</p>");
		const doc2 = parseHtmlToDocument("<p>00:02 Bob: Bye</p>");

		const documents = [
			{ name: "Doc 1", document: doc1 },
			{ name: "Doc 2", document: doc2 },
		];

		const scripts = processDocuments(documents);

		expect(scripts).toHaveLength(2);
		expect(scripts[0].name).toBe("Doc 1");
		expect(scripts[0].lines[0]).toMatchObject({
			type: "dialogue",
			content: "Hello",
		});
		expect(scripts[1].name).toBe("Doc 2");
		expect(scripts[1].lines[0]).toMatchObject({
			type: "dialogue",
			content: "Bye",
		});
	});
});

describe("getScriptOverview", () => {
	it("should calculate correct overview for a simple script", () => {
		const lines: ParsedLine[] = [
			{ type: "marker", source: "Scene 1", id: "1" } as ParsedLine,
			{
				type: "dialogue",
				source: "00:01 Speaker: Hello World",
				id: "2",
				timestamp: "00:01",
				speakers: ["Speaker"],
				content: "Hello World",
				metadata: { wordCount: 2 },
			},
			{ type: "action", source: "Action", id: "3" } as ParsedLine,
			{ type: "invalid", source: "Invalid", id: "4" } as ParsedLine,
		];

		const overview = getScriptOverview(lines);

		expect(overview.totalLines).toBe(4);
		expect(overview.scenes).toEqual([0]);
		expect(overview.validLines).toEqual([1]);
		expect(overview.actionLines).toEqual([2]);
		expect(overview.invalidLines).toEqual([3]);
		expect(overview.wordCount).toBe(2);
	});

	it("should accumulate word count across multiple dialogue lines", () => {
		const lines: ParsedLine[] = [
			{
				type: "dialogue",
				source: "00:01 Speaker: Line 1",
				id: "1",
				metadata: { wordCount: 2 },
			} as ParsedLine,
			{
				type: "dialogue",
				source: "00:02 Speaker: Line 2 with more words",
				id: "2",
				metadata: { wordCount: 5 },
			} as ParsedLine,
		];

		const overview = getScriptOverview(lines);

		expect(overview.wordCount).toBe(7);
		expect(overview.validLines).toEqual([0, 1]);
	});

	it("should handle empty scripts", () => {
		const overview = getScriptOverview([]);

		expect(overview.totalLines).toBe(0);
		expect(overview.wordCount).toBe(0);
		expect(overview.scenes).toEqual([]);
		expect(overview.validLines).toEqual([]);
		expect(overview.actionLines).toEqual([]);
		expect(overview.invalidLines).toEqual([]);
	});

	it("should handle malformed lines as invalid", () => {
		const lines: ParsedLine[] = [
			{ type: "malformed", source: "Malformed", id: "1" } as ParsedLine,
		];

		const overview = getScriptOverview(lines);

		expect(overview.invalidLines).toEqual([0]);
	});
});
