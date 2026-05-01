import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Script } from "@/types/Script";
import { useBoothStore } from "./useBoothStore";

vi.mock("./boothQueries", () => ({
	boothQueries: {
		init: vi.fn().mockResolvedValue(undefined),
		createSession: vi.fn().mockResolvedValue(undefined),
		updateSession: vi.fn().mockResolvedValue(undefined),
		completeSession: vi.fn().mockResolvedValue(undefined),
		abandonSession: vi.fn().mockResolvedValue(undefined),
		getAllSessions: vi.fn().mockResolvedValue([]),
		deleteSession: vi.fn().mockResolvedValue(undefined),
	},
}));

vi.mock("@/features/scripts/store/scriptsQueries", () => ({
	scriptsQueries: {
		getScriptById: vi.fn().mockResolvedValue(null),
		touchScript: vi.fn().mockResolvedValue(undefined),
	},
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
	],
	overview: {
		wordCount: 4,
		validLines: [0, 1],
		invalidLines: [],
		actionLines: [],
		scenes: [],
		totalLines: 2,
	},
	html: "<p>Line 1</p><p>Line 2</p>",
	createdAt: new Date(),
};

describe("useBoothStore", () => {
	it("should set script and start session", async () => {
		const { result } = renderHook(() => useBoothStore());

		act(() => {
			result.current.setScript(mockScript);
		});

		expect(result.current.script).toEqual(mockScript);
		expect(result.current.status).toBe("selecting");

		await act(async () => {
			await result.current.startSession();
		});

		expect(result.current.status).toBe("running");
		expect(result.current.sessionId).toBeDefined();
	});

	it("should handle line completion", async () => {
		const { result } = renderHook(() => useBoothStore());

		act(() => {
			result.current.setScript(mockScript);
		});

		await act(async () => {
			await result.current.startSession();
		});

		await act(async () => {
			await result.current.completeLine(0);
		});

		expect(result.current.completedLineIndices).toContain(0);
		expect(result.current.currentLineIndex).toBe(1);
	});

	it("should pause and resume", async () => {
		const { result } = renderHook(() => useBoothStore());

		act(() => {
			result.current.setScript(mockScript);
		});

		await act(async () => {
			await result.current.startSession();
		});

		act(() => {
			result.current.pauseSession();
		});
		expect(result.current.status).toBe("paused");

		act(() => {
			result.current.resumeSession();
		});
		expect(result.current.status).toBe("running");
	});
});
