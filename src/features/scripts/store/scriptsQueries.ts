import { asc, eq, inArray, isNull } from "drizzle-orm";
import { initSchema } from "@/features/storage/folderQueries";
import { getDrizzleDb } from "@/features/storage/pgliteClient";
import { scripts } from "@/features/storage/schema";
import type { ScriptSummary } from "@/features/storage/types";
import type { Script } from "@/types/Script";

export const scriptsQueries = {
	async getAllScripts(): Promise<ScriptSummary[]> {
		await initSchema();
		const db = await getDrizzleDb();
		const result = await db.select().from(scripts).orderBy(asc(scripts.name));

		return result.map((row) => ({
			id: row.id,
			name: row.name,
			folderId: row.folderId,
			wordCount: row.overview.wordCount ?? 0,
			invalidLineCount: row.overview.invalidLines?.length ?? 0,
			createdAt: row.createdAt,
		}));
	},

	async getScriptsInFolder(folderId: string | null): Promise<ScriptSummary[]> {
		const db = await getDrizzleDb();
		const result = await db
			.select()
			.from(scripts)
			.where(
				folderId ? eq(scripts.folderId, folderId) : isNull(scripts.folderId),
			)
			.orderBy(asc(scripts.name));

		return result.map((row) => ({
			id: row.id,
			name: row.name,
			folderId: row.folderId,
			wordCount: row.overview.wordCount ?? 0,
			invalidLineCount: row.overview.invalidLines?.length ?? 0,
			createdAt: row.createdAt,
		}));
	},

	async getScriptById(id: string): Promise<Script | null> {
		const db = await getDrizzleDb();
		const [row] = await db.select().from(scripts).where(eq(scripts.id, id));

		if (!row) return null;

		return {
			...row,
			groupName: row.groupName ?? undefined,
			label: row.label ?? undefined,
			folderId: row.folderId ?? null,
			source: document.implementation.createHTMLDocument(),
		};
	},

	async deleteScript(id: string): Promise<void> {
		const db = await getDrizzleDb();
		await db.delete(scripts).where(eq(scripts.id, id));
	},

	async moveScripts(
		ids: string[],
		targetFolderId: string | null,
	): Promise<void> {
		const db = await getDrizzleDb();
		await db
			.update(scripts)
			.set({ folderId: targetFolderId })
			.where(inArray(scripts.id, ids));
	},

	async duplicateScript(id: string, newId: string): Promise<void> {
		const db = await getDrizzleDb();
		const [row] = await db.select().from(scripts).where(eq(scripts.id, id));

		if (!row) return;

		await db.insert(scripts).values({
			...row,
			id: newId,
			name: `${row.name} (Copy)`,
			createdAt: new Date(),
		});
	},

	async saveScript(script: Script): Promise<void> {
		const db = await getDrizzleDb();
		const { id, name, html, overview, lines, groupName, label, folderId } =
			script;

		await db
			.insert(scripts)
			.values({
				id,
				name,
				html,
				overview,
				lines,
				groupName: groupName ?? null,
				label: label ?? null,
				folderId: folderId ?? null,
			})
			.onConflictDoUpdate({
				target: scripts.id,
				set: {
					name,
					html,
					overview,
					lines,
					groupName: groupName ?? null,
					label: label ?? null,
					folderId: folderId ?? null,
				},
			});
	},
};
