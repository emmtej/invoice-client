import { describe, expect, it } from "vitest";
import type { ParsedLine } from "@/types/Script";
import { generateHtmlFromScript } from "./formatParsedLines";

describe("generateHtmlFromScript", () => {
	it("should generate HTML for action lines", () => {
		const lines: ParsedLine[] = [
			{ type: "action", source: "Action text", id: "1" } as ParsedLine,
		];
		const html = generateHtmlFromScript(lines);
		expect(html).toBe("<p><mark>Action text</mark></p>");
	});

	it("should generate HTML for dialogue lines", () => {
		const lines: ParsedLine[] = [
			{
				type: "dialogue",
				source: "Dialogue text",
				id: "1",
				timestamp: "00:00",
				speakers: ["Speaker"],
				content: "Dialogue text",
				metadata: { wordCount: 2 },
			},
		];
		const html = generateHtmlFromScript(lines);
		expect(html).toBe("<p>Dialogue text</p>");
	});

	it("should generate HTML for marker lines", () => {
		const lines: ParsedLine[] = [
			{ type: "marker", source: "Marker text", id: "1" } as ParsedLine,
		];
		const html = generateHtmlFromScript(lines);
		expect(html).toBe("<p></p><h3>Marker text</h3>");
	});

	it("should generate HTML for malformed lines", () => {
		const lines: ParsedLine[] = [
			{ type: "malformed", source: "Malformed text", id: "1" } as ParsedLine,
		];
		const html = generateHtmlFromScript(lines);
		expect(html).toBe("<p><strong>Malformed text</strong></p>");
	});

	it("should generate HTML for invalid lines", () => {
		const lines: ParsedLine[] = [
			{ type: "invalid", source: "Invalid text", id: "1" } as ParsedLine,
		];
		const html = generateHtmlFromScript(lines);
		expect(html).toBe("<p><s>Invalid text</s></p>");
	});

	it("should handle mixed line types", () => {
		const lines: ParsedLine[] = [
			{ type: "marker", source: "Scene 1", id: "1" } as ParsedLine,
			{
				type: "dialogue",
				source: "00:01 Speaker: Hello",
				id: "2",
				timestamp: "00:01",
				speakers: ["Speaker"],
				content: "Hello",
				metadata: { wordCount: 1 },
			},
			{ type: "action", source: "Slamming door", id: "3" } as ParsedLine,
		];
		const html = generateHtmlFromScript(lines);
		expect(html).toBe(
			"<p></p><h3>Scene 1</h3><p>00:01 Speaker: Hello</p><p><mark>Slamming door</mark></p>",
		);
	});

	it("should use fallback for unknown types", () => {
		const lines = [
			{
				type: "unknown",
				source: "Unknown text",
				id: "1",
			} as unknown as ParsedLine,
		];
		const html = generateHtmlFromScript(lines);
		expect(html).toBe("<p>Unknown text</p>");
	});

	it("should handle empty lines array", () => {
		const html = generateHtmlFromScript([]);
		expect(html).toBe("");
	});
});
