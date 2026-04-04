import { describe, expect, it } from "vitest";
import type { ParsedLine } from "@/types/Script";
import { getScriptOverview } from "./scriptParser";

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
