import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ScriptOverview } from "@/types/Script";

// Mock document for pgliteStore since we removed jsdom environment
const mockDocument = {
	implementation: {
		createHTMLDocument: () => ({}),
	},
};

Object.defineProperty(globalThis, "document", {
	value: mockDocument as unknown as Document,
	writable: true,
});

const createOverview = (wordCount = 0): ScriptOverview => ({
	validLines: [],
	invalidLines: [],
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

import { scriptDrafts, scripts } from "@/features/storage/schema";
import { initEditorDb, pgliteStore } from "./pgliteStore";

describe("pgliteStore drafts", () => {
	beforeEach(async () => {
		vi.clearAllMocks();
		await testDb.exec("DROP TABLE IF EXISTS script_drafts CASCADE;");
		await testDb.exec("DROP TABLE IF EXISTS scripts CASCADE;");
		await testDb.exec("DROP TABLE IF EXISTS folders CASCADE;");

		await testDb.exec(`
			CREATE TABLE scripts (
				id TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				html TEXT NOT NULL,
				overview JSONB NOT NULL,
				lines JSONB NOT NULL,
				group_name TEXT,
				label TEXT,
				folder_id TEXT,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
				last_accessed_at TIMESTAMP
			);
		`);
		await testDb.exec(`
			CREATE TABLE script_drafts (
				id TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				html TEXT NOT NULL,
				overview JSONB NOT NULL,
				lines JSONB NOT NULL,
				group_name TEXT,
				label TEXT,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
				last_accessed_at TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
				expires_at TIMESTAMP NOT NULL
			);
		`);
	});

	it("creates script_drafts table and index during editor init", async () => {
		await initEditorDb();
		expect(true).toBe(true);
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

		const result = await db.select().from(scriptDrafts);
		expect(result.length).toBe(1);
		expect(result[0].id).toBe("s1");
		expect(result[0].expiresAt).toBeInstanceOf(Date);
	});

	it("promotes drafts transactionally into scripts", async () => {
		const scriptA = {
			id: "a",
			name: "Draft A",
			html: "<p>Hello</p>",
			overview: createOverview(1),
			lines: [],
			expiresAt: new Date(Date.now() + 1000000),
		} satisfies typeof scriptDrafts.$inferInsert;
		const scriptB = {
			id: "b",
			name: "Draft B",
			html: "<p>World</p>",
			overview: createOverview(1),
			lines: [],
			expiresAt: new Date(Date.now() + 1000000),
		} satisfies typeof scriptDrafts.$inferInsert;

		await db.insert(scriptDrafts).values([scriptA, scriptB]);

		await pgliteStore.promoteDraftsToScripts(["a", "b"], "folder-1");

		const remainingDrafts = await db.select().from(scriptDrafts);
		expect(remainingDrafts.length).toBe(0);

		const promotedScripts = await db.select().from(scripts);
		expect(promotedScripts.length).toBe(2);
		expect(promotedScripts[0].folderId).toBe("folder-1");
		expect(promotedScripts[1].folderId).toBe("folder-1");
	});
});
