import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockExec, mockQuery } = vi.hoisted(() => ({
	mockExec: vi.fn().mockResolvedValue(undefined),
	mockQuery: vi.fn(),
}));

vi.mock("./pgliteClient", () => ({
	initDb: vi.fn().mockResolvedValue({ exec: mockExec, query: mockQuery }),
}));

import {
	initSchema,
	getFoldersAtLevel,
	getAllFolders,
	createFolder,
	deleteFolder,
	getFolderBreadcrumb,
	getScriptCountInFolder,
	getChildItemCountsForFolders,
} from "./folderQueries";

describe("folderQueries", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("initSchema", () => {
		it("creates scripts table, folders table, and adds folder_id column", async () => {
			await initSchema();
			expect(mockExec).toHaveBeenCalledTimes(3);
			expect(mockExec.mock.calls[0][0]).toContain(
				"CREATE TABLE IF NOT EXISTS scripts",
			);
			expect(mockExec.mock.calls[1][0]).toContain(
				"CREATE TABLE IF NOT EXISTS folders",
			);
			expect(mockExec.mock.calls[2][0]).toContain(
				"ALTER TABLE scripts ADD COLUMN IF NOT EXISTS folder_id",
			);
		});
	});

	describe("getFoldersAtLevel", () => {
		it("queries root folders when parentId is null", async () => {
			mockQuery.mockResolvedValue({
				rows: [
					{ id: "f1", name: "Root", parent_id: null, created_at: "2025-01-01" },
				],
			});

			const folders = await getFoldersAtLevel(null);

			expect(mockQuery).toHaveBeenCalledWith(
				expect.stringContaining("parent_id IS NULL"),
			);
			expect(folders).toEqual([
				{
					id: "f1",
					name: "Root",
					parentId: null,
					createdAt: new Date("2025-01-01"),
				},
			]);
		});

		it("queries child folders when parentId is provided", async () => {
			mockQuery.mockResolvedValue({ rows: [] });

			await getFoldersAtLevel("parent1");

			expect(mockQuery).toHaveBeenCalledWith(
				expect.stringContaining("parent_id = $1"),
				["parent1"],
			);
		});
	});

	describe("getAllFolders", () => {
		it("returns all folders ordered by parent_id then name", async () => {
			mockQuery.mockResolvedValue({
				rows: [
					{ id: "f1", name: "A", parent_id: null, created_at: "2025-01-01" },
					{ id: "f2", name: "B", parent_id: "f1", created_at: "2025-01-02" },
				],
			});

			const folders = await getAllFolders();

			expect(mockQuery).toHaveBeenCalledWith(
				expect.stringContaining("ORDER BY parent_id NULLS FIRST"),
			);
			expect(folders).toHaveLength(2);
			expect(folders[0].parentId).toBeNull();
			expect(folders[1].parentId).toBe("f1");
		});
	});

	describe("createFolder", () => {
		it("creates a root folder", async () => {
			mockQuery.mockResolvedValue({
				rows: [
					{ id: "f1", name: "New", parent_id: null, created_at: "2025-01-01" },
				],
			});

			const folder = await createFolder("f1", "New", null);

			expect(folder.id).toBe("f1");
			expect(folder.parentId).toBeNull();
		});

		it("creates a child folder under a root folder", async () => {
			mockQuery
				.mockResolvedValueOnce({ rows: [{ parent_id: null }] })
				.mockResolvedValueOnce({
					rows: [
						{
							id: "f2",
							name: "Child",
							parent_id: "f1",
							created_at: "2025-01-01",
						},
					],
				});

			const folder = await createFolder("f2", "Child", "f1");

			expect(folder.parentId).toBe("f1");
		});

		it("rejects creating a folder at depth 3+", async () => {
			mockQuery.mockResolvedValueOnce({ rows: [{ parent_id: "some-parent" }] });

			await expect(createFolder("f3", "Deep", "f2")).rejects.toThrow(
				"Maximum folder depth of 2 levels exceeded",
			);
		});

		it("rejects when parent folder not found", async () => {
			mockQuery.mockResolvedValueOnce({ rows: [] });

			await expect(createFolder("f3", "Orphan", "missing")).rejects.toThrow(
				"Parent folder not found",
			);
		});
	});

	describe("deleteFolder", () => {
		it("deletes by id", async () => {
			mockQuery.mockResolvedValue({ rows: [] });

			await deleteFolder("f1");

			expect(mockQuery).toHaveBeenCalledWith(
				expect.stringContaining("DELETE FROM folders WHERE id = $1"),
				["f1"],
			);
		});
	});

	describe("getFolderBreadcrumb", () => {
		it("builds breadcrumb from child to root", async () => {
			mockQuery
				.mockResolvedValueOnce({
					rows: [{ id: "f2", name: "Child", parent_id: "f1" }],
				})
				.mockResolvedValueOnce({
					rows: [{ id: "f1", name: "Root", parent_id: null }],
				});

			const crumbs = await getFolderBreadcrumb("f2");

			expect(crumbs).toEqual([
				{ id: "f1", name: "Root" },
				{ id: "f2", name: "Child" },
			]);
		});

		it("returns single entry for root folder", async () => {
			mockQuery.mockResolvedValueOnce({
				rows: [{ id: "f1", name: "Root", parent_id: null }],
			});

			const crumbs = await getFolderBreadcrumb("f1");

			expect(crumbs).toEqual([{ id: "f1", name: "Root" }]);
		});
	});

	describe("getScriptCountInFolder", () => {
		it("counts scripts in a specific folder", async () => {
			mockQuery.mockResolvedValue({ rows: [{ count: 5 }] });

			const count = await getScriptCountInFolder("f1");

			expect(count).toBe(5);
			expect(mockQuery).toHaveBeenCalledWith(
				expect.stringContaining("folder_id = $1"),
				["f1"],
			);
		});

		it("counts scripts with no folder when null", async () => {
			mockQuery.mockResolvedValue({ rows: [{ count: 3 }] });

			const count = await getScriptCountInFolder(null);

			expect(count).toBe(3);
			expect(mockQuery).toHaveBeenCalledWith(
				expect.stringContaining("folder_id IS NULL"),
			);
		});
	});

	describe("getChildItemCountsForFolders", () => {
		it("returns zeros for ids with no children", async () => {
			mockQuery
				.mockResolvedValueOnce({ rows: [] })
				.mockResolvedValueOnce({ rows: [] });

			const counts = await getChildItemCountsForFolders(["a", "b"]);

			expect(counts).toEqual({ a: 0, b: 0 });
		});

		it("sums subfolders and scripts per folder id", async () => {
			mockQuery
				.mockResolvedValueOnce({
					rows: [
						{ parent_id: "f1", c: 2 },
						{ parent_id: "f2", c: 1 },
					],
				})
				.mockResolvedValueOnce({
					rows: [
						{ folder_id: "f1", c: 3 },
						{ folder_id: "f2", c: 0 },
					],
				});

			const counts = await getChildItemCountsForFolders(["f1", "f2"]);

			expect(counts).toEqual({ f1: 5, f2: 1 });
		});

		it("returns empty object when no ids", async () => {
			const counts = await getChildItemCountsForFolders([]);
			expect(counts).toEqual({});
			expect(mockQuery).not.toHaveBeenCalled();
		});
	});
});
