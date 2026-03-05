import type {
	Dialogue,
	ParsedLine,
	Script,
	ScriptOverview,
} from "@/types/Script";
import type { DocFile } from "../hooks/useFileUpload";
import { generateHtmlFromScript } from "./formatParsedLines";
import { getScriptOverview } from "./scriptParser";
import { xmlParser } from "./xmlParser";

// Groups Time -> Speaker -> Colon -> Content
const MAIN_PATTERN = /^(\d{1,2}:\d{2})\s+([^:]+):\s*(.*)$/;
const TIMESTAMP_START_PATTERN = /^(\d{1,2}:\d{2})\s+(.+)$/;
const NOTES_PATTERN = /\((.*?)\)/g;
const SPLIT_PATTERN = /(?:,|\s+(?:and|&))\s+|\//;
const MARKER_PATTERN = /Scene|Scena|Blooper|Bloopers|Vlog|Vlogs/i;

const getWordCount = (text: string) =>
	text.trim().split(/\s+/).filter(Boolean).length;

export const documentLineParser = (line: string): ParsedLine => {
	if (!line) return { type: "invalid", source: "" };

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
	if (!cleanLine) return { type: "invalid", source: line };

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
			} else {
				return {
					type: "invalid",
					source: line,
				};
			}
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
			console.log("MISSING COLON: " + line);
			return {
				type: "malformed",
				source: line,
				message: "Line has a timestamp but is missing a colon separator (:)",
			};
		}
		console.trace(line);
		console.error("SOMETHING WENT WRONG");
	}

	if (MARKER_PATTERN.test(line)) {
		return { type: "marker", source: line };
	}

	return { type: "invalid", source: line };
};

export function reparseHtmlToScript(html: string): {
	lines: ParsedLine[];
	overview: ScriptOverview;
	html: string;
} {
	const doc = xmlParser(html);
	const nodes = Array.from(doc.body.querySelectorAll("p, h3"));
	const lines = nodes.flatMap((node) => {
		const text = (node.textContent ?? "").trim();
		if (!text) return [];
		return text
			.split("\n")
			.map((l) => l.trim())
			.filter(Boolean)
			.map((line) => documentLineParser(line));
	});
	const linesWithId = lines.map((line, idx) => ({
		...line,
		id: `line-${idx}`,
	}));
	const overview = getScriptOverview(linesWithId);
	const generatedHtml = generateHtmlFromScript(linesWithId);
	return { lines: linesWithId, overview, html: generatedHtml };
}

export const processDocuments = async (
	documents: DocFile[],
): Promise<Script[]> => {
	const parsedScripts: Script[] = documents.map((doc, i) => {
		const paragraphs = Array.from(doc.document.querySelectorAll("p"));

		const parsedLines = paragraphs.flatMap((p) =>
			(p.textContent ?? "")
				.split("\n")
				.map((line) => line.trim())
				.filter((line) => line.length > 0)
				.map((line) => documentLineParser(line)),
		);

		const linesWithId: ParsedLine[] = parsedLines.map((line, idx) => ({
			...line,
			id: `${i}-${doc.name}-line-${idx}`,
		}));

		return {
			id: `${i}-${doc.name}`,
			name: doc.name,
			source: doc.document,
			lines: linesWithId,
			overview: getScriptOverview(linesWithId),
			html: generateHtmlFromScript(linesWithId),
		};
	});

	return parsedScripts;
};
