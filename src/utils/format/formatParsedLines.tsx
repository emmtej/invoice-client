import type { ParsedLine } from "../parsers/documentParser";

export const generateHtmlFromScript = (lines: ParsedLine[]): string => {
	return lines
		.map((line) => {
			switch (line.type) {
				case "action":
					return `<p><mark>${line.source}</mark></p>`;
				case "dialogue":
					return `<p>${line.source}</p>`;
				case "marker":
					return `<p></p><h3>${line.source}</h3>`;
				case "malformed":
					return `<p><strong>${line.source}</strong></p>`;
				case "invalid":
					return `<p><s>${line.source}</s></p>`;
				default:
					// Fallback incase incorrect parse
					return `<p>${(line as any).source || ""}</p>`;
			}
		})
		.join("");
};
