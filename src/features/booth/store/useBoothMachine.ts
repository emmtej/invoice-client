import {
	documentLineParser,
	getScriptOverview,
} from "@/features/editor/utils/documentParser";
import { generateHtmlFromScript } from "@/features/editor/utils/formatParsedLines";
import type { LineTimingEntry } from "@/features/storage/types";
import type { Script } from "@/types/Script";
import { generateId } from "@/utils/id";
import type { BoothSession } from "./boothQueries";
import type { BoothState, BoothStatus } from "./types";
import {
	findNextUncompletedLine,
	getReadableLineCount,
} from "./useBoothSelectors";

export const initialBoothState: BoothState = {
	script: null,
	editedLines: {},
	sessionId: null,
	status: "idle",
	completedLineIndices: [],
	currentLineIndex: 0,
	elapsedMs: 0,
	lineStartMs: 0,
	lineTimings: [],
	startedAt: null,
	sessions: [],
	isLoadingSessions: false,
	isEditorOpened: false,
};

export const boothMachine = {
	setScript: (script: Script): Partial<BoothState> => {
		const firstLine = findNextUncompletedLine(script, []);
		return {
			script,
			editedLines: {},
			completedLineIndices: [],
			currentLineIndex: firstLine >= 0 ? firstLine : 0,
			lineTimings: [],
			elapsedMs: 0,
			status: "selecting",
		};
	},

	updateScript: (script: Script): Partial<BoothState> => ({
		script,
		editedLines: {},
	}),

	restoreSession: (
		script: Script,
		session: BoothSession,
	): Partial<BoothState> => {
		const completedLineIndices = session.lineTimings.map(
			(timing: LineTimingEntry) => timing.lineIndex,
		);
		const nextLine = findNextUncompletedLine(script, completedLineIndices);

		return {
			script,
			sessionId: session.id,
			status: session.status === "in_progress" ? "paused" : "completed",
			completedLineIndices,
			currentLineIndex: nextLine >= 0 ? nextLine : 0,
			elapsedMs: session.elapsedMs,
			lineStartMs: Date.now(),
			lineTimings: session.lineTimings,
			editedLines: {},
		};
	},

	startSession: (script: Script): Partial<BoothState> => {
		const sessionId = generateId();
		const firstLine = findNextUncompletedLine(script, []);
		const startedAt = new Date().toISOString();

		return {
			sessionId,
			status: "running",
			elapsedMs: 0,
			lineStartMs: Date.now(),
			lineTimings: [],
			completedLineIndices: [],
			currentLineIndex: firstLine >= 0 ? firstLine : 0,
			startedAt,
		};
	},

	pauseSession: (): Partial<BoothState> => ({ status: "paused" }),

	resumeSession: (): Partial<BoothState> => ({
		status: "running",
		lineStartMs: Date.now(),
	}),

	stopSession: (
		state: BoothState,
	): { nextStatus: BoothStatus; updates: Partial<BoothState> } => {
		const { script, completedLineIndices } = state;
		if (!script) return { nextStatus: "idle", updates: {} };

		const totalReadable = getReadableLineCount(script);
		const allDone = completedLineIndices.length >= totalReadable;

		if (allDone) {
			return { nextStatus: "completed", updates: { status: "completed" } };
		}
		return {
			nextStatus: "idle",
			updates: {
				status: "idle",
				script: null,
				sessionId: null,
			},
		};
	},

	completeLine: (
		state: BoothState,
		lineIndex: number,
	): Partial<BoothState> & { allDone: boolean } => {
		if (state.status !== "running" || !state.script) return { allDone: false };

		const alreadyCompleted = state.completedLineIndices.includes(lineIndex);
		if (alreadyCompleted) return { allDone: false };

		const lineElapsed = Date.now() - state.lineStartMs;
		const newTimings = [
			...state.lineTimings,
			{ lineIndex, elapsedMs: lineElapsed },
		];
		const newCompleted = [...state.completedLineIndices, lineIndex];
		const nextLine = findNextUncompletedLine(state.script, newCompleted);
		const totalReadable = getReadableLineCount(state.script);
		const allDone = newCompleted.length >= totalReadable;

		return {
			completedLineIndices: newCompleted,
			lineTimings: newTimings,
			currentLineIndex: nextLine >= 0 ? nextLine : state.currentLineIndex,
			lineStartMs: Date.now(),
			allDone,
			status: allDone ? "completed" : state.status,
		};
	},

	completeScene: (
		state: BoothState,
		markerIndex: number,
	): Partial<BoothState> & { allDone: boolean } => {
		if (state.status !== "running" || !state.script) return { allDone: false };

		const lineIndicesInScene: number[] = [];
		for (let i = markerIndex + 1; i < state.script.lines.length; i++) {
			const line = state.script.lines[i];
			if (line.type === "marker") break;
			if (line.type === "dialogue" || line.type === "action") {
				if (!state.completedLineIndices.includes(i)) {
					lineIndicesInScene.push(i);
				}
			}
		}

		if (lineIndicesInScene.length === 0) return { allDone: false };

		const totalElapsedSinceStart = Date.now() - state.lineStartMs;
		const perLineElapsed = Math.floor(
			totalElapsedSinceStart / lineIndicesInScene.length,
		);

		const newTimings = [...state.lineTimings];
		const newCompleted = [...state.completedLineIndices];

		for (const idx of lineIndicesInScene) {
			newTimings.push({ lineIndex: idx, elapsedMs: perLineElapsed });
			newCompleted.push(idx);
		}

		const nextLine = findNextUncompletedLine(state.script, newCompleted);
		const totalReadable = getReadableLineCount(state.script);
		const allDone = newCompleted.length >= totalReadable;

		return {
			completedLineIndices: newCompleted,
			lineTimings: newTimings,
			currentLineIndex: nextLine >= 0 ? nextLine : state.currentLineIndex,
			lineStartMs: Date.now(),
			allDone,
			status: allDone ? "completed" : state.status,
		};
	},

	editLine: (
		script: Script,
		lineIndex: number,
		content: string,
	): { updatedScript: Script | null } => {
		const newLine = documentLineParser(content);
		if (!newLine) return { updatedScript: null };

		const originalId = script.lines[lineIndex]?.id;
		if (originalId) newLine.id = originalId;

		const newLines = [...script.lines];
		newLines[lineIndex] = newLine;

		const updatedScript: Script = {
			...script,
			lines: newLines,
			overview: getScriptOverview(newLines),
			html: generateHtmlFromScript(newLines),
		};

		return { updatedScript };
	},

	restartSession: (
		state: BoothState,
		resetTimer = true,
	): Partial<BoothState> => {
		const { script, elapsedMs } = state;
		if (!script) return {};

		const newSessionId = generateId();
		const firstLine = findNextUncompletedLine(script, []);
		const startedAt = new Date().toISOString();

		return {
			sessionId: newSessionId,
			status: "running",
			elapsedMs: resetTimer ? 0 : elapsedMs,
			lineStartMs: Date.now(),
			lineTimings: [],
			completedLineIndices: [],
			currentLineIndex: firstLine >= 0 ? firstLine : 0,
			startedAt,
		};
	},

	resetSession: (): BoothState => initialBoothState,
};
