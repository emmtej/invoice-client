import { create } from "zustand";
import { scriptsQueries } from "@/features/scripts/store/scriptsQueries";
import { boothQueries } from "./boothQueries";
import type { BoothStore } from "./types";
import { boothMachine, initialBoothState } from "./useBoothMachine";
import {
	getLineContent,
	getReadableLineCount,
	isSelectionMode,
	isSessionMode,
} from "./useBoothSelectors";

export const useBoothStore = create<BoothStore>()((set, get) => ({
	...initialBoothState,

	setScript: (script) => set(boothMachine.setScript(script)),

	updateScript: (script) => set(boothMachine.updateScript(script)),

	restoreSession: (script, session) =>
		set(boothMachine.restoreSession(script, session)),

	startSession: async () => {
		const { script } = get();
		if (!script) return;

		const updates = boothMachine.startSession(script);
		if (!updates.sessionId) return;
		await boothQueries.createSession({
			id: updates.sessionId,
			scriptId: script.id,
			scriptName: script.name,
			totalLines: getReadableLineCount(script),
		});

		set(updates);
	},

	pauseSession: () => set(boothMachine.pauseSession()),

	resumeSession: () => set(boothMachine.resumeSession()),

	stopSession: async () => {
		const state = get();
		const { sessionId, script, completedLineIndices, elapsedMs, lineTimings } =
			state;
		if (!sessionId || !script) return;

		const { nextStatus, updates } = boothMachine.stopSession(state);

		if (nextStatus === "completed") {
			await boothQueries.completeSession(sessionId, {
				completedLines: completedLineIndices.length,
				elapsedMs,
				lineTimings,
			});
		} else {
			await boothQueries.updateSession(sessionId, {
				completedLines: completedLineIndices.length,
				elapsedMs,
				lineTimings,
			});
		}

		set(updates);
		await get().loadSessions();
	},

	completeLine: async (lineIndex) => {
		const state = get();
		const updates = boothMachine.completeLine(state, lineIndex);

		if (Object.keys(updates).length === 1 && "allDone" in updates) return;

		set(updates);

		const { sessionId, completedLineIndices, elapsedMs, lineTimings } = get();
		if (!sessionId) return;

		if (updates.allDone) {
			await boothQueries.completeSession(sessionId, {
				completedLines: completedLineIndices.length,
				elapsedMs,
				lineTimings,
			});
			await get().loadSessions();
		} else {
			await boothQueries.updateSession(sessionId, {
				completedLines: completedLineIndices.length,
				elapsedMs,
				lineTimings,
			});
		}
	},

	completeScene: async (markerIndex) => {
		const state = get();
		const updates = boothMachine.completeScene(state, markerIndex);

		if (Object.keys(updates).length === 1 && "allDone" in updates) return;

		set(updates);

		const { sessionId, completedLineIndices, elapsedMs, lineTimings } = get();
		if (!sessionId) return;

		if (updates.allDone) {
			await boothQueries.completeSession(sessionId, {
				completedLines: completedLineIndices.length,
				elapsedMs,
				lineTimings,
			});
			await get().loadSessions();
		} else {
			await boothQueries.updateSession(sessionId, {
				completedLines: completedLineIndices.length,
				elapsedMs,
				lineTimings,
			});
		}
	},

	editLine: async (lineIndex, content) => {
		const { script } = get();
		if (!script) return;

		const { updatedScript } = boothMachine.editLine(script, lineIndex, content);
		if (!updatedScript) return;

		await scriptsQueries.saveScript(updatedScript);

		set((s) => ({
			script: updatedScript,
			editedLines: { ...s.editedLines, [lineIndex]: content },
		}));
	},

	resetSession: () => set(boothMachine.resetSession()),

	restartSession: async (resetTimer = true) => {
		const state = get();
		const { sessionId, script } = state;
		if (!script || !sessionId) return;

		await boothQueries.abandonSession(sessionId);

		const updates = boothMachine.restartSession(state, resetTimer);
		if (!updates.sessionId) return;
		await boothQueries.createSession({
			id: updates.sessionId,
			scriptId: script.id,
			scriptName: script.name,
			totalLines: getReadableLineCount(script),
		});

		set(updates);
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

	setEditorOpened: (opened) => set({ isEditorOpened: opened }),

	// Helpers (proxies to selectors)
	getLineContent: (lineIndex) => {
		const { script, editedLines } = get();
		return getLineContent(script, editedLines, lineIndex);
	},

	isSelectionMode: () => isSelectionMode(get().status),

	isSessionMode: () => isSessionMode(get().status),
}));
