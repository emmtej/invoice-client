import { create } from "zustand";
import {
	documentLineParser,
	getScriptOverview,
} from "@/features/editor/utils/documentParser";
import { generateHtmlFromScript } from "@/features/editor/utils/formatParsedLines";
import { scriptsQueries } from "@/features/scripts/store/scriptsQueries";
import type { LineTimingEntry } from "@/features/storage/types";
import type { Script } from "@/types/Script";
import { generateId } from "@/utils/id";
import { type BoothSession, boothQueries } from "./boothQueries";

type BoothStatus = "idle" | "selecting" | "running" | "paused" | "completed";

interface BoothState {
	script: Script | null;
	editedLines: Record<number, string>;

	sessionId: string | null;
	status: BoothStatus;
	completedLineIndices: number[];
	currentLineIndex: number;

	elapsedMs: number;
	lineStartMs: number;
	lineTimings: LineTimingEntry[];
	startedAt: string | null;

	sessions: BoothSession[];
	isLoadingSessions: boolean;
}

interface BoothActions {
	setScript: (script: Script) => void;
	updateScript: (script: Script) => void;
	restoreSession: (script: Script, session: BoothSession) => void;
	startSession: () => Promise<void>;
	pauseSession: () => void;
	resumeSession: () => void;
	stopSession: () => Promise<void>;
	completeLine: (lineIndex: number) => Promise<void>;
	editLine: (lineIndex: number, content: string) => Promise<void>;
	resetSession: () => void;
	restartSession: () => Promise<void>;
	setStatus: (status: BoothStatus) => void;
	tick: (nowMs: number) => void;

	loadSessions: () => Promise<void>;
	deleteSessionRecord: (id: string) => Promise<void>;

	// Helpers
	getLineContent: (lineIndex: number) => string;
	isSelectionMode: () => boolean;
	isSessionMode: () => boolean;
}

export type BoothStore = BoothState & BoothActions;

function getReadableLineCount(script: Script): number {
	return script.lines.filter(
		(l) => l.type === "dialogue" || l.type === "action",
	).length;
}

function findNextUncompletedLine(script: Script, completed: number[]): number {
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
}

