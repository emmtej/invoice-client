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
import { getScriptOverview } from "./scriptParser";

// Groups Time (H:MM:SS or MM:SS) -> Speaker -> Colon -> Content
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
		// If line only contained notes, it might be an action, but without a timestamp/speaker context here,
		// we check if we should return it as action or if it's just invalid.
		// Usually, standalone notes in parentheses are markers or actions.
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

export function reparseHtmlToScript(html: string): {
	lines: ParsedLine[];
	overview: ScriptOverview;
	html: string;
} {
	const doc = parseHtmlToDocument(html);
	const nodes = Array.from(doc.body.querySelectorAll("p, h3"));
	const lines = nodes
		.flatMap((node) => {
			const text = (node.textContent ?? "").trim();
			if (!text) return [];
			return text
				.split("\n")
				.map((l) => l.trim())
				.filter(Boolean)
				.map((line) => documentLineParser(line));
		})
		.filter((line): line is ParsedLine => line !== null);

	const linesWithId = lines.map((line) => ({
		...line,
		id: generateId(),
	}));
	const overview = getScriptOverview(linesWithId);
	const generatedHtml = generateHtmlFromScript(linesWithId);
	return { lines: linesWithId, overview, html: generatedHtml };
}

export function processDocuments(documents: DocFile[]): Script[] {
	const parsedScripts: Script[] = documents.map((doc) => {
		const paragraphs = Array.from(
			doc.document.querySelectorAll(
				"p, h1, h2, h3, h4, h5, h6, blockquote, li, div",
			),
		);

		const parsedLines = paragraphs
			.flatMap((p) =>
				(p.textContent ?? "")
					.split("\n")
					.map((line) => line.trim())
					.filter((line) => line.length > 0)
					.map((line) => documentLineParser(line)),
			)
			.filter((line): line is ParsedLine => line !== null);

		const linesWithId: ParsedLine[] = parsedLines.map((line) => ({
			...line,
			id: generateId(),
		}));

		return {
			id: generateId(),
			name: doc.name,
			source: doc.document,
			lines: linesWithId,
			overview: getScriptOverview(linesWithId),
			html: generateHtmlFromScript(linesWithId),
		};
	});

	return parsedScripts;
}
