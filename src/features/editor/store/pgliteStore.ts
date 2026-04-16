import { desc, eq, inArray, lte } from "drizzle-orm";
import { getDrizzleDb, initDb } from "@/features/storage/pgliteClient";
import { scriptContents, scriptDrafts, scripts } from "@/features/storage/schema";
import type { Script, ScriptMetadata } from "@/types/Script";

const DRAFT_TTL_HOURS = 24;

export const initEditorDb = async () => {
	return await initDb();
};

export const pgliteStore = {
	async getLibraryListing(): Promise<ScriptMetadata[]> {
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
		}));
	},

	async getScriptFull(id: string): Promise<Script | null> {
		await initEditorDb();
		const db = await getDrizzleDb();
		const [result] = await db
			.select()
			.from(scripts)
			.innerJoin(scriptContents, eq(scripts.id, scriptContents.scriptId))
			.where(eq(scripts.id, id));

		if (!result) return null;

		return {
			...result.scripts,
			...result.script_contents,
			groupName: result.scripts.groupName ?? undefined,
			label: result.scripts.label ?? undefined,
			folderId: result.scripts.folderId ?? null,
			source: document.implementation.createHTMLDocument(),
		};
	},

	async saveScript(script: Script): Promise<void> {
		await initEditorDb();
		const db = await getDrizzleDb();
		await db.transaction(async (tx) => {
			await this.saveScriptTx(tx, script);
		});
	},

	async saveScriptTx(tx: any, script: Script): Promise<void> {
		const { id, name, html, overview, lines, groupName, label, folderId } =
			script;

		await tx
			.insert(scripts)
			.values({
				id,
				name,
				overview,
				groupName: groupName ?? null,
				label: label ?? null,
				folderId: folderId ?? null,
			})
			.onConflictDoUpdate({
				target: scripts.id,
				set: {
					name,
					overview,
					groupName: groupName ?? null,
					label: label ?? null,
					folderId: folderId ?? null,
				},
			});

		await tx
			.insert(scriptContents)
			.values({
				scriptId: id,
				html,
				lines,
			})
			.onConflictDoUpdate({
				target: scriptContents.scriptId,
				set: {
					html,
					lines,
				},
			});
	},

	async saveScripts(scriptsList: Script[]): Promise<void> {
		if (scriptsList.length === 0) return;
		await initEditorDb();
		const db = await getDrizzleDb();

		await db.transaction(async (tx) => {
			for (const script of scriptsList) {
				await this.saveScriptTx(tx, script);
			}
		});
	},

	async deleteScript(id: string): Promise<void> {
		await initEditorDb();
		const db = await getDrizzleDb();
		// Cascade delete handles script_contents
		await db.delete(scripts).where(eq(scripts.id, id));
	},

	async deleteScripts(ids: string[]): Promise<void> {
		await initEditorDb();
		const db = await getDrizzleDb();
		// Cascade delete handles script_contents
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
		await this.saveDraftScriptTx(db, script);
	},

	async saveDraftScriptTx(tx: any, script: Script): Promise<void> {
		const { id, name, html, overview, lines, groupName, label } = script;

		const expiresAt = new Date();
		expiresAt.setHours(expiresAt.getHours() + DRAFT_TTL_HOURS);

		await tx
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
		if (scriptsList.length === 0) return;
		await initEditorDb();
		const db = await getDrizzleDb();

		await db.transaction(async (tx) => {
			for (const script of scriptsList) {
				await this.saveDraftScriptTx(tx, script);
			}
		});
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
					await this.saveScriptTx(tx, {
						...draft,
						groupName: draft.groupName ?? undefined,
						label: draft.label ?? undefined,
						folderId,
						source: document.implementation.createHTMLDocument(),
					});
				}
			}
			await tx.delete(scriptDrafts).where(inArray(scriptDrafts.id, ids));
		});
	},
};
