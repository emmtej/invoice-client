import type { ParsedLine, Script, ScriptOverview } from "@/types/Script";

// Singleton instance for the database
let db: any = null;

export const initDb = async () => {
	if (db) return db;

	// Dynamic import PGlite and its WASM URL only when requested
	const { PGlite } = await import("@electric-sql/pglite");

	// Initialize PGlite with IndexedDB persistence for main-thread support
	db = await PGlite.create({
		dataDir: "idb://invoice-editor-db",
	});

	// Create the schema
	await db.exec(`
    CREATE TABLE IF NOT EXISTS scripts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      html TEXT NOT NULL,
      overview JSONB NOT NULL,
      lines JSONB NOT NULL,
      group_name TEXT,
      label TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

	// Migration: safely add columns that might be missing from older DB versions
	await db.exec(`
    ALTER TABLE scripts ADD COLUMN IF NOT EXISTS group_name TEXT;
    ALTER TABLE scripts ADD COLUMN IF NOT EXISTS label TEXT;
  `);

	return db;
};

export const getDb = () => {
	if (!db) {
		throw new Error("Database not initialized. Call initDb() first.");
	}
	return db;
};

// CRUD operations
export const pgliteStore = {
	async getAllScripts(): Promise<Script[]> {
		const database = await initDb();
		const result = await database.query(
			"SELECT * FROM scripts ORDER BY created_at DESC;",
		);

		return result.rows.map((row: any) => ({
			...row,
			groupName: row.group_name,
			label: row.label,
			// PGLite with query/exec might return JSONB as parsed objects already
			overview: (typeof row.overview === "string"
				? JSON.parse(row.overview)
				: row.overview) as ScriptOverview,
			lines: (typeof row.lines === "string"
				? JSON.parse(row.lines)
				: row.lines) as ParsedLine[],
			// Rehydrate empty document as per existing store behavior
			source: document.implementation.createHTMLDocument(),
		}));
	},

	async saveScript(script: Script): Promise<void> {
		const database = await initDb();
		const { id, name, html, overview, lines, groupName, label } = script;

		await database.query(
			`INSERT INTO scripts (id, name, html, overview, lines, group_name, label)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         html = EXCLUDED.html,
         overview = EXCLUDED.overview,
         lines = EXCLUDED.lines,
         group_name = EXCLUDED.group_name,
         label = EXCLUDED.label;`,
			[
				id,
				name,
				html,
				JSON.stringify(overview),
				JSON.stringify(lines),
				groupName ?? null,
				label ?? null,
			],
		);
	},

	async saveScripts(scripts: Script[]): Promise<void> {
		await initDb();
		// For simplicity, we loop, but we could use a single transaction/query
		for (const script of scripts) {
			await this.saveScript(script);
		}
	},

	async deleteScript(id: string): Promise<void> {
		const database = await initDb();
		await database.query("DELETE FROM scripts WHERE id = $1;", [id]);
	},

	async deleteScripts(ids: string[]): Promise<void> {
		const database = await initDb();
		await database.query("DELETE FROM scripts WHERE id = ANY($1);", [ids]);
	},

	async clearAll(): Promise<void> {
		const database = await initDb();
		await database.query("DELETE FROM scripts;");
	},
};
