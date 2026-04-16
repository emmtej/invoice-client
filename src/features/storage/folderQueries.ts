import { asc, count, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { getDrizzleDb } from "./pgliteClient";
import { folders, scripts } from "./schema";
import type { Folder } from "./types";

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

export async function getRecentFolders(
	parentId: string | null,
	limit: number,
): Promise<Folder[]> {
	const db = await getDrizzleDb();
	const result = await db
		.select()
		.from(folders)
		.where(parentId ? eq(folders.parentId, parentId) : isNull(folders.parentId))
		.orderBy(desc(folders.createdAt))
		.limit(limit);

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
		.where(inArray(folders.parentId, folderIds))
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
	getFoldersAtLevel,
	getRecentFolders,
	getAllFolders,
	createFolder,
	deleteFolder,
	getFolderBreadcrumb,
	getScriptCountInFolder,
	getChildItemCountsForFolders,
	moveFolders,
};
