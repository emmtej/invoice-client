import { asc, count, eq, inArray, isNull, sql } from "drizzle-orm";
import { getDrizzleDb, initDb } from "./pgliteClient";
import { folders, scripts } from "./schema";
import type { Folder } from "./types";

let schemaReady = false;

export async function initSchema(): Promise<void> {
	if (schemaReady) return;
	const db = await initDb();

	await db.exec(`
		CREATE TABLE IF NOT EXISTS folders (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			parent_id TEXT REFERENCES folders(id) ON DELETE CASCADE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
		);
	`);

	await db.exec(`
		CREATE TABLE IF NOT EXISTS scripts (
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

	await db.exec(`
		CREATE TABLE IF NOT EXISTS script_drafts (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			html TEXT NOT NULL,
			overview JSONB NOT NULL,
			lines JSONB NOT NULL,
			group_name TEXT,
			label TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
			expires_at TIMESTAMP NOT NULL
		);
	`);

	await db.exec(`
		CREATE INDEX IF NOT EXISTS idx_script_drafts_expires_at ON script_drafts (expires_at);
	`);

	await db.exec(`
		CREATE TABLE IF NOT EXISTS booth_sessions (
			id TEXT PRIMARY KEY,
			script_id TEXT NOT NULL,
			script_name TEXT NOT NULL,
			total_lines INTEGER DEFAULT 0 NOT NULL,
			completed_lines INTEGER DEFAULT 0 NOT NULL,
			elapsed_ms INTEGER DEFAULT 0 NOT NULL,
			status TEXT DEFAULT 'in_progress' NOT NULL,
			line_timings JSONB DEFAULT '[]' NOT NULL,
			started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
			completed_at TIMESTAMP
		);
	`);

	schemaReady = true;
}

export async function getFoldersAtLevel(
	parentId: string | null,
): Promise<Folder[]> {
	const db = await getDrizzleDb();
	const result = await db
		.select()
		.from(folders)
		.where(parentId ? eq(folders.parentId, parentId) : isNull(folders.parentId))
		.orderBy(asc(folders.name));

	return result.map((row) => ({
		...row,
		parentId: row.parentId ?? null,
	}));
}

export async function getAllFolders(): Promise<Folder[]> {
	const db = await getDrizzleDb();
	const result = await db
		.select()
		.from(folders)
		.orderBy(sql`${folders.parentId} ASC NULLS FIRST`, asc(folders.name));

	return result.map((row) => ({
		...row,
		parentId: row.parentId ?? null,
	}));
}

export async function createFolder(
	id: string,
	name: string,
	parentId: string | null,
): Promise<Folder> {
	const db = await getDrizzleDb();

	if (parentId) {
		const [parent] = await db
			.select({ parentId: folders.parentId })
			.from(folders)
			.where(eq(folders.id, parentId));

		if (!parent) {
			throw new Error("Parent folder not found");
		}
		if (parent.parentId !== null) {
			throw new Error("Maximum folder depth of 2 levels exceeded");
		}
	}

	const [newFolder] = await db
		.insert(folders)
		.values({ id, name, parentId })
		.returning();

	return {
		...newFolder,
		parentId: newFolder.parentId ?? null,
	};
}

export async function deleteFolder(id: string): Promise<void> {
	const db = await getDrizzleDb();
	await db.delete(folders).where(eq(folders.id, id));
}

export async function getFolderBreadcrumb(
	folderId: string,
): Promise<{ id: string; name: string }[]> {
	const db = await getDrizzleDb();
	const crumbs: { id: string; name: string }[] = [];
	let currentId: string | null = folderId;

	while (currentId) {
		const [folder] = await db
			.select({
				id: folders.id,
				name: folders.name,
				parentId: folders.parentId,
			})
			.from(folders)
			.where(eq(folders.id, currentId));

		if (!folder) break;

		crumbs.unshift({ id: folder.id, name: folder.name });
		currentId = folder.parentId;
	}

	return crumbs;
}

export async function getScriptCountInFolder(
	folderId: string | null,
): Promise<number> {
	const db = await getDrizzleDb();
	const [result] = await db
		.select({ value: count() })
		.from(scripts)
		.where(
			folderId ? eq(scripts.folderId, folderId) : isNull(scripts.folderId),
		);

	return result?.value ?? 0;
}

/**
 * For each folder id, total direct children: subfolders plus scripts (not recursive).
 */
export async function getChildItemCountsForFolders(
	folderIds: string[],
): Promise<Record<string, number>> {
	if (folderIds.length === 0) return {};
	const db = await getDrizzleDb();
	const counts = Object.fromEntries(folderIds.map((id) => [id, 0])) as Record<
		string,
		number
	>;

	const folderCounts = await db
		.select({ parentId: folders.parentId, value: count() })
		.from(folders)
		.where(inArray(folders.parentId, folderIds)) // Cast to any because parentId is nullable
		.groupBy(folders.parentId);

	for (const row of folderCounts) {
		if (row.parentId) counts[row.parentId] += row.value;
	}

	const scriptCounts = await db
		.select({ folderId: scripts.folderId, value: count() })
		.from(scripts)
		.where(inArray(scripts.folderId, folderIds))
		.groupBy(scripts.folderId);

	for (const row of scriptCounts) {
		if (row.folderId) counts[row.folderId] += row.value;
	}

	return counts;
}

export async function moveFolders(
	ids: string[],
	targetFolderId: string | null,
): Promise<void> {
	const db = await getDrizzleDb();
	await db
		.update(folders)
		.set({ parentId: targetFolderId })
		.where(inArray(folders.id, ids));
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
