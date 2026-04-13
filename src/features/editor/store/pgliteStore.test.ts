/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockExec, mockQuery, mockInitSchema } = vi.hoisted(() => ({
	mockExec: vi.fn().mockResolvedValue(undefined),
	mockQuery: vi.fn(),
	mockInitSchema: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/features/storage/pgliteClient", () => ({
	initDb: vi.fn(async () => ({ exec: mockExec, query: mockQuery })),
}));

vi.mock("@/features/storage/folderQueries", () => ({
	initSchema: mockInitSchema,
}));

import { initEditorDb, pgliteStore } from "./pgliteStore";

describe("pgliteStore drafts", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("creates script_drafts table and index during editor init", async () => {
		await initEditorDb();

		expect(mockExec).toHaveBeenCalled();
		const ddlCalls = mockExec.mock.calls.map((call) => call[0]).join("\n");
		expect(ddlCalls).toContain("CREATE TABLE IF NOT EXISTS script_drafts");
		expect(ddlCalls).toContain(
			"CREATE INDEX IF NOT EXISTS idx_script_drafts_expires_at",
		);
		expect(mockInitSchema).toHaveBeenCalled();
	});

	it("saves drafts with TTL extension fields", async () => {
		const script = {
			id: "s1",
			name: "Draft",
			html: "<p>Hello</p>",
			overview: {
				validLines: [],
				invalidLines: [],
				actionLines: [],
				scenes: [],
				wordCount: 1,
				totalLines: 1,
			},
			lines: [],
			source: document.implementation.createHTMLDocument(),
		};

		await pgliteStore.saveDraftScript(script);

		expect(mockQuery).toHaveBeenCalledWith(
			expect.stringContaining("INSERT INTO script_drafts"),
			expect.any(Array),
		);
		expect(mockQuery).toHaveBeenCalledWith(
			expect.stringContaining("INTERVAL '24 hours'"),
			expect.any(Array),
		);
	});

	it("promotes drafts transactionally into scripts", async () => {
		await pgliteStore.promoteDraftsToScripts(["a", "b"], "folder-1");

		const calls = mockQuery.mock.calls.map((call) => call[0]);
		expect(calls).toContain("BEGIN;");
		expect(calls).toContain("COMMIT;");
		expect(calls.some((q) => q.includes("INSERT INTO scripts"))).toBe(true);
		expect(
			calls.some((q) =>
				q.includes("DELETE FROM script_drafts WHERE id = ANY($1);"),
			),
		).toBe(true);
	});
});
