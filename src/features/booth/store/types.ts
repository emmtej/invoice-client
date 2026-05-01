import type { LineTimingEntry } from "@/features/storage/types";
import type { Script } from "@/types/Script";
import type { BoothSession } from "./boothQueries";

export type BoothStatus =
	| "idle"
	| "selecting"
	| "running"
	| "paused"
	| "completed";

export interface BoothState {
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
	isEditorOpened: boolean;
}

export interface BoothActions {
	setScript: (script: Script) => void;
	updateScript: (script: Script) => void;
	restoreSession: (script: Script, session: BoothSession) => void;
	startSession: () => Promise<void>;
	pauseSession: () => void;
	resumeSession: () => void;
	stopSession: () => Promise<void>;
	completeLine: (lineIndex: number) => Promise<void>;
	completeScene: (markerIndex: number) => Promise<void>;
	editLine: (lineIndex: number, content: string) => Promise<void>;
	resetSession: () => void;
	restartSession: (resetTimer?: boolean) => Promise<void>;
	setStatus: (status: BoothStatus) => void;
	tick: (nowMs: number) => void;

	loadSessions: () => Promise<void>;
	deleteSessionRecord: (id: string) => Promise<void>;
	setEditorOpened: (opened: boolean) => void;

	// Helpers (to be moved to selectors but kept in interface for now if needed, or removed)
	getLineContent: (lineIndex: number) => string;
	isSelectionMode: () => boolean;
	isSessionMode: () => boolean;
}

export type BoothStore = BoothState & BoothActions;
