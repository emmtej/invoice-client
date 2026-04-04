/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from "vitest";
import { xmlParser } from "./xmlParser";

describe("xmlParser", () => {
	it("should parse a valid HTML string into a Document", () => {
		const html = "<div><p>Hello World</p></div>";
		const doc = xmlParser(html);

		expect(doc).toBeInstanceOf(Document);
		expect(doc.body.innerHTML).toContain("<p>Hello World</p>");
		expect(doc.querySelector("p")?.textContent).toBe("Hello World");
	});

	it("should handle empty strings", () => {
		const doc = xmlParser("");
		expect(doc).toBeInstanceOf(Document);
		expect(doc.body.innerHTML).toBe("");
	});

	it("should parse multiple elements", () => {
		const html = "<h3>Title</h3><p>Content</p>";
		const doc = xmlParser(html);

		expect(doc.querySelectorAll("h3")).toHaveLength(1);
		expect(doc.querySelectorAll("p")).toHaveLength(1);
		expect(doc.querySelector("h3")?.textContent).toBe("Title");
		expect(doc.querySelector("p")?.textContent).toBe("Content");
	});
});
