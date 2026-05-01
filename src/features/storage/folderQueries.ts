import { desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { getDrizzleDb } from "./pgliteClient";
import { folders, scripts } from "./schema";
import type { Folder } from "./types";

export const folderQueries = {
	async getAllFolders(): Promise<Folder[]> {
		const db = await getDrizzleDb();
		const result = await db
			.select()
			.from(folders)
			.orderBy(desc(folders.createdAt));

		return result.map((row) => ({
			id: row.id,
			name: row.name,
			parentId: row.parentId,
			createdAt: row.createdAt,
		}));
	},

	async getRecentFolders(
		parentId: string | null = null,
		limit = 10,
	): Promise<Folder[]> {
		const db = await getDrizzleDb();
		const result = await db
			.select()
			.from(folders)
			.where(
				parentId ? eq(folders.parentId, parentId) : isNull(folders.parentId),
			)
			.orderBy(desc(folders.createdAt))
			.limit(limit);

		return result.map((row) => ({
			id: row.id,
			name: row.name,
			parentId: row.parentId,
			createdAt: row.createdAt,
		}));
	},

	async getFolderById(id: string): Promise<Folder | null> {
		const db = await getDrizzleDb();
		const result = await db.select().from(folders).where(eq(folders.id, id));

		if (result.length === 0) return null;
		const row = result[0];
		return {
			id: row.id,
			name: row.name,
			parentId: row.parentId,
			createdAt: row.createdAt,
		};
	},

	async getFolderBreadcrumb(folderId: string): Promise<Folder[]> {
		const breadcrumb: Folder[] = [];
		let currentId: string | null = folderId;

		while (currentId) {
			const folder = await this.getFolderById(currentId);
			if (!folder) break;
			breadcrumb.unshift(folder);
			currentId = folder.parentId;
		}

		return breadcrumb;
	},

	async createFolder(
		id: string,
		name: string,
		parentId: string | null = null,
	): Promise<void> {
		const db = await getDrizzleDb();
		await db.insert(folders).values({
			id,
			name,
			parentId,
		});
	},

	async updateFolder(id: string, name: string): Promise<void> {
		const db = await getDrizzleDb();
		await db.update(folders).set({ name }).where(eq(folders.id, id));
	},

	async deleteFolder(id: string): Promise<void> {
		const db = await getDrizzleDb();
		// Note: We might want to move scripts to root or delete them.
		// For now, let's just delete the folder (Drizzle/DB might handle FKs if set).
		await db.delete(folders).where(eq(folders.id, id));
	},

	async getChildItemCountsForFolders(
		folderIds: string[],
	): Promise<Record<string, number>> {
		if (folderIds.length === 0) return {};
		const db = await getDrizzleDb();

		const result = await db
			.select({
				folderId: scripts.folderId,
				count: sql<number>`count(*)`,
			})
			.from(scripts)
			.where(inArray(scripts.folderId, folderIds))
			.groupBy(scripts.folderId);

		const counts: Record<string, number> = {};
		for (const row of result) {
			if (row.folderId) {
				counts[row.folderId] = row.count;
			}
		}
		return counts;
	},
};

export const {
	createFolder,
	deleteFolder,
	getAllFolders,
	getChildItemCountsForFolders,
	getFolderBreadcrumb,
	getFolderById,
	getRecentFolders,
} = folderQueries;

export async function getScriptCountInFolder(
	folderId: string | null,
): Promise<number> {
	const db = await getDrizzleDb();
	const result = await db
		.select({ count: sql<number>`count(*)` })
		.from(scripts)
		.where(
			folderId ? eq(scripts.folderId, folderId) : isNull(scripts.folderId),
		);

	return result[0]?.count ?? 0;
}
