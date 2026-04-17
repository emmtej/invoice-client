import type {
	Dialogue,
	ParsedLine,
	Script,
	ScriptOverview,
} from "@/types/Script";
import { generateId } from "@/utils/id";
import type { DocFile } from "../hooks/useFileUpload";
import { generateHtmlFromScript } from "./formatParsedLines";
import { parseHtmlToDocument } from "./parseHtmlToDocument";

const MAIN_PATTERN = /^(\d{1,2}(?::\d{1,2}){1,2})\s+([^:]+):\s*(.*)$/;
const TIMESTAMP_START_PATTERN = /^(\d{1,2}(?::\d{1,2}){1,2})\s+(.+)$/;
const NOTES_PATTERN = /\((.*?)\)/g;
const SPLIT_PATTERN = /(?:,|\s+(?:and|&))\s+|\//;
const MARKER_PATTERN = /^(?:Scene|Scena|Blooper|Bloopers|Vlog|Vlogs)\b/i;

const getWordCount = (text: string) =>
	text.trim().split(/\s+/).filter(Boolean).length;

export const documentLineParser = (line: string): ParsedLine | null => {
	if (!line || !line.trim()) return null;

	let cleanLine = line;
	let notes: string[] | undefined;

	if (line.indexOf("(") !== -1) {
		const extracted: string[] = [];
		cleanLine = line.replace(NOTES_PATTERN, (_, noteContent) => {
			extracted.push(noteContent.trim());
			return "";
		});
		if (extracted.length > 0) notes = extracted;
	}

	cleanLine = cleanLine.trim();
	if (!cleanLine) {
		return { type: "invalid", source: line };
	}

	const match = MAIN_PATTERN.exec(cleanLine);

	if (match) {
		const [, timestamp, speakerStr, rawContent] = match;
		const content = rawContent.trim();

		const speakers = speakerStr
			.split(SPLIT_PATTERN)
			.map((s) => s.trim())
			.filter((s) => s.length > 0);

		if (content === "") {
			if (notes && notes.length > 0) {
				return {
					type: "action",
					timestamp: timestamp,
					speakers: speakers,
					notes: notes,
					source: line,
				};
			}
			return {
				type: "malformed",
				source: line,
				message: "Line has a timestamp and speaker but no content.",
			};
		}

		const result: Dialogue = {
			type: "dialogue",
			timestamp,
			speakers,
			content,
			source: line,
			metadata: { wordCount: getWordCount(content) },
		};
		if (notes) result.notes = notes;
		return result;
	}

	const timestampMatch = TIMESTAMP_START_PATTERN.exec(cleanLine);

	if (timestampMatch) {
		if (!cleanLine.includes(":")) {
			return {
				type: "malformed",
				source: line,
				message:
					"Line has a timestamp but is missing a speaker colon separator (:)",
			};
		}
		return {
			type: "malformed",
			source: line,
			message:
				"Line has a timestamp and colon but failed to parse correctly. Check the format.",
		};
	}

	if (MARKER_PATTERN.test(cleanLine)) {
		return { type: "marker", source: line };
	}

	return { type: "invalid", source: line };
};

export const getScriptOverview = (lines: ParsedLine[]): ScriptOverview => {
	const overview: ScriptOverview = {
		validLines: [],
		invalidLines: [],
		actionLines: [],
		scenes: [],
		wordCount: 0,
		totalLines: 0,
	};

	return lines.reduce((acc, line, index) => {
		acc.totalLines++;
		switch (line.type) {
			case "action": {
				acc.actionLines.push(index);
				break;
			}
			case "dialogue": {
				acc.validLines.push(index);
				acc.wordCount += line.metadata.wordCount;
				break;
			}
			case "marker": {
				acc.scenes.push(index);
				break;
			}
			default:
				acc.invalidLines.push(index);
		}
		return acc;
	}, overview);
};

function parseLinesFromNodes(nodes: Iterable<Element>): ParsedLine[] {
	return Array.from(nodes)
		.flatMap((node) => {
			const text = (node.textContent ?? "").trim();
			if (!text) return [];
			return text
				.split("\n")
				.map((l) => l.trim())
				.filter(Boolean)
				.map((line) => documentLineParser(line));
		})
		.filter((line): line is ParsedLine => line !== null)
		.map((line) => ({ ...line, id: generateId() }));
}

export function reparseHtmlToScript(html: string): {
	lines: ParsedLine[];
	overview: ScriptOverview;
	html: string;
} {
	const doc = parseHtmlToDocument(html);
	const lines = parseLinesFromNodes(doc.body.querySelectorAll("p, h3"));
	return {
		lines,
		overview: getScriptOverview(lines),
		html: generateHtmlFromScript(lines),
	};
}

export async function processDocuments(
	documents: DocFile[],
): Promise<Script[]> {
	const scripts: Script[] = [];

	for (const doc of documents) {
		const lines = parseLinesFromNodes(
			doc.document.querySelectorAll(
				"p, h1, h2, h3, h4, h5, h6, blockquote, li, div",
			),
		);
		scripts.push({
			id: generateId(),
			name: doc.name,
			source: doc.document,
			lines,
			overview: getScriptOverview(lines),
			html: generateHtmlFromScript(lines),
			createdAt: new Date(),
		});

		// Yield to main thread to prevent blocking
		await new Promise((resolve) => setTimeout(resolve, 0));
	}

	return scripts;
}
