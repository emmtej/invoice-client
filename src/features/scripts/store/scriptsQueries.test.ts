/**
 * @vitest-environment node
 */

import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { folders, scripts } from "@/features/storage/schema";
import type { ScriptOverview } from "@/types/Script";
import { scriptsQueries } from "./scriptsQueries";

const mockDocument = {
	implementation: {
		createHTMLDocument: () => ({}),
	},
};

Object.defineProperty(globalThis, "document", {
	value: mockDocument as unknown as Document,
	writable: true,
});

const createOverview = (
	wordCount = 0,
	invalidLines: number[] = [],
): ScriptOverview => ({
	validLines: [],
	invalidLines,
	actionLines: [],
	scenes: [],
	wordCount,
	totalLines: 0,
});

const { testDb, db } = await vi.hoisted(async () => {
	const { PGlite } = await import("@electric-sql/pglite");
	const { drizzle } = await import("drizzle-orm/pglite");
	const schema = await import("@/features/storage/schema");
	const testDb = new PGlite();
	const db = drizzle(testDb, { schema });
	return { testDb, db };
});

vi.mock("@/features/storage/pgliteClient", () => ({
	initDb: vi.fn().mockResolvedValue(testDb),
	getDrizzleDb: vi.fn().mockResolvedValue(db),
}));

vi.mock("@/features/storage/folderQueries", () => ({
	initSchema: vi.fn().mockResolvedValue(undefined),
}));

