import { desc, eq } from "drizzle-orm";
import { getDrizzleDb, initDb } from "@/features/storage/pgliteClient";
import { boothSessions } from "@/features/storage/schema";
import type { LineTimingEntry } from "@/features/storage/types";

export interface BoothSession {
	id: string;
	scriptId: string;
	scriptName: string;
	totalLines: number;
	completedLines: number;
	elapsedMs: number;
	status: "in_progress" | "completed" | "abandoned";
	lineTimings: LineTimingEntry[];
	startedAt: string;
	completedAt: string | null;
}

async function initBoothSchema(): Promise<void> {
	await initDb();
}

export const boothQueries = {
	async init(): Promise<void> {
		await initBoothSchema();
	},

	async createSession(
		session: Pick<
			BoothSession,
			"id" | "scriptId" | "scriptName" | "totalLines"
		>,
	): Promise<void> {
		await initBoothSchema();
		const db = await getDrizzleDb();
		await db.insert(boothSessions).values({
			id: session.id,
			scriptId: session.scriptId,
			scriptName: session.scriptName,
			totalLines: session.totalLines,
			status: "in_progress",
			lineTimings: [],
		});
	},

	async updateSession(
		id: string,
		updates: {
			completedLines: number;
			elapsedMs: number;
			lineTimings: LineTimingEntry[];
		},
	): Promise<void> {
		await initBoothSchema();
		const db = await getDrizzleDb();
		await db
			.update(boothSessions)
			.set({
				completedLines: updates.completedLines,
				elapsedMs: updates.elapsedMs,
				lineTimings: updates.lineTimings,
			})
			.where(eq(boothSessions.id, id));
	},

	async completeSession(
		id: string,
		final: {
			completedLines: number;
			elapsedMs: number;
			lineTimings: LineTimingEntry[];
		},
	): Promise<void> {
		await initBoothSchema();
		const db = await getDrizzleDb();
		await db
			.update(boothSessions)
			.set({
				status: "completed",
				completedLines: final.completedLines,
				elapsedMs: final.elapsedMs,
				lineTimings: final.lineTimings,
				completedAt: new Date(),
			})
			.where(eq(boothSessions.id, id));
	},

	async abandonSession(id: string): Promise<void> {
		await initBoothSchema();
		const db = await getDrizzleDb();
		await db
			.update(boothSessions)
			.set({
				status: "abandoned",
				completedAt: new Date(),
			})
			.where(eq(boothSessions.id, id));
	},

	async getAllSessions(): Promise<BoothSession[]> {
		await initBoothSchema();
		const db = await getDrizzleDb();
		const result = await db
			.select()
			.from(boothSessions)
			.orderBy(desc(boothSessions.startedAt));

		return result.map((row) => ({
			...row,
			startedAt: row.startedAt.toISOString(),
			completedAt: row.completedAt ? row.completedAt.toISOString() : null,
		}));
	},

	async deleteSession(id: string): Promise<void> {
		const db = await getDrizzleDb();
		await db.delete(boothSessions).where(eq(boothSessions.id, id));
	},
};
