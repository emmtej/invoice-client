import type { Folder, FolderRow } from "./types";
import { getDb } from "./pgliteClient";

export async function initSchema(): Promise<void> {
	const db = getDb();
	await db.exec(`
		CREATE TABLE IF NOT EXISTS folders (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			parent_id TEXT REFERENCES folders(id) ON DELETE CASCADE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`);
	await db.exec(`
		ALTER TABLE scripts ADD COLUMN IF NOT EXISTS folder_id TEXT REFERENCES folders(id) ON DELETE CASCADE;
	`);
}

export async function getFoldersAtLevel(
	parentId: string | null,
): Promise<Folder[]> {
	const db = getDb();
	const result = parentId
		? await db.query(
				"SELECT * FROM folders WHERE parent_id = $1 ORDER BY name ASC;",
				[parentId],
			)
		: await db.query(
				"SELECT * FROM folders WHERE parent_id IS NULL ORDER BY name ASC;",
			);
	return result.rows.map(mapRowToFolder);
}

export async function getAllFolders(): Promise<Folder[]> {
	const db = getDb();
	const result = await db.query(
		"SELECT * FROM folders ORDER BY parent_id NULLS FIRST, name ASC;",
	);
	return result.rows.map(mapRowToFolder);
}

export async function createFolder(
	id: string,
	name: string,
	parentId: string | null,
): Promise<Folder> {
	const db = getDb();

	if (parentId) {
		const parentResult = await db.query(
			"SELECT parent_id FROM folders WHERE id = $1;",
			[parentId],
		);
		if (parentResult.rows.length === 0) {
			throw new Error("Parent folder not found");
		}
		if (parentResult.rows[0].parent_id !== null) {
			throw new Error("Maximum folder depth of 2 levels exceeded");
		}
	}

	const result = await db.query(
		"INSERT INTO folders (id, name, parent_id) VALUES ($1, $2, $3) RETURNING *;",
		[id, name, parentId],
	);
	return mapRowToFolder(result.rows[0]);
}

export async function deleteFolder(id: string): Promise<void> {
	const db = getDb();
	await db.query("DELETE FROM folders WHERE id = $1;", [id]);
}

export async function getFolderBreadcrumb(
	folderId: string,
): Promise<{ id: string; name: string }[]> {
	const db = getDb();
	const crumbs: { id: string; name: string }[] = [];
	let currentId: string | null = folderId;

	while (currentId) {
		const result = await db.query(
			"SELECT id, name, parent_id FROM folders WHERE id = $1;",
			[currentId],
		);
		if (result.rows.length === 0) break;
		const row = result.rows[0];
		crumbs.unshift({ id: row.id, name: row.name });
		currentId = row.parent_id;
	}

	return crumbs;
}

export async function getScriptCountInFolder(
	folderId: string | null,
): Promise<number> {
	const db = getDb();
	const result = folderId
		? await db.query(
				"SELECT COUNT(*)::int AS count FROM scripts WHERE folder_id = $1;",
				[folderId],
			)
		: await db.query(
				"SELECT COUNT(*)::int AS count FROM scripts WHERE folder_id IS NULL;",
			);
	return result.rows[0].count;
}

function mapRowToFolder(row: FolderRow): Folder {
	return {
		id: row.id,
		name: row.name,
		parentId: row.parent_id,
		createdAt: new Date(row.created_at),
	};
}

export const folderQueries = {
	initSchema,
	getFoldersAtLevel,
	getAllFolders,
	createFolder,
	deleteFolder,
	getFolderBreadcrumb,
	getScriptCountInFolder,
};
