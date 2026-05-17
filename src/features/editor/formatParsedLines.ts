import type { ParsedLine } from "@/types/Script";

const escapeHtml = (text: string): string => {
	const map: Record<string, string> = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#039;",
	};
	return text.replace(/[&<>"']/g, (m) => map[m]);
};

export const generateHtmlFromScript = (lines: ParsedLine[]): string => {
	return lines
		.map((line) => {
			const source = escapeHtml(line.source);
			switch (line.type) {
				case "action":
					return `<p><mark>${source}</mark></p>`;
				case "dialogue":
					return `<p>${source}</p>`;
				case "marker":
					return `<p></p><h3>${source}</h3>`;
				case "malformed":
					return `<p><strong>${source}</strong></p>`;
				case "invalid":
					return `<p><s>${source}</s></p>`;
				default:
					// Fallback incase incorrect parse
					return `<p>${source}</p>`;
			}
		})
		.join("");
};