describe("scriptsQueries", () => {
	beforeEach(async () => {
		vi.clearAllMocks();
		await testDb.exec("DROP TABLE IF EXISTS scripts CASCADE;");
		await testDb.exec("DROP TABLE IF EXISTS folders CASCADE;");
		await testDb.exec(`
			CREATE TABLE folders (
				id TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				parent_id TEXT REFERENCES folders(id) ON DELETE CASCADE,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
				last_accessed_at TIMESTAMP
			);
		`);
		await testDb.exec(`
			CREATE TABLE scripts (
				id TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				html TEXT NOT NULL,
				overview JSONB NOT NULL,
				lines JSONB NOT NULL,
				group_name TEXT,
				label TEXT,
				folder_id TEXT REFERENCES folders(id) ON DELETE CASCADE,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
				last_accessed_at TIMESTAMP
			);
		`);
	});

	describe("getAllScripts", () => {
		it("queries all scripts and maps rows correctly", async () => {
			await db
				.insert(folders)
				.values({ id: "f1", name: "Folder 1", parentId: null });
			await db.insert(scripts).values({
				id: "s1",
				name: "A",
				html: "",
				folderId: "f1",
				overview: createOverview(10, [1, 2]),
				lines: [],
				createdAt: new Date("2025-06-01T00:00:00.000Z"),
			});

			const rows = await scriptsQueries.getAllScripts();

			expect(rows).toEqual([
				{
					id: "s1",
					name: "A",
					folderId: "f1",
					wordCount: 10,
					invalidLineCount: 2,
					createdAt: new Date("2025-06-01T00:00:00.000Z"),
					lastAccessedAt: null,
				},
			]);
		});

		it("handles null overview gracefully", async () => {
			await db.insert(scripts).values({
				id: "s2",
				name: "B",
				html: "",
				folderId: null,
				overview: createOverview(),
				lines: [],
				createdAt: new Date("2025-06-02T00:00:00.000Z"),
			});

			const rows = await scriptsQueries.getAllScripts();

			expect(rows[0]).toMatchObject({
				wordCount: 0,
				invalidLineCount: 0,
			});
		});
	});

	describe("getScriptsInFolder", () => {
		it("queries scripts for a folder id", async () => {
			await db
				.insert(folders)
				.values({ id: "f1", name: "Folder 1", parentId: null });
			await db.insert(scripts).values({
				id: "s1",
				name: "A",
				html: "",
				folderId: "f1",
				overview: createOverview(10, [1, 2]),
				lines: [],
				createdAt: new Date("2025-06-01T00:00:00.000Z"),
			});

			const rows = await scriptsQueries.getScriptsInFolder("f1");

			expect(rows).toEqual([
				{
					id: "s1",
					name: "A",
					folderId: "f1",
					wordCount: 10,
					invalidLineCount: 2,
					createdAt: new Date("2025-06-01T00:00:00.000Z"),
					lastAccessedAt: null,
				},
			]);
		});

		it("queries root scripts when folderId is null", async () => {
			await db.insert(scripts).values({
				id: "s2",
				name: "Root",
				html: "",
				folderId: null,
				overview: createOverview(3),
				lines: [],
				createdAt: new Date("2025-06-02T00:00:00.000Z"),
			});

			const rows = await scriptsQueries.getScriptsInFolder(null);

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
			await db
				.insert(folders)
				.values({ id: "f1", name: "Folder", parentId: null });
			await db.insert(scripts).values({
				id: "id1",
				name: "N",
				html: "<p></p>",
				overview,
				lines: [],
				groupName: "g",
				label: "l",
				folderId: "f1",
			});

			const script = await scriptsQueries.getScriptById("id1");

			expect(script).toMatchObject({
				id: "id1",
				name: "N",
				html: "<p></p>",
				overview,
				lines: [],
				groupName: "g",
				label: "l",
				folderId: "f1",
			});
			expect(script?.source).toBeDefined();
		});

		it("returns null when no row exists", async () => {
			const script = await scriptsQueries.getScriptById("missing");
			expect(script).toBeNull();
		});
	});

	describe("deleteScript", () => {
		it("deletes by id", async () => {
			await db.insert(scripts).values({
				id: "to-delete",
				name: "Delete Me",
				html: "",
				overview: createOverview(),
				lines: [],
			});
			await scriptsQueries.deleteScript("to-delete");

			const result = await db
				.select()
				.from(scripts)
				.where(eq(scripts.id, "to-delete"));
			expect(result.length).toBe(0);
		});
	});

	describe("touchScript", () => {
		it("sets last_accessed_at on the target script", async () => {
			await db.insert(scripts).values({
				id: "s1",
				name: "A",
				html: "",
				overview: createOverview(),
				lines: [],
				createdAt: new Date("2025-01-01T00:00:00.000Z"),
			});

			const before = new Date();
			await scriptsQueries.touchScript("s1");
			const after = new Date();

			const [row] = await db.select().from(scripts).where(eq(scripts.id, "s1"));
			expect(row.lastAccessedAt).not.toBeNull();
			const touchedAt = row.lastAccessedAt;
			if (!touchedAt) {
				throw new Error("Expected lastAccessedAt to be set after touchScript");
			}
			expect(touchedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
			expect(touchedAt.getTime()).toBeLessThanOrEqual(after.getTime());
		});

		it("is a no-op for a missing id", async () => {
			await expect(
				scriptsQueries.touchScript("missing"),
			).resolves.toBeUndefined();
		});
	});

	describe("getRecentScripts", () => {
		it("orders by lastAccessedAt desc nulls last then createdAt desc", async () => {
			await db.insert(scripts).values([
				{
					id: "old-accessed",
					name: "Old Accessed",
					html: "",
					overview: createOverview(5),
					lines: [],
					createdAt: new Date("2025-01-01T00:00:00.000Z"),
					lastAccessedAt: new Date("2025-06-01T00:00:00.000Z"),
				},
				{
					id: "never-accessed",
					name: "Never Accessed",
					html: "",
					overview: createOverview(3),
					lines: [],
					createdAt: new Date("2025-03-01T00:00:00.000Z"),
					lastAccessedAt: null,
				},
				{
					id: "recently-accessed",
					name: "Recently Accessed",
					html: "",
					overview: createOverview(8),
					lines: [],
					createdAt: new Date("2025-01-01T00:00:00.000Z"),
					lastAccessedAt: new Date("2025-09-01T00:00:00.000Z"),
				},
			]);

			const result = await scriptsQueries.getRecentScripts(10, 0);

			expect(result.map((r) => r.id)).toEqual([
				"recently-accessed",
				"old-accessed",
				"never-accessed",
			]);
		});

		it("respects limit and offset", async () => {
			await db.insert(scripts).values([
				{
					id: "s1",
					name: "A",
					html: "",
					overview: createOverview(),
					lines: [],
					createdAt: new Date("2025-03-01T00:00:00.000Z"),
				},
				{
					id: "s2",
					name: "B",
					html: "",
					overview: createOverview(),
					lines: [],
					createdAt: new Date("2025-02-01T00:00:00.000Z"),
				},
				{
					id: "s3",
					name: "C",
					html: "",
					overview: createOverview(),
					lines: [],
					createdAt: new Date("2025-01-01T00:00:00.000Z"),
				},
			]);

			const page1 = await scriptsQueries.getRecentScripts(2, 0);
			const page2 = await scriptsQueries.getRecentScripts(2, 2);

			expect(page1.map((r) => r.id)).toEqual(["s1", "s2"]);
			expect(page2.map((r) => r.id)).toEqual(["s3"]);
		});

		it("maps lastAccessedAt correctly", async () => {
			const accessedAt = new Date("2025-06-15T10:00:00.000Z");
			await db.insert(scripts).values({
				id: "s1",
				name: "A",
				html: "",
				overview: createOverview(2),
				lines: [],
				createdAt: new Date("2025-01-01T00:00:00.000Z"),
				lastAccessedAt: accessedAt,
			});

			const [result] = await scriptsQueries.getRecentScripts(1, 0);
			expect(result.lastAccessedAt).toEqual(accessedAt);
		});

		it("keeps newly created unaccessed scripts visible via createdAt fallback", async () => {
			await db.insert(scripts).values([
				{
					id: "accessed-older",
					name: "Accessed Older",
					html: "",
					overview: createOverview(),
					lines: [],
					createdAt: new Date("2025-01-01T00:00:00.000Z"),
					lastAccessedAt: new Date("2025-02-01T00:00:00.000Z"),
				},
				{
					id: "uploaded-new",
					name: "Uploaded New",
					html: "",
					overview: createOverview(),
					lines: [],
					createdAt: new Date("2025-03-01T00:00:00.000Z"),
					lastAccessedAt: null,
				},
			]);

			const result = await scriptsQueries.getRecentScripts(10, 0);
			expect(result.map((r) => r.id)).toEqual([
				"uploaded-new",
				"accessed-older",
			]);
		});

		it("uses id as a deterministic tie-breaker", async () => {
			const sharedTimestamp = new Date("2025-03-01T00:00:00.000Z");
			await db.insert(scripts).values([
				{
					id: "a-id",
					name: "A",
					html: "",
					overview: createOverview(),
					lines: [],
					createdAt: sharedTimestamp,
					lastAccessedAt: null,
				},
				{
					id: "b-id",
					name: "B",
					html: "",
					overview: createOverview(),
					lines: [],
					createdAt: sharedTimestamp,
					lastAccessedAt: null,
				},
			]);

			const result = await scriptsQueries.getRecentScripts(10, 0);
			expect(result.map((r) => r.id)).toEqual(["b-id", "a-id"]);
		});
	});

	describe("getScriptsInFolderPaginated", () => {
		it("returns only scripts in the given folder, paginated", async () => {
			await db.insert(folders).values({ id: "f1", name: "Folder" });
			await db.insert(scripts).values([
				{
					id: "s1",
					name: "A",
					html: "",
					overview: createOverview(),
					lines: [],
					folderId: "f1",
					createdAt: new Date("2025-03-01T00:00:00.000Z"),
				},
				{
					id: "s2",
					name: "B",
					html: "",
					overview: createOverview(),
					lines: [],
					folderId: "f1",
					createdAt: new Date("2025-02-01T00:00:00.000Z"),
				},
				{
					id: "s3",
					name: "C",
					html: "",
					overview: createOverview(),
					lines: [],
					folderId: null,
					createdAt: new Date("2025-01-01T00:00:00.000Z"),
				},
			]);

			const result = await scriptsQueries.getScriptsInFolderPaginated(
				"f1",
				10,
				0,
			);

			expect(result.map((r) => r.id)).toEqual(["s1", "s2"]);
		});

		it("handles null folderId (root scripts)", async () => {
			await db.insert(folders).values({ id: "f1", name: "Folder" });
			await db.insert(scripts).values([
				{
					id: "s1",
					name: "Root",
					html: "",
					overview: createOverview(),
					lines: [],
					folderId: null,
					createdAt: new Date("2025-01-01T00:00:00.000Z"),
				},
				{
					id: "s2",
					name: "InFolder",
					html: "",
					overview: createOverview(),
					lines: [],
					folderId: "f1",
					createdAt: new Date("2025-01-01T00:00:00.000Z"),
				},
			]);

			const result = await scriptsQueries.getScriptsInFolderPaginated(
				null,
				10,
				0,
			);

			expect(result.map((r) => r.id)).toEqual(["s1"]);
		});

		it("respects limit and offset", async () => {
			await db.insert(scripts).values([
				{
					id: "s1",
					name: "A",
					html: "",
					overview: createOverview(),
					lines: [],
					folderId: null,
					createdAt: new Date("2025-03-01T00:00:00.000Z"),
				},
				{
					id: "s2",
					name: "B",
					html: "",
					overview: createOverview(),
					lines: [],
					folderId: null,
					createdAt: new Date("2025-02-01T00:00:00.000Z"),
				},
				{
					id: "s3",
					name: "C",
					html: "",
					overview: createOverview(),
					lines: [],
					folderId: null,
					createdAt: new Date("2025-01-01T00:00:00.000Z"),
				},
			]);

			const page1 = await scriptsQueries.getScriptsInFolderPaginated(
				null,
				2,
				0,
			);
			const page2 = await scriptsQueries.getScriptsInFolderPaginated(
				null,
				2,
				2,
			);

			expect(page1.map((r) => r.id)).toEqual(["s1", "s2"]);
			expect(page2.map((r) => r.id)).toEqual(["s3"]);
		});

		it("uses fallback ordering in folder queries for newly uploaded scripts", async () => {
			await db.insert(folders).values({ id: "f1", name: "Folder" });
			await db.insert(scripts).values([
				{
					id: "accessed-old",
					name: "Accessed Old",
					html: "",
					overview: createOverview(),
					lines: [],
					folderId: "f1",
					createdAt: new Date("2025-01-01T00:00:00.000Z"),
					lastAccessedAt: new Date("2025-02-01T00:00:00.000Z"),
				},
				{
					id: "uploaded-recent",
					name: "Uploaded Recent",
					html: "",
					overview: createOverview(),
					lines: [],
					folderId: "f1",
					createdAt: new Date("2025-03-01T00:00:00.000Z"),
					lastAccessedAt: null,
				},
			]);

			const result = await scriptsQueries.getScriptsInFolderPaginated(
				"f1",
				10,
				0,
			);
			expect(result.map((r) => r.id)).toEqual([
				"uploaded-recent",
				"accessed-old",
			]);
		});
	});

	describe("countScriptsInFolder", () => {
		it("counts scripts in a specific folder", async () => {
			await db.insert(folders).values({ id: "f1", name: "F1" });
			await db.insert(scripts).values([
				{
					id: "s1",
					name: "A",
					html: "",
					overview: createOverview(),
					lines: [],
					folderId: "f1",
				},
				{
					id: "s2",
					name: "B",
					html: "",
					overview: createOverview(),
					lines: [],
					folderId: "f1",
				},
				{
					id: "s3",
					name: "C",
					html: "",
					overview: createOverview(),
					lines: [],
					folderId: null,
				},
			]);

			expect(await scriptsQueries.countScriptsInFolder("f1")).toBe(2);
			expect(await scriptsQueries.countScriptsInFolder(null)).toBe(1);
		});
	});

	describe("countAllScripts", () => {
		it("counts all scripts regardless of folder", async () => {
			await db.insert(folders).values({ id: "f1", name: "F1" });
			await db.insert(scripts).values([
				{
					id: "s1",
					name: "A",
					html: "",
					overview: createOverview(),
					lines: [],
					folderId: "f1",
				},
				{
					id: "s2",
					name: "B",
					html: "",
					overview: createOverview(),
					lines: [],
					folderId: null,
				},
			]);

			expect(await scriptsQueries.countAllScripts()).toBe(2);
		});

		it("returns 0 when no scripts exist", async () => {
			expect(await scriptsQueries.countAllScripts()).toBe(0);
		});
	});
});
