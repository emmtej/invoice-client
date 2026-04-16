import { asc, count, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { getDrizzleDb, initDb } from "@/features/storage/pgliteClient";
import { scriptContents, scripts } from "@/features/storage/schema";
import type { ScriptSummary } from "@/features/storage/types";
import type { Script } from "@/types/Script";

function mapToScriptSummary(row: {
	id: string;
	name: string;
	folderId: string | null;
	overview: { wordCount?: number; invalidLines?: number[] };
	createdAt: Date;
	lastAccessedAt: Date | null;
}): ScriptSummary {
	return {
		id: row.id,
		name: row.name,
		folderId: row.folderId ?? null,
		wordCount: row.overview.wordCount ?? 0,
		invalidLineCount: row.overview.invalidLines?.length ?? 0,
		createdAt: row.createdAt,
		lastAccessedAt: row.lastAccessedAt ?? null,
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
			.orderBy(asc(scripts.name));
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
			.orderBy(asc(scripts.name));
		return result.map(mapToScriptSummary);
	},

	async getRecentScripts(
		limit: number,
		offset: number,
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
			.orderBy(
				sql`COALESCE(${scripts.lastAccessedAt}, ${scripts.createdAt}) DESC`,
				desc(scripts.createdAt),
				desc(scripts.id),
			)
			.limit(limit)
			.offset(offset);
		return result.map(mapToScriptSummary);
	},

	async getScriptsInFolderPaginated(
		folderId: string | null,
		limit: number,
		offset: number,
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
			.orderBy(
				sql`COALESCE(${scripts.lastAccessedAt}, ${scripts.createdAt}) DESC`,
				desc(scripts.createdAt),
				desc(scripts.id),
			)
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
		return result?.value ?? 0;
	},

	async countAllScripts(): Promise<number> {
		const db = await getDrizzleDb();
		const [result] = await db.select({ value: count() }).from(scripts);
		return result?.value ?? 0;
	},

	async touchScript(id: string): Promise<void> {
		const db = await getDrizzleDb();
		await db
			.update(scripts)
			.set({ lastAccessedAt: new Date() })
			.where(eq(scripts.id, id));
	},

	async getScriptById(id: string): Promise<Script | null> {
		const db = await getDrizzleDb();
		const [row] = await db
			.select()
			.from(scripts)
			.innerJoin(scriptContents, eq(scripts.id, scriptContents.scriptId))
			.where(eq(scripts.id, id));

		if (!row) return null;

		return {
			...row.scripts,
			...row.script_contents,
			groupName: row.scripts.groupName ?? undefined,
			label: row.scripts.label ?? undefined,
			folderId: row.scripts.folderId ?? null,
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
		const [row] = await db
			.select()
			.from(scripts)
			.innerJoin(scriptContents, eq(scripts.id, scriptContents.scriptId))
			.where(eq(scripts.id, id));

		if (!row) return;

		await db.transaction(async (tx) => {
			await tx.insert(scripts).values({
				...row.scripts,
				id: newId,
				name: `${row.scripts.name} (Copy)`,
				createdAt: new Date(),
				lastAccessedAt: null,
			});
			await tx.insert(scriptContents).values({
				...row.script_contents,
				scriptId: newId,
			});
		});
	},

	async saveScript(script: Script): Promise<void> {
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
		const db = await getDrizzleDb();

		await db.transaction(async (tx) => {
			for (const script of scriptsList) {
				await this.saveScriptTx(tx, script);
			}
		});
	},
};
