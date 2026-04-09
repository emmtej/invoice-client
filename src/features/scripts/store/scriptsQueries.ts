import { initDb } from "@/features/storage/pgliteClient";
import type { ScriptSummary } from "@/features/storage/types";
import type { ParsedLine, Script, ScriptOverview } from "@/types/Script";

export const scriptsQueries = {
	async getScriptsInFolder(folderId: string | null): Promise<ScriptSummary[]> {
		const db = await initDb();
		const result = folderId
			? await db.query(
					"SELECT id, name, folder_id, overview, created_at FROM scripts WHERE folder_id = $1 ORDER BY name ASC;",
					[folderId],
				)
			: await db.query(
					"SELECT id, name, folder_id, overview, created_at FROM scripts WHERE folder_id IS NULL ORDER BY name ASC;",
				);
		return result.rows.map((row: any) => {
			const overview =
				typeof row.overview === "string"
					? JSON.parse(row.overview)
					: row.overview;
			return {
				id: row.id,
				name: row.name,
				folderId: row.folder_id ?? null,
				wordCount: overview.wordCount ?? 0,
				invalidLineCount: overview.invalidLines?.length ?? 0,
				createdAt: new Date(row.created_at),
			};
		});
	},

	async getScriptById(id: string): Promise<Script | null> {
		const db = await initDb();
		const result = await db.query("SELECT * FROM scripts WHERE id = $1;", [id]);
		if (result.rows.length === 0) return null;
		const row = result.rows[0] as any;
		return {
			id: row.id,
			name: row.name,
			html: row.html,
			overview: (typeof row.overview === "string"
				? JSON.parse(row.overview)
				: row.overview) as ScriptOverview,
			lines: (typeof row.lines === "string"
				? JSON.parse(row.lines)
				: row.lines) as ParsedLine[],
			groupName: row.group_name,
			label: row.label,
			folderId: row.folder_id ?? null,
			source: document.implementation.createHTMLDocument(),
		};
	},

	async deleteScript(id: string): Promise<void> {
		const db = await initDb();
		await db.query("DELETE FROM scripts WHERE id = $1;", [id]);
	},

	async moveScripts(
		ids: string[],
		targetFolderId: string | null,
	): Promise<void> {
		const db = await initDb();
		const placeholders = ids.map((_, i) => `$${i + 2}`).join(", ");
		await db.query(
			`UPDATE scripts SET folder_id = $1 WHERE id IN (${placeholders});`,
			[targetFolderId, ...ids],
		);
	},

	async duplicateScript(id: string, newId: string): Promise<void> {
		const db = await initDb();
		const result = await db.query("SELECT * FROM scripts WHERE id = $1;", [id]);
		if (result.rows.length === 0) return;
		const row = result.rows[0] as any;

		await db.query(
			`INSERT INTO scripts (id, name, html, overview, lines, group_name, label, folder_id)
			 VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
			[
				newId,
				`${row.name} (Copy)`,
				row.html,
				row.overview,
				row.lines,
				row.group_name,
				row.label,
				row.folder_id,
			],
		);
	},
};
