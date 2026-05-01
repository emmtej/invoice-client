import { describe, expect, it, vi } from "vitest";
import type { Script } from "@/types/Script";
import { boothMachine, initialBoothState } from "./useBoothMachine";

vi.mock("@/utils/id", () => ({
	generateId: () => "test-session-id",
}));

const mockScript: Script = {
	id: "test-script",
	name: "Test Script",
	lines: [
		{
			id: "1",
			type: "dialogue",
			content: "Line 1",
			speakers: ["A"],
			source: "A: Line 1",
			timestamp: "00:00",
			metadata: { wordCount: 2 },
		},
		{
			id: "2",
			type: "dialogue",
			content: "Line 2",
			speakers: ["B"],
			source: "B: Line 2",
			timestamp: "00:00",
			metadata: { wordCount: 2 },
		},
		{ id: "3", type: "marker", source: "Scene 2" },
		{
			id: "4",
			type: "dialogue",
			content: "Line 4",
			speakers: ["A"],
			source: "A: Line 4",
			timestamp: "00:00",
			metadata: { wordCount: 2 },
		},
	],
	overview: {
		wordCount: 6,
		validLines: [0, 1, 3],
		invalidLines: [],
		actionLines: [],
		scenes: [2],
		totalLines: 4,
	},
	html: "<p>Line 1</p><p>Line 2</p><h2>Scene 2</h2><p>Line 4</p>",
	createdAt: new Date(),
};

describe("boothMachine", () => {
	it("should initialize state when setting script", () => {
		const state = boothMachine.setScript(mockScript);
		expect(state.script).toEqual(mockScript);
		expect(state.status).toBe("selecting");
		expect(state.currentLineIndex).toBe(0);
	});

	it("should start a session", () => {
		const updates = boothMachine.startSession(mockScript);
		expect(updates.sessionId).toBe("test-session-id");
		expect(updates.status).toBe("running");
		expect(updates.currentLineIndex).toBe(0);
		expect(updates.startedAt).toBeDefined();
	});

	it("should complete a line and move to next", () => {
		const state = {
			...initialBoothState,
			script: mockScript,
			status: "running" as const,
			lineStartMs: Date.now() - 1000,
		};

		const result = boothMachine.completeLine(state, 0);
		expect(result.completedLineIndices).toContain(0);
		expect(result.currentLineIndex).toBe(1);
		expect(result.lineTimings).toBeDefined();
		expect(result.lineTimings?.[0].elapsedMs).toBeGreaterThanOrEqual(1000);
		expect(result.allDone).toBe(false);
	});

	it("should complete a scene", () => {
		const state = {
			...initialBoothState,
			script: mockScript,
			status: "running" as const,
			lineStartMs: Date.now() - 2000,
		};

		// Scene 2 starts at index 2.Dialogue line 4 is at index 3.
		const result = boothMachine.completeScene(state, 2);
		expect(result.completedLineIndices).toContain(3);
		expect(result.lineTimings).toBeDefined();
		expect(result.lineTimings?.[0].lineIndex).toBe(3);
		expect(result.allDone).toBe(false);
	});

	it("should mark as allDone when last line completed", () => {
		const state = {
			...initialBoothState,
			script: mockScript,
			status: "running" as const,
			completedLineIndices: [0, 1],
			lineTimings: [
				{ lineIndex: 0, elapsedMs: 500 },
				{ lineIndex: 1, elapsedMs: 500 },
			],
			lineStartMs: Date.now() - 1000,
		};

		const result = boothMachine.completeLine(state, 3);
		expect(result.allDone).toBe(true);
		expect(result.status).toBe("completed");
	});

	it("should pause and resume session", () => {
		expect(boothMachine.pauseSession().status).toBe("paused");
		const resume = boothMachine.resumeSession();
		expect(resume.status).toBe("running");
		expect(resume.lineStartMs).toBeDefined();
	});

	it("should restart session", () => {
		const state = {
			...initialBoothState,
			script: mockScript,
			elapsedMs: 5000,
		};

		const restart = boothMachine.restartSession(state, false);
		expect(restart.sessionId).toBe("test-session-id");
		expect(restart.status).toBe("running");
		expect(restart.elapsedMs).toBe(5000);
		expect(restart.completedLineIndices).toEqual([]);
	});
});
