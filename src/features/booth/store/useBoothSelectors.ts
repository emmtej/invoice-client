import type { Script } from "@/types/Script";
import type { BoothStatus } from "./types";

export const getReadableLineCount = (script: Script): number => {
	return script.lines.filter(
		(l) => l.type === "dialogue" || l.type === "action",
	).length;
};

export const findNextUncompletedLine = (
	script: Script,
	completed: number[],
): number => {
	const completedSet = new Set(completed);
	for (let i = 0; i < script.lines.length; i++) {
		const line = script.lines[i];
		if (
			(line.type === "dialogue" || line.type === "action") &&
			!completedSet.has(i)
		) {
			return i;
		}
	}
	return -1;
};

export const getProgress = (
	completedLineIndices: number[],
	script: Script | null,
): number => {
	if (!script) return 0;
	const total = getReadableLineCount(script);
	if (total === 0) return 0;
	return Math.round((completedLineIndices.length / total) * 100);
};

export const getLineContent = (
	script: Script | null,
	editedLines: Record<number, string>,
	lineIndex: number,
): string => {
	if (!script || lineIndex < 0 || lineIndex >= script.lines.length) return "";

	if (editedLines[lineIndex] !== undefined) {
		return editedLines[lineIndex];
	}

	return script.lines[lineIndex].source;
};

export const isSelectionMode = (status: BoothStatus): boolean => {
	return status === "idle" || status === "selecting";
};

export const isSessionMode = (status: BoothStatus): boolean => {
	return status === "running" || status === "paused" || status === "completed";
};
