import { count, desc, eq, inArray, isNull, lte } from "drizzle-orm";
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
import type { ScriptSummary } from "@/features/storage/types";
import type { Script, ScriptMetadata, ScriptOverview } from "@/types/Script";

const DRAFT_TTL_HOURS = 24;

function mapToScriptSummary(row: {
	id: string;
	name: string;
	folderId: string | null;
	overview: ScriptOverview;
	createdAt: Date;
	lastAccessedAt: Date | null;
}): ScriptSummary {
	return {
		id: row.id,
		name: row.name,
		folderId: row.folderId ?? null,
		wordCount: row.overview.wordCount ?? 0,
		invalidLineCount: 0,
		createdAt: row.createdAt,
		lastAccessedAt: row.lastAccessedAt,
	};
}

export const scriptRepository = {
	/**
	 * Scripts (Main Library)
	 */

	async getAllScripts(): Promise<ScriptSummary[]> {
		await initDb();
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
			.from(scripts)
			.orderBy(desc(scripts.lastAccessedAt));

		return result.map(mapToScriptSummary);
	},

	async getScriptsInFolder(folderId: string | null): Promise<ScriptSummary[]> {
		await initDb();
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
			.from(scripts)
			.where(
				folderId ? eq(scripts.folderId, folderId) : isNull(scripts.folderId),
			)
			.orderBy(desc(scripts.lastAccessedAt));

		return result.map(mapToScriptSummary);
	},

	async getRecentScripts(limit = 10, offset = 0): Promise<ScriptSummary[]> {
		await initDb();
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
			.from(scripts)
			.orderBy(desc(scripts.lastAccessedAt))
			.limit(limit)
			.offset(offset);

		return result.map(mapToScriptSummary);
	},

	async getScriptsInFolderPaginated(
		folderId: string | null,
		limit = 10,
		offset = 0,
	): Promise<ScriptSummary[]> {
		await initDb();
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
			.from(scripts)
			.where(
				folderId ? eq(scripts.folderId, folderId) : isNull(scripts.folderId),
			)
			.orderBy(desc(scripts.lastAccessedAt))
			.limit(limit)
			.offset(offset);

		return result.map(mapToScriptSummary);
	},

	async countScriptsInFolder(folderId: string | null): Promise<number> {
		await initDb();
		const db = await getDrizzleDb();
		const [result] = await db
			.select({ value: count() })
			.from(scripts)
			.where(
				folderId ? eq(scripts.folderId, folderId) : isNull(scripts.folderId),
			);
		return result.value;
	},

	async countAllScripts(): Promise<number> {
		await initDb();
		const db = await getDrizzleDb();
		const [result] = await db.select({ value: count() }).from(scripts);
		return result.value;
	},

	async getScriptById(id: string): Promise<Script | null> {
		await initDb();
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

	async saveScript(script: Script): Promise<void> {
		await initDb();
		const db = await getDrizzleDb();
		await db.transaction(async (tx: DbTransaction) => {
			await this.saveScriptTx(tx, script);
		});
	},

	async saveScripts(scriptsList: Script[]): Promise<void> {
		if (scriptsList.length === 0) return;
		await initDb();
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
				lastAccessedAt: new Date(),
			})
			.onConflictDoUpdate({
				target: scripts.id,
				set: {
					name,
					overview,
					groupName: groupName ?? null,
					label: label ?? null,
					folderId: folderId ?? null,
					lastAccessedAt: new Date(),
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

	async deleteScripts(ids: string[]): Promise<void> {
		if (ids.length === 0) return;
		await initDb();
		const db = await getDrizzleDb();
		await db.transaction(async (tx: DbTransaction) => {
			await tx
				.delete(scriptContents)
				.where(inArray(scriptContents.scriptId, ids));
			await tx.delete(scripts).where(inArray(scripts.id, ids));
		});
	},

	async touchScript(id: string): Promise<void> {
		await initDb();
		const db = await getDrizzleDb();
		await db
			.update(scripts)
			.set({ lastAccessedAt: new Date() })
			.where(eq(scripts.id, id));
	},

	/**
	 * Script Drafts (Editor Autosave)
	 */

	async getAllDrafts(): Promise<ScriptMetadata[]> {
		await initDb();
		const db = await getDrizzleDb();
		const result = await db
			.select({
				id: scriptDrafts.id,
				name: scriptDrafts.name,
				overview: scriptDrafts.overview,
				groupName: scriptDrafts.groupName,
				label: scriptDrafts.label,
				createdAt: scriptDrafts.createdAt,
				updatedAt: scriptDrafts.updatedAt,
			})
			.from(scriptDrafts);

		return result.map((row) => ({
			id: row.id,
			name: row.name,
			overview: row.overview as ScriptOverview,
			groupName: row.groupName ?? undefined,
			label: row.label ?? undefined,
			folderId: null,
			createdAt: row.createdAt,
			lastAccessedAt: row.updatedAt,
		}));
	},

	async saveDraft(script: Script): Promise<void> {
		await initDb();
		const db = await getDrizzleDb();
		await db.transaction(async (tx: DbTransaction) => {
			await this.saveDraftTx(tx, script);
		});
	},

	async saveDraftTx(tx: DbTransaction, script: Script): Promise<void> {
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

	async deleteDrafts(ids: string[]): Promise<void> {
		if (ids.length === 0) return;
		await initDb();
		const db = await getDrizzleDb();
		await db.delete(scriptDrafts).where(inArray(scriptDrafts.id, ids));
	},

	async cleanExpiredDrafts(): Promise<void> {
		await initDb();
		const db = await getDrizzleDb();
		await db
			.delete(scriptDrafts)
			.where(lte(scriptDrafts.expiresAt, new Date()));
	},

	async promoteDrafts(
		ids: string[],
		folderId: string | null = null,
	): Promise<void> {
		if (ids.length === 0) return;
		await initDb();
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
