import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	createFolder,
	deleteFolder,
	getAllFolders,
	getChildItemCountsForFolders,
	getFolderBreadcrumb,
	getFoldersAtLevel,
	getScriptCountInFolder,
} from "./folderQueries";
import { folders, scripts } from "./schema";

// Mock pgliteClient to return our test database
const { testDb, db } = await vi.hoisted(async () => {
	const { PGlite } = await import("@electric-sql/pglite");
	const { drizzle } = await import("drizzle-orm/pglite");
	const schema = await import("./schema");
	const testDb = new PGlite();
	const db = drizzle(testDb, { schema });
	return { testDb, db };
});

vi.mock("./pgliteClient", () => ({
	initDb: vi.fn().mockResolvedValue(testDb),
	getDrizzleDb: vi.fn().mockResolvedValue(db),
}));

describe("folderQueries", () => {
	beforeEach(async () => {
		// Clean up database before each test
		await testDb.exec("DROP TABLE IF EXISTS scripts;");
		await testDb.exec("DROP TABLE IF EXISTS folders;");

		// Create tables (manual for now since we haven't run migrations)
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

	describe("getFoldersAtLevel", () => {
		it("queries root folders when parentId is null", async () => {
			await db.insert(folders).values({
				id: "f1",
				name: "Root",
				parentId: null,
			});

			const result = await getFoldersAtLevel(null);

			expect(result).toHaveLength(1);
			expect(result[0].name).toBe("Root");
			expect(result[0].parentId).toBeNull();
		});

		it("queries child folders when parentId is provided", async () => {
			await db.insert(folders).values({ id: "p1", name: "Parent" });
			await db
				.insert(folders)
				.values({ id: "c1", name: "Child", parentId: "p1" });

			const result = await getFoldersAtLevel("p1");

			expect(result).toHaveLength(1);
			expect(result[0].name).toBe("Child");
			expect(result[0].parentId).toBe("p1");
		});
	});

	describe("getAllFolders", () => {
		it("returns all folders ordered by parent_id then name", async () => {
			await db.insert(folders).values([
				{ id: "f1", name: "B", parentId: null },
				{ id: "f2", name: "A", parentId: null },
				{ id: "f3", name: "C", parentId: "f2" },
			]);

			const result = await getAllFolders();

			expect(result).toHaveLength(3);
			// Ordered by parentId (null first), then name
			expect(result[0].name).toBe("A");
			expect(result[1].name).toBe("B");
			expect(result[2].name).toBe("C");
		});
	});

	describe("createFolder", () => {
		it("creates a root folder", async () => {
			const folder = await createFolder("f1", "New", null);
			expect(folder.id).toBe("f1");
			expect(folder.parentId).toBeNull();
		});

		it("creates a child folder under a root folder", async () => {
			await db.insert(folders).values({ id: "f1", name: "Root" });
			const folder = await createFolder("f2", "Child", "f1");
			expect(folder.parentId).toBe("f1");
		});

		it("rejects creating a folder at depth 3+", async () => {
			await db.insert(folders).values({ id: "f1", name: "Root" });
			await db
				.insert(folders)
				.values({ id: "f2", name: "Child", parentId: "f1" });

			await expect(createFolder("f3", "Deep", "f2")).rejects.toThrow(
				"Maximum folder depth of 2 levels exceeded",
			);
		});

		it("rejects when parent folder not found", async () => {
			await expect(createFolder("f3", "Orphan", "missing")).rejects.toThrow(
				"Parent folder not found",
			);
		});
	});

	describe("deleteFolder", () => {
		it("deletes by id", async () => {
			await db.insert(folders).values({ id: "f1", name: "Delete Me" });
			await deleteFolder("f1");

			const found = await db.select().from(folders).where(eq(folders.id, "f1"));
			expect(found).toHaveLength(0);
		});
	});

	describe("getFolderBreadcrumb", () => {
		it("builds breadcrumb from child to root", async () => {
			await db.insert(folders).values({ id: "f1", name: "Root" });
			await db
				.insert(folders)
				.values({ id: "f2", name: "Child", parentId: "f1" });

			const crumbs = await getFolderBreadcrumb("f2");

			expect(crumbs).toEqual([
				{ id: "f1", name: "Root" },
				{ id: "f2", name: "Child" },
			]);
		});
	});

	describe("getScriptCountInFolder", () => {
		it("counts scripts in a specific folder", async () => {
			await db.insert(folders).values({ id: "f1", name: "Folder" });
			// @ts-ignore: mock insert
			await db.insert(scripts).values([
				{
					id: "s1",
					name: "S1",
					html: "",
					overview: {},
					lines: [],
					folderId: "f1",
				},
				{
					id: "s2",
					name: "S2",
					html: "",
					overview: {},
					lines: [],
					folderId: "f1",
				},
				{
					id: "s3",
					name: "S3",
					html: "",
					overview: {},
					lines: [],
					folderId: null,
				},
			]);

			const count = await getScriptCountInFolder("f1");
			expect(count).toBe(2);
		});
	});

	describe("getChildItemCountsForFolders", () => {
		it("sums subfolders and scripts per folder id", async () => {
			await db.insert(folders).values([
				{ id: "f1", name: "F1" },
				{ id: "f2", name: "F2" },
				{ id: "f1s1", name: "Sub1", parentId: "f1" },
			]);
			// @ts-ignore: mock insert
			await db.insert(scripts).values([
				{
					id: "s1",
					name: "S1",
					html: "",
					overview: {},
					lines: [],
					folderId: "f1",
				},
				{
					id: "s2",
					name: "S2",
					html: "",
					overview: {},
					lines: [],
					folderId: "f1",
				},
				{
					id: "s3",
					name: "S3",
					html: "",
					overview: {},
					lines: [],
					folderId: "f2",
				},
			] as any[]);

			const counts = await getChildItemCountsForFolders(["f1", "f2"]);

			// f1: 1 subfolder + 2 scripts = 3
			// f2: 0 subfolders + 1 script = 1
			expect(counts).toEqual({ f1: 3, f2: 1 });
		});
	});
});
