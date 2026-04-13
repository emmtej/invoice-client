import * as folderQueries from "@/features/storage/folderQueries";
import { initDb } from "@/features/storage/pgliteClient";
import type { ParsedLine, Script, ScriptOverview } from "@/types/Script";

let editorSchemaReady = false;
const DRAFT_TTL_HOURS = 24;

function mapRowToScript(row: any): Script {
	return {
		...row,
		groupName: row.group_name,
		label: row.label,
		folderId: row.folder_id ?? null,
		overview: (typeof row.overview === "string"
			? JSON.parse(row.overview)
			: row.overview) as ScriptOverview,
		lines: (typeof row.lines === "string"
			? JSON.parse(row.lines)
			: row.lines) as ParsedLine[],
		source: document.implementation.createHTMLDocument(),
	};
}

export const initEditorDb = async () => {
	const db = await initDb();

	if (editorSchemaReady) return db;

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

	await db.exec(`
    ALTER TABLE scripts ADD COLUMN IF NOT EXISTS group_name TEXT;
    ALTER TABLE scripts ADD COLUMN IF NOT EXISTS label TEXT;
  `);

	await db.exec(`
    CREATE TABLE IF NOT EXISTS script_drafts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      html TEXT NOT NULL,
      overview JSONB NOT NULL,
      lines JSONB NOT NULL,
      group_name TEXT,
      label TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NOT NULL
    );
  `);

	await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_script_drafts_expires_at ON script_drafts (expires_at);
  `);

	await folderQueries.initSchema();

	editorSchemaReady = true;
	return db;
};

export const pgliteStore = {
	async getAllScripts(): Promise<Script[]> {
		const database = await initEditorDb();
		const result = await database.query(
			"SELECT * FROM scripts ORDER BY created_at DESC;",
		);
		return result.rows.map(mapRowToScript);
	},

	async saveScript(script: Script): Promise<void> {
		const database = await initEditorDb();
		const { id, name, html, overview, lines, groupName, label, folderId } =
			script;

		await database.query(
			`INSERT INTO scripts (id, name, html, overview, lines, group_name, label, folder_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         html = EXCLUDED.html,
         overview = EXCLUDED.overview,
         lines = EXCLUDED.lines,
         group_name = EXCLUDED.group_name,
         label = EXCLUDED.label,
         folder_id = EXCLUDED.folder_id;`,
			[
				id,
				name,
				html,
				JSON.stringify(overview),
				JSON.stringify(lines),
				groupName ?? null,
				label ?? null,
				folderId ?? null,
			],
		);
	},

	async saveScripts(scripts: Script[]): Promise<void> {
		await initEditorDb();
		for (const script of scripts) {
			await this.saveScript(script);
		}
	},

	async deleteScript(id: string): Promise<void> {
		const database = await initEditorDb();
		await database.query("DELETE FROM scripts WHERE id = $1;", [id]);
	},

	async deleteScripts(ids: string[]): Promise<void> {
		const database = await initEditorDb();
		await database.query("DELETE FROM scripts WHERE id = ANY($1);", [ids]);
	},

	async clearAll(): Promise<void> {
		const database = await initEditorDb();
		await database.query("DELETE FROM scripts;");
	},

	async deleteExpiredDrafts(): Promise<void> {
		const database = await initEditorDb();
		await database.query(
			"DELETE FROM script_drafts WHERE expires_at <= CURRENT_TIMESTAMP;",
		);
	},

	async getAllDraftScripts(): Promise<Script[]> {
		const database = await initEditorDb();
		await this.deleteExpiredDrafts();
		const result = await database.query(
			"SELECT * FROM script_drafts ORDER BY updated_at DESC;",
		);
		return result.rows.map(mapRowToScript);
	},

	async saveDraftScript(script: Script): Promise<void> {
		const database = await initEditorDb();
		const { id, name, html, overview, lines, groupName, label } = script;
		await database.query(
			`INSERT INTO script_drafts (id, name, html, overview, lines, group_name, label, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP + INTERVAL '${DRAFT_TTL_HOURS} hours')
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         html = EXCLUDED.html,
         overview = EXCLUDED.overview,
         lines = EXCLUDED.lines,
         group_name = EXCLUDED.group_name,
         label = EXCLUDED.label,
         updated_at = CURRENT_TIMESTAMP,
         expires_at = CURRENT_TIMESTAMP + INTERVAL '${DRAFT_TTL_HOURS} hours';`,
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

	async saveDraftScripts(scripts: Script[]): Promise<void> {
		for (const script of scripts) {
			await this.saveDraftScript(script);
		}
	},

	async deleteDraftScript(id: string): Promise<void> {
		const database = await initEditorDb();
		await database.query("DELETE FROM script_drafts WHERE id = $1;", [id]);
	},

	async deleteDraftScripts(ids: string[]): Promise<void> {
		const database = await initEditorDb();
		await database.query("DELETE FROM script_drafts WHERE id = ANY($1);", [
			ids,
		]);
	},

	async clearAllDrafts(): Promise<void> {
		const database = await initEditorDb();
		await database.query("DELETE FROM script_drafts;");
	},

	async promoteDraftsToScripts(
		ids: string[],
		folderId: string | null,
	): Promise<void> {
		if (ids.length === 0) return;
		const database = await initEditorDb();
		await this.deleteExpiredDrafts();
		await database.query("BEGIN;");
		try {
			await database.query(
				`INSERT INTO scripts (id, name, html, overview, lines, group_name, label, folder_id)
         SELECT id, name, html, overview, lines, group_name, label, $2
         FROM script_drafts
         WHERE id = ANY($1)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           html = EXCLUDED.html,
           overview = EXCLUDED.overview,
           lines = EXCLUDED.lines,
           group_name = EXCLUDED.group_name,
           label = EXCLUDED.label,
           folder_id = EXCLUDED.folder_id;`,
				[ids, folderId],
			);
			await database.query("DELETE FROM script_drafts WHERE id = ANY($1);", [
				ids,
			]);
			await database.query("COMMIT;");
		} catch (error) {
			await database.query("ROLLBACK;");
			throw error;
		}
	},
};
