import type { DocFile } from "../hooks/useFileUpload";
import type { Dialogue, ParsedLine, Script } from "@/types/Script";
import { generateHtmlFromScript } from "./formatParsedLines";
import { getScriptOverview } from "./scriptParser";

// Groups Time -> Speaker -> Colon -> Content
const MAIN_PATTERN = /^(\d{1,2}:\d{2})\s+([^:]+):\s*(.*)$/;
const TIMESTAMP_START_PATTERN = /^(\d{1,2}:\d{2})\s+(.+)$/;
const NOTES_PATTERN = /\((.*?)\)/g;
const SPLIT_PATTERN = /(?:,|\s+(?:and|&))\s+|\//;
const MARKER_PATTERN = /Scene|Scena|Blooper|Bloopers|Vlog|Vlogs/i;

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

		return {
			id: `${i}-${doc.name}`,
			name: doc.name,
			source: doc.document,
			lines: parsedLines,
			overview: getScriptOverview(parsedLines),
			html: generateHtmlFromScript(parsedLines),
		};
	});

	return parsedScripts;
};
