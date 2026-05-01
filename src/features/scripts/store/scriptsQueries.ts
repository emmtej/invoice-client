import { count, desc, eq, inArray, isNull } from "drizzle-orm";
import {
	type DbTransaction,
	getDrizzleDb,
	initDb,
} from "@/features/storage/pgliteClient";
import { scriptContents, scripts } from "@/features/storage/schema";
import type { ScriptSummary } from "@/features/storage/types";
import type { Script } from "@/types/Script";

function mapToScriptSummary(row: {
	id: string;
	name: string;
	folderId: string | null;
	overview: {
		totalLines: number;
		characterCount: number;
		wordCount: number;
		estimatedReadingTime: string;
	};
	createdAt: Date;
	lastAccessedAt: Date | null;
}): ScriptSummary {
	return {
		id: row.id,
		name: row.name,
		folderId: row.folderId ?? null,
		wordCount: row.overview.wordCount ?? 0,
		invalidLineCount: 0, // Not stored in DB meta currently
		createdAt: row.createdAt,
		lastAccessedAt: row.lastAccessedAt,
	};
}

export const scriptsQueries = {
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
		const db = await getDrizzleDb();
		const [result] = await db.select({ value: count() }).from(scripts);
		return result.value;
	},

	async getScriptById(id: string): Promise<Script | null> {
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
		const db = await getDrizzleDb();

		await db.transaction(async (tx: DbTransaction) => {
			await this.saveScriptTx(tx, script);
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
		const db = await getDrizzleDb();

		await db.transaction(async (tx: DbTransaction) => {
			await tx
				.delete(scriptContents)
				.where(inArray(scriptContents.scriptId, ids));
			await tx.delete(scripts).where(inArray(scripts.id, ids));
		});
	},

	async touchScript(id: string): Promise<void> {
		const db = await getDrizzleDb();
		await db
			.update(scripts)
			.set({ lastAccessedAt: new Date() })
			.where(eq(scripts.id, id));
	},

	async saveScripts(scriptsList: Script[]): Promise<void> {
		if (scriptsList.length === 0) return;
		const db = await getDrizzleDb();

		await db.transaction(async (tx: DbTransaction) => {
			for (const script of scriptsList) {
				await this.saveScriptTx(tx, script);
			}
		});
	},
};
