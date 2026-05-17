/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from "vitest";
import { reparseHtmlToScript } from "./documentParser";
import { PARSER_FIXTURES } from "./documentParser.fixtures";

describe("documentParser Golden Tests", () => {
	it("should correctly parse the simple fixture", () => {
		const fixture = PARSER_FIXTURES.simple;
		const result = reparseHtmlToScript(fixture.html);

		expect(result.lines).toHaveLength(fixture.expectedLines);
		expect(result.overview.wordCount).toBe(fixture.expectedWords);
		expect(result.lines[0].type).toBe("marker");
		expect(result.lines[1].type).toBe("dialogue");
	});

	it("should correctly parse the complex fixture", () => {
		const fixture = PARSER_FIXTURES.complex;
		const result = reparseHtmlToScript(fixture.html);

		expect(result.lines).toHaveLength(fixture.expectedLines);

		// Word Count Verification:
		// 1. "Combined speakers" (2)
		// 2. "Quiet notes" (2)
		// 3. "(Coughing)" (0) -> action line
		// 4. "Invalid line without timestamp" (0) -> invalid line
		// 5. "H:MM:SS format" (2) -> wait, "H:MM:SS format" is 2 words? No, it's 2.
		// Let's check "H:MM:SS format" again.
		// "H:MM:SS" is one chunk if split by whitespace. "format" is another. Total = 2.
		// "Combined speakers" = 2.
		// "Quiet notes" = 2.
		// 2 + 2 + 2 = 6. Correct.
		expect(result.overview.wordCount).toBe(6);

		const types = result.lines.map((l) => l.type);
		expect(types).toEqual([
			"marker",
			"dialogue",
			"dialogue",
			"action",
			"invalid",
			"marker",
			"dialogue",
		]);
	});

	it("should handle edge cases in the edgeCases fixture", () => {
		const fixture = PARSER_FIXTURES.edgeCases;
		const result = reparseHtmlToScript(fixture.html);

		// 1. <p> </p> -> filtered (length 0)
		// 2. 00:01 Speaker: -> malformed (no content)
		// 3. SCENE -> marker
		// 4. 00:01:01:01 Too many segments: Content -> invalid (Regex mismatch on timestamp segments)
		expect(result.lines).toHaveLength(3);
		expect(result.lines[0].type).toBe("malformed");
		expect(result.lines[1].type).toBe("marker");
		expect(result.lines[2].type).toBe("invalid");
	});
});
