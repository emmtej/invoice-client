import { initDb } from "./pgliteClient";
import type { Folder, FolderRow } from "./types";

export async function initSchema(): Promise<void> {
	const db = await initDb();

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
	const db = await initDb();
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
	const db = await initDb();
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
	const db = await initDb();

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
	const db = await initDb();
	await db.query("DELETE FROM folders WHERE id = $1;", [id]);
}

export async function getFolderBreadcrumb(
	folderId: string,
): Promise<{ id: string; name: string }[]> {
	const db = await initDb();
	const crumbs: { id: string; name: string }[] = [];
	let currentId: string | null = folderId;

	while (currentId) {
		const id = currentId;
		const result = await db.query(
			"SELECT id, name, parent_id FROM folders WHERE id = $1;",
			[id],
		);
		if (result.rows.length === 0) break;
		const row = result.rows[0] as {
			id: string;
			name: string;
			parent_id: string | null;
		};
		crumbs.unshift({ id: row.id, name: row.name });
		currentId = row.parent_id;
	}

	return crumbs;
}

export async function getScriptCountInFolder(
	folderId: string | null,
): Promise<number> {
	const db = await initDb();
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

/**
 * For each folder id, total direct children: subfolders plus scripts (not recursive).
 */
export async function getChildItemCountsForFolders(
	folderIds: string[],
): Promise<Record<string, number>> {
	if (folderIds.length === 0) return {};
	const db = await initDb();
	const counts = Object.fromEntries(folderIds.map((id) => [id, 0])) as Record<
		string,
		number
	>;

	const placeholders = folderIds.map((_, i) => `$${i + 1}`).join(", ");

	const childRes = await db.query(
		`SELECT parent_id, COUNT(*)::int AS c FROM folders WHERE parent_id IN (${placeholders}) GROUP BY parent_id;`,
		folderIds,
	);
	const childRows = childRes.rows as { parent_id: string; c: number }[];
	for (const row of childRows) {
		counts[row.parent_id] += row.c;
	}

	const scriptsRes = await db.query(
		`SELECT folder_id, COUNT(*)::int AS c FROM scripts WHERE folder_id IN (${placeholders}) GROUP BY folder_id;`,
		folderIds,
	);
	const scriptRows = scriptsRes.rows as { folder_id: string; c: number }[];
	for (const row of scriptRows) {
		counts[row.folder_id] += row.c;
	}

	return counts;
}

export async function moveFolders(
	ids: string[],
	targetFolderId: string | null,
): Promise<void> {
	const db = await initDb();
	const placeholders = ids.map((_, i) => `$${i + 2}`).join(", ");
	await db.query(
		`UPDATE folders SET parent_id = $1 WHERE id IN (${placeholders});`,
		[targetFolderId, ...ids],
	);
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
	getChildItemCountsForFolders,
	moveFolders,
};
