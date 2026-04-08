import type { ParsedLine, Script, ScriptOverview } from "@/types/Script";
import { initDb } from "@/features/storage/pgliteClient";
import * as folderQueries from "@/features/storage/folderQueries";

let editorSchemaReady = false;

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

		return result.rows.map((row: any) => ({
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
		}));
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
};
