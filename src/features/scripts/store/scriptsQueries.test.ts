/**
 * @vitest-environment node
 */

import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { folders, scriptContents, scripts } from "@/features/storage/schema";
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
		await testDb.exec("DROP TABLE IF EXISTS script_contents CASCADE;");
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
				overview JSONB NOT NULL,
				group_name TEXT,
				label TEXT,
				folder_id TEXT REFERENCES folders(id) ON DELETE CASCADE,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
				last_accessed_at TIMESTAMP
			);
		`);
		await testDb.exec(`
			CREATE TABLE script_contents (
				script_id TEXT PRIMARY KEY REFERENCES scripts(id) ON DELETE CASCADE,
				html TEXT NOT NULL,
				lines JSONB NOT NULL
			);
		`);
	});

	describe("getAllScripts", () => {
		it("queries all scripts and maps rows correctly", async () => {
			await db
				.insert(folders)
				.values({ id: "f1", name: "Folder 1", parentId: null });
			
			await scriptsQueries.saveScript({
				id: "s1",
				name: "A",
				html: "",
				folderId: "f1",
				overview: createOverview(10, [1, 2]),
				lines: [],
				createdAt: new Date("2025-06-01T00:00:00.000Z"),
				source: document.implementation.createHTMLDocument(),
			});

			const rows = await scriptsQueries.getAllScripts();

			expect(rows[0]).toMatchObject({
				id: "s1",
				name: "A",
				folderId: "f1",
				wordCount: 10,
				invalidLineCount: 2,
			});
		});
	});

	describe("getScriptById", () => {
		it("returns a full Script across two tables", async () => {
			const overview = createOverview(5);
			await scriptsQueries.saveScript({
				id: "id1",
				name: "N",
				html: "<p>Content</p>",
				overview,
				lines: [],
				groupName: "g",
				label: "l",
				folderId: null,
				createdAt: new Date(),
				source: document.implementation.createHTMLDocument(),
			});

			const script = await scriptsQueries.getScriptById("id1");

			expect(script).toMatchObject({
				id: "id1",
				name: "N",
				html: "<p>Content</p>",
				overview,
				lines: [],
				groupName: "g",
				label: "l",
			});
		});
	});

	describe("deleteScript", () => {
		it("deletes by id and cascades to contents", async () => {
			await scriptsQueries.saveScript({
				id: "to-delete",
				name: "Delete Me",
				html: "heavy",
				overview: createOverview(),
				lines: [],
				createdAt: new Date(),
				source: document.implementation.createHTMLDocument(),
			});
			await scriptsQueries.deleteScript("to-delete");

			const result = await db
				.select()
				.from(scripts)
				.where(eq(scripts.id, "to-delete"));
			expect(result.length).toBe(0);

			const contentResult = await db
				.select()
				.from(scriptContents)
				.where(eq(scriptContents.scriptId, "to-delete"));
			expect(contentResult.length).toBe(0);
		});
	});

	describe("getRecentScripts", () => {
		it("orders correctly using metadata table", async () => {
			await scriptsQueries.saveScript({
				id: "old",
				name: "Old",
				html: "",
				overview: createOverview(),
				lines: [],
				createdAt: new Date("2025-01-01"),
				source: document.implementation.createHTMLDocument(),
			});
			await scriptsQueries.saveScript({
				id: "new",
				name: "New",
				html: "",
				overview: createOverview(),
				lines: [],
				createdAt: new Date("2025-03-01"),
				source: document.implementation.createHTMLDocument(),
			});

			const result = await scriptsQueries.getRecentScripts(10, 0);
			expect(result[0].id).toBe("new");
			expect(result[1].id).toBe("old");
		});
	});
});