export const useBoothStore = create<BoothStore>()((set, get) => ({
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

	setScript: (script) => {
		const firstLine = findNextUncompletedLine(script, []);
		set({
			script,
			editedLines: {},
			completedLineIndices: [],
			currentLineIndex: firstLine >= 0 ? firstLine : 0,
			lineTimings: [],
			elapsedMs: 0,
			status: "selecting",
		});
	},

	updateScript: (script) => {
		set({
			script,
			editedLines: {},
		});
	},

	restoreSession: (script, session) => {
		const completedLineIndices = session.lineTimings.map(
			(timing) => timing.lineIndex,
		);
		const nextLine = findNextUncompletedLine(script, completedLineIndices);

		set({
			script,
			sessionId: session.id,
			status: session.status === "in_progress" ? "paused" : "completed",
			completedLineIndices,
			currentLineIndex: nextLine >= 0 ? nextLine : 0,
			elapsedMs: session.elapsedMs,
			lineStartMs: Date.now(),
			lineTimings: session.lineTimings,
			editedLines: {},
		});
	},

	startSession: async () => {
		const { script } = get();
		if (!script) return;

		const sessionId = generateId();
		const totalLines = getReadableLineCount(script);
		const firstLine = findNextUncompletedLine(script, []);
		const startedAt = new Date().toISOString();

		await boothQueries.createSession({
			id: sessionId,
			scriptId: script.id,
			scriptName: script.name,
			totalLines,
		});

		set({
			sessionId,
			status: "running",
			elapsedMs: 0,
			lineStartMs: Date.now(),
			lineTimings: [],
			completedLineIndices: [],
			currentLineIndex: firstLine >= 0 ? firstLine : 0,
			startedAt,
		});
	},

	pauseSession: () => {
		set({ status: "paused" });
	},

	resumeSession: () => {
		set({
			status: "running",
			lineStartMs: Date.now(),
		});
	},

	stopSession: async () => {
		const { sessionId, completedLineIndices, elapsedMs, lineTimings } = get();
		if (!sessionId) return;

		await boothQueries.completeSession(sessionId, {
			completedLines: completedLineIndices.length,
			elapsedMs,
			lineTimings,
		});

		set({ status: "completed" });
		await get().loadSessions();
	},

	completeLine: async (lineIndex) => {
		const state = get();
		if (state.status !== "running" || !state.script) return;

		const alreadyCompleted = state.completedLineIndices.includes(lineIndex);
		if (alreadyCompleted) return;

		const lineElapsed = Date.now() - state.lineStartMs;
		const newTimings = [
			...state.lineTimings,
			{ lineIndex, elapsedMs: lineElapsed },
		];
		const newCompleted = [...state.completedLineIndices, lineIndex];
		const nextLine = findNextUncompletedLine(state.script, newCompleted);
		const totalReadable = getReadableLineCount(state.script);
		const allDone = newCompleted.length >= totalReadable;

		set({
			completedLineIndices: newCompleted,
			lineTimings: newTimings,
			currentLineIndex: nextLine >= 0 ? nextLine : state.currentLineIndex,
			lineStartMs: Date.now(),
		});

		if (allDone) {
			const finalElapsed = get().elapsedMs;
			if (state.sessionId) {
				await boothQueries.completeSession(state.sessionId, {
					completedLines: newCompleted.length,
					elapsedMs: finalElapsed,
					lineTimings: newTimings,
				});
			}
			set({ status: "completed" });
			await get().loadSessions();
		} else if (state.sessionId) {
			await boothQueries.updateSession(state.sessionId, {
				completedLines: newCompleted.length,
				elapsedMs: get().elapsedMs,
				lineTimings: newTimings,
			});
		}
	},

	editLine: async (lineIndex, content) => {
		const { script } = get();
		if (!script) return;

		// 1. Parse the new content
		const newLine = documentLineParser(content);
		if (!newLine) return;

		// Preserve original ID if it exists
		const originalId = script.lines[lineIndex]?.id;
		if (originalId) newLine.id = originalId;

		// 2. Clone and update lines
		const newLines = [...script.lines];
		newLines[lineIndex] = newLine;

		// 3. Recalculate overview and HTML
		const newOverview = getScriptOverview(newLines);
		const newHtml = generateHtmlFromScript(newLines);

		// 4. Update script object
		const updatedScript: Script = {
			...script,
			lines: newLines,
			overview: newOverview,
			html: newHtml,
		};

		// 5. Persist to database
		await scriptsQueries.saveScript(updatedScript);

		// 6. Update store
		set((s) => ({
			script: updatedScript,
			editedLines: { ...s.editedLines, [lineIndex]: content },
		}));
	},

	resetSession: () => {
		set({
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
		});
	},

	restartSession: async () => {
		const { script, sessionId } = get();
		if (!script || !sessionId) return;

		// Abandon current session in DB
		await boothQueries.abandonSession(sessionId);

		// Start a fresh one with same script
		const newSessionId = generateId();
		const totalLines = getReadableLineCount(script);
		const firstLine = findNextUncompletedLine(script, []);
		const startedAt = new Date().toISOString();

		await boothQueries.createSession({
			id: newSessionId,
			scriptId: script.id,
			scriptName: script.name,
			totalLines,
		});

		set({
			sessionId: newSessionId,
			status: "running",
			elapsedMs: 0,
			lineStartMs: Date.now(),
			lineTimings: [],
			completedLineIndices: [],
			currentLineIndex: firstLine >= 0 ? firstLine : 0,
			startedAt,
		});
	},

	setStatus: (status) => set({ status }),

	tick: (nowMs) => {
		if (get().status !== "running") return;
		set({ elapsedMs: nowMs });
	},

	loadSessions: async () => {
		set({ isLoadingSessions: true });
		try {
			await boothQueries.init();
			const sessions = await boothQueries.getAllSessions();
			set({ sessions, isLoadingSessions: false });
		} catch {
			set({ isLoadingSessions: false });
		}
	},

	deleteSessionRecord: async (id) => {
		await boothQueries.deleteSession(id);
		set((s) => ({
			sessions: s.sessions.filter((sess) => sess.id !== id),
		}));
	},

	getLineContent: (lineIndex) => {
		const { script, editedLines } = get();
		if (!script || lineIndex < 0 || lineIndex >= script.lines.length) return "";

		if (editedLines[lineIndex] !== undefined) {
			return editedLines[lineIndex];
		}

		return script.lines[lineIndex].source;
	},

	isSelectionMode: () => {
		const status = get().status;
		return status === "idle" || status === "selecting";
	},

	isSessionMode: () => {
		const status = get().status;
		return (
			status === "running" || status === "paused" || status === "completed"
		);
	},
}));
