/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockQuery = vi.fn();

vi.mock("@/features/storage/pgliteClient", () => ({
	initDb: vi.fn(async () => ({ query: mockQuery })),
}));

import { scriptsQueries } from "./scriptsQueries";

describe("scriptsQueries", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("getScriptsInFolder", () => {
		it("queries scripts for a folder id", async () => {
			mockQuery.mockResolvedValue({
				rows: [
					{
						id: "s1",
						name: "A",
						folder_id: "f1",
						overview: JSON.stringify({
							wordCount: 10,
							invalidLines: [1, 2],
						}),
						created_at: "2025-06-01T00:00:00.000Z",
					},
				],
			});

			const rows = await scriptsQueries.getScriptsInFolder("f1");

			expect(mockQuery).toHaveBeenCalledWith(
				expect.stringContaining("folder_id = $1"),
				["f1"],
			);
			expect(rows).toEqual([
				{
					id: "s1",
					name: "A",
					folderId: "f1",
					wordCount: 10,
					invalidLineCount: 2,
					createdAt: new Date("2025-06-01T00:00:00.000Z"),
				},
			]);
		});

		it("queries root scripts when folderId is null", async () => {
			mockQuery.mockResolvedValue({
				rows: [
					{
						id: "s2",
						name: "Root",
						folder_id: null,
						overview: { wordCount: 3, invalidLines: [] },
						created_at: "2025-06-02T00:00:00.000Z",
					},
				],
			});

			const rows = await scriptsQueries.getScriptsInFolder(null);

			expect(mockQuery).toHaveBeenCalledWith(
				expect.stringContaining("folder_id IS NULL"),
			);
			expect(rows[0]).toMatchObject({
				id: "s2",
				folderId: null,
				wordCount: 3,
				invalidLineCount: 0,
			});
		});
	});

	describe("getScriptById", () => {
		it("returns a Script when a row exists", async () => {
			const overview = {
				validLines: [],
				invalidLines: [],
				actionLines: [],
				scenes: [],
				wordCount: 0,
				totalLines: 0,
			};
			const lines: unknown[] = [];
			mockQuery.mockResolvedValue({
				rows: [
					{
						id: "id1",
						name: "N",
						html: "<p></p>",
						overview: JSON.stringify(overview),
						lines: JSON.stringify(lines),
						group_name: "g",
						label: "l",
						folder_id: "f1",
					},
				],
			});

			const script = await scriptsQueries.getScriptById("id1");

			expect(mockQuery).toHaveBeenCalledWith(
				"SELECT * FROM scripts WHERE id = $1;",
				["id1"],
			);
			expect(script).toMatchObject({
				id: "id1",
				name: "N",
				html: "<p></p>",
				overview,
				lines,
				groupName: "g",
				label: "l",
				folderId: "f1",
			});
			expect(script?.source).toBeInstanceOf(Document);
		});

		it("returns null when no row exists", async () => {
			mockQuery.mockResolvedValue({ rows: [] });

			const script = await scriptsQueries.getScriptById("missing");

			expect(script).toBeNull();
		});
	});

	describe("deleteScript", () => {
		it("deletes by id", async () => {
			mockQuery.mockResolvedValue({ rows: [] });

			await scriptsQueries.deleteScript("to-delete");

			expect(mockQuery).toHaveBeenCalledWith(
				"DELETE FROM scripts WHERE id = $1;",
				["to-delete"],
			);
		});
	});
});
