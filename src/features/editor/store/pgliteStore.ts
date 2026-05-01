import { eq, inArray, lte } from "drizzle-orm";
import {
	type DbTransaction,
	getDrizzleDb,
	initDb,
} from "@/features/storage/pgliteClient";
import {
	scriptContents,
	scriptDrafts,
	scripts,
} from "@/features/storage/schema";
import type { Script, ScriptMetadata } from "@/types/Script";

const DRAFT_TTL_HOURS = 24;

const initEditorDb = async () => {
	return await initDb();
};

export const pgliteStore = {
	async getLibraryListing(): Promise<ScriptMetadata[]> {
		await initEditorDb();
		const db = await getDrizzleDb();
		const result = await db
			.select({
				id: scripts.id,
				name: scripts.name,
				folderId: scripts.folderId,
				overview: scripts.overview,
				createdAt: scripts.createdAt,
				lastAccessedAt: scripts.lastAccessedAt,
			})
			.from(scripts);

		return result.map((row) => ({
			id: row.id,
			name: row.name,
			folderId: row.folderId,
			overview: row.overview,
			createdAt: row.createdAt,
			lastAccessedAt: row.lastAccessedAt,
		}));
	},

	async saveScript(script: Script): Promise<void> {
		await initEditorDb();
		const db = await getDrizzleDb();

		await db.transaction(async (tx: DbTransaction) => {
			await this.saveScriptTx(tx, script);
		});
	},

	async saveScripts(scriptsList: Script[]): Promise<void> {
		if (scriptsList.length === 0) return;
		await initEditorDb();
		const db = await getDrizzleDb();

		await db.transaction(async (tx: DbTransaction) => {
			for (const s of scriptsList) {
				await this.saveScriptTx(tx, s);
			}
		});
	},

	async saveScriptTx(tx: DbTransaction, script: Script): Promise<void> {
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

	async getScriptFull(id: string): Promise<Script | null> {
		await initEditorDb();
		const db = await getDrizzleDb();

		const result = await db
			.select()
			.from(scripts)
			.innerJoin(scriptContents, eq(scripts.id, scriptContents.scriptId))
			.where(eq(scripts.id, id))
			.limit(1);

		if (result.length === 0) return null;

		const row = result[0];
		return {
			id: row.scripts.id,
			name: row.scripts.name,
			overview: row.scripts.overview,
			html: row.script_contents.html,
			lines: row.script_contents.lines,
			groupName: row.scripts.groupName ?? undefined,
			label: row.scripts.label ?? undefined,
			folderId: row.scripts.folderId ?? undefined,
			createdAt: row.scripts.createdAt,
		};
	},

	async deleteScripts(ids: string[]): Promise<void> {
		if (ids.length === 0) return;
		await initEditorDb();
		const db = await getDrizzleDb();

		await db.transaction(async (tx: DbTransaction) => {
			await tx
				.delete(scriptContents)
				.where(inArray(scriptContents.scriptId, ids));
			await tx.delete(scripts).where(inArray(scripts.id, ids));
		});
	},

	async getAllDraftScripts(): Promise<ScriptMetadata[]> {
		await initEditorDb();
		const db = await getDrizzleDb();

		const result = await db
			.select({
				id: scriptDrafts.id,
				name: scriptDrafts.name,
				overview: scriptDrafts.overview,
				createdAt: scriptDrafts.createdAt,
				updatedAt: scriptDrafts.updatedAt,
			})
			.from(scriptDrafts);

		return result.map((row) => ({
			id: row.id,
			name: row.name,
			overview: row.overview,
			createdAt: row.createdAt,
			updatedAt: row.updatedAt,
		}));
	},

	async saveDraftScript(script: Script): Promise<void> {
		await initEditorDb();
		const db = await getDrizzleDb();
		await db.transaction(async (tx: DbTransaction) => {
			await this.saveDraftScriptTx(tx, script);
		});
	},

	async saveDraftScripts(scriptsList: Script[]): Promise<void> {
		if (scriptsList.length === 0) return;
		await initEditorDb();
		const db = await getDrizzleDb();
		await db.transaction(async (tx: DbTransaction) => {
			for (const s of scriptsList) {
				await this.saveDraftScriptTx(tx, s);
			}
		});
	},

	async saveDraftScriptTx(tx: DbTransaction, script: Script): Promise<void> {
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
					expiresAt,
					updatedAt: new Date(),
				},
			});
	},

	async deleteDraftScripts(ids: string[]): Promise<void> {
		if (ids.length === 0) return;
		await initEditorDb();
		const db = await getDrizzleDb();
		await db.delete(scriptDrafts).where(inArray(scriptDrafts.id, ids));
	},

	async cleanExpiredDrafts(): Promise<void> {
		await initEditorDb();
		const db = await getDrizzleDb();
		await db
			.delete(scriptDrafts)
			.where(lte(scriptDrafts.expiresAt, new Date()));
	},

	async promoteDraftsToScripts(
		ids: string[],
		folderId: string | null = null,
	): Promise<void> {
		if (ids.length === 0) return;
		await initEditorDb();
		const db = await getDrizzleDb();

		await db.transaction(async (tx: DbTransaction) => {
			const drafts = await tx
				.select()
				.from(scriptDrafts)
				.where(inArray(scriptDrafts.id, ids));

			for (const draft of drafts) {
				await this.saveScriptTx(tx, {
					id: draft.id,
					name: draft.name,
					html: draft.html,
					overview: draft.overview,
					lines: draft.lines,
					groupName: draft.groupName ?? undefined,
					label: draft.label ?? undefined,
					folderId: folderId ?? undefined,
					createdAt: draft.createdAt,
				});
			}

			await tx.delete(scriptDrafts).where(inArray(scriptDrafts.id, ids));
		});
	},
};
