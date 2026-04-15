/**
 * @vitest-environment node
 */

globalThis.document = {
	implementation: {
		createHTMLDocument: () => ({}) as any,
	},
} as any;

import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { folders, scripts } from "@/features/storage/schema";
import { scriptsQueries } from "./scriptsQueries";

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
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
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
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
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
				overview: { wordCount: 10, invalidLines: [1, 2] },
				lines: [],
				createdAt: new Date("2025-06-01T00:00:00.000Z"),
			} as any);

			const rows = await scriptsQueries.getAllScripts();

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

		it("handles null overview gracefully", async () => {
			await db.insert(scripts).values({
				id: "s2",
				name: "B",
				html: "",
				folderId: null,
				overview: { wordCount: 0, invalidLines: [] },
				lines: [],
				createdAt: new Date("2025-06-02T00:00:00.000Z"),
			} as any);

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
				overview: { wordCount: 10, invalidLines: [1, 2] },
				lines: [],
				createdAt: new Date("2025-06-01T00:00:00.000Z"),
			} as any);

			const rows = await scriptsQueries.getScriptsInFolder("f1");

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
			await db.insert(scripts).values({
				id: "s2",
				name: "Root",
				html: "",
				folderId: null,
				overview: { wordCount: 3, invalidLines: [] },
				lines: [],
				createdAt: new Date("2025-06-02T00:00:00.000Z"),
			} as any);

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
			} as any);

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
				overview: {},
				lines: [],
			} as any);
			await scriptsQueries.deleteScript("to-delete");

			const result = await db
				.select()
				.from(scripts)
				.where(eq(scripts.id, "to-delete"));
			expect(result.length).toBe(0);
		});
	});
});
