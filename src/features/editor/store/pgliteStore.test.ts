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

import {
	scriptContents,
	scriptDrafts,
	scripts,
} from "@/features/storage/schema";
import { pgliteStore } from "./pgliteStore";

describe("pgliteStore partitioned scripts", () => {
	beforeEach(async () => {
		vi.clearAllMocks();
		await testDb.exec("DROP TABLE IF EXISTS script_contents CASCADE;");
		await testDb.exec("DROP TABLE IF EXISTS script_drafts CASCADE;");
		await testDb.exec("DROP TABLE IF EXISTS scripts CASCADE;");
		await testDb.exec("DROP TABLE IF EXISTS folders CASCADE;");

		await testDb.exec(`
			CREATE TABLE scripts (
				id TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				overview JSONB NOT NULL,
				group_name TEXT,
				label TEXT,
				folder_id TEXT,
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

	it("saves and retrieves full scripts across two tables", async () => {
		const script = {
			id: "s1",
			name: "Full Script",
			html: "<p>Hello</p>",
			overview: createOverview(1),
			lines: [],
			source: document.implementation.createHTMLDocument(),
			createdAt: new Date(),
		};

		await pgliteStore.saveScript(script);

		const metadata = await pgliteStore.getLibraryListing();
		expect(metadata.length).toBe(1);
		expect(metadata[0].name).toBe("Full Script");
		// @ts-expect-error - html should not exist on metadata
		expect(metadata[0].html).toBeUndefined();

		const full = await pgliteStore.getScriptFull("s1");
		expect(full?.html).toBe("<p>Hello</p>");
		expect(full?.name).toBe("Full Script");
	});

	it("promotes drafts into two tables", async () => {
		const scriptA = {
			id: "a",
			name: "Draft A",
			html: "<p>Hello</p>",
			overview: createOverview(1),
			lines: [],
			expiresAt: new Date(Date.now() + 1000000),
		} satisfies typeof scriptDrafts.$inferInsert;

		await db.insert(scriptDrafts).values([scriptA]);

		await pgliteStore.promoteDraftsToScripts(["a"], "folder-1");

		const remainingDrafts = await db.select().from(scriptDrafts);
		expect(remainingDrafts.length).toBe(0);

		const promotedScripts = await db.select().from(scripts);
		expect(promotedScripts.length).toBe(1);

		const promotedContents = await db.select().from(scriptContents);
		expect(promotedContents.length).toBe(1);
		expect(promotedContents[0].html).toBe("<p>Hello</p>");
	});
});
