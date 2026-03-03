import type { ParsedLine, ScriptOverview } from "@/types/Script";

export const getScriptOverview = (lines: ParsedLine[]): ScriptOverview => {
	const overview: ScriptOverview = {
		validLines: [],
		invalidLines: [],
		actionLines: [],
		scenes: [],
		wordCount: 0,
		totalLines: 0,
	};

	return lines.reduce((overview, line, index) => {
		overview.totalLines++;
		switch (line.type) {
			case "action": {
				overview.actionLines.push(index);
				break;
			}
			case "dialogue": {
				overview.validLines.push(index);
				overview.wordCount += line.metadata.wordCount;
				break;
			}
			case "marker": {
				overview.scenes.push(index);
				break;
			}
			default:
				overview.invalidLines.push(index);
		}

		return overview;
	}, overview);
};
