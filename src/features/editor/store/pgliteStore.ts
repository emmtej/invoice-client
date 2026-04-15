import { desc, eq, inArray, lte } from "drizzle-orm";
import * as folderQueries from "@/features/storage/folderQueries";
import { getDrizzleDb, initDb } from "@/features/storage/pgliteClient";
import { scriptDrafts, scripts } from "@/features/storage/schema";
import type { Script } from "@/types/Script";

let editorSchemaReady = false;
const DRAFT_TTL_HOURS = 24;

export const initEditorDb = async () => {
	if (editorSchemaReady) return await initDb();

	await folderQueries.initSchema();

	editorSchemaReady = true;
	return await initDb();
};

export const pgliteStore = {
	async getAllScripts(): Promise<Script[]> {
		await initEditorDb();
		const db = await getDrizzleDb();
		const result = await db
			.select()
			.from(scripts)
			.orderBy(desc(scripts.createdAt));

		return result.map((row) => ({
			...row,
			groupName: row.groupName ?? undefined,
			label: row.label ?? undefined,
			folderId: row.folderId ?? null,
			source: document.implementation.createHTMLDocument(),
		}));
	},

	async saveScript(script: Script): Promise<void> {
		await initEditorDb();
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

	async saveScripts(scriptsList: Script[]): Promise<void> {
		for (const script of scriptsList) {
			await this.saveScript(script);
		}
	},

	async deleteScript(id: string): Promise<void> {
		await initEditorDb();
		const db = await getDrizzleDb();
		await db.delete(scripts).where(eq(scripts.id, id));
	},

	async deleteScripts(ids: string[]): Promise<void> {
		await initEditorDb();
		const db = await getDrizzleDb();
		await db.delete(scripts).where(inArray(scripts.id, ids));
	},

	async clearAll(): Promise<void> {
		await initEditorDb();
		const db = await getDrizzleDb();
		await db.delete(scripts);
	},

	async deleteExpiredDrafts(): Promise<void> {
		await initEditorDb();
		const db = await getDrizzleDb();
		await db
			.delete(scriptDrafts)
			.where(lte(scriptDrafts.expiresAt, new Date()));
	},

	async getAllDraftScripts(): Promise<Script[]> {
		await this.deleteExpiredDrafts();
		const db = await getDrizzleDb();
		const result = await db
			.select()
			.from(scriptDrafts)
			.orderBy(desc(scriptDrafts.updatedAt));

		return result.map((row) => ({
			...row,
			groupName: row.groupName ?? undefined,
			label: row.label ?? undefined,
			source: document.implementation.createHTMLDocument(),
		}));
	},

	async saveDraftScript(script: Script): Promise<void> {
		await initEditorDb();
		const db = await getDrizzleDb();
		const { id, name, html, overview, lines, groupName, label } = script;

		const expiresAt = new Date();
		expiresAt.setHours(expiresAt.getHours() + DRAFT_TTL_HOURS);

		await db
			.insert(scriptDrafts)
			.values({
				id,
				name,
				html,
				overview,
				lines,
				groupName: groupName ?? null,
				label: label ?? null,
				expiresAt,
			})
			.onConflictDoUpdate({
				target: scriptDrafts.id,
				set: {
					name,
					html,
					overview,
					lines,
					groupName: groupName ?? null,
					label: label ?? null,
					updatedAt: new Date(),
					expiresAt,
				},
			});
	},

	async saveDraftScripts(scriptsList: Script[]): Promise<void> {
		for (const script of scriptsList) {
			await this.saveDraftScript(script);
		}
	},

	async deleteDraftScript(id: string): Promise<void> {
		await initEditorDb();
		const db = await getDrizzleDb();
		await db.delete(scriptDrafts).where(eq(scriptDrafts.id, id));
	},

	async deleteDraftScripts(ids: string[]): Promise<void> {
		await initEditorDb();
		const db = await getDrizzleDb();
		await db.delete(scriptDrafts).where(inArray(scriptDrafts.id, ids));
	},

	async clearAllDrafts(): Promise<void> {
		await initEditorDb();
		const db = await getDrizzleDb();
		await db.delete(scriptDrafts);
	},

	async promoteDraftsToScripts(
		ids: string[],
		folderId: string | null,
	): Promise<void> {
		if (ids.length === 0) return;
		await initEditorDb();
		const db = await getDrizzleDb();
		await this.deleteExpiredDrafts();

		await db.transaction(async (tx) => {
			for (const id of ids) {
				const [draft] = await tx
					.select()
					.from(scriptDrafts)
					.where(eq(scriptDrafts.id, id));

				if (draft) {
					await tx
						.insert(scripts)
						.values({
							id: draft.id,
							name: draft.name,
							html: draft.html,
							overview: draft.overview,
							lines: draft.lines,
							groupName: draft.groupName,
							label: draft.label,
							folderId: folderId ?? null,
						})
						.onConflictDoUpdate({
							target: scripts.id,
							set: {
								name: draft.name,
								html: draft.html,
								overview: draft.overview,
								lines: draft.lines,
								groupName: draft.groupName,
								label: draft.label,
								folderId: folderId ?? null,
							},
						});
				}
			}
			await tx.delete(scriptDrafts).where(inArray(scriptDrafts.id, ids));
		});
	},
};
