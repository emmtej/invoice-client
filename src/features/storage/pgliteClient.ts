import type { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema";

let client: PGlite | null = null;
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export const initDb = async () => {
	if (client) return client;

	const { PGlite } = await import("@electric-sql/pglite");
	client = (await PGlite.create({
		dataDir: "idb://invoice-editor-db",
	})) as PGlite;

	return client;
};

export const getDrizzleDb = async () => {
	if (db) return db;

	const pgliteClient = await initDb();
	db = drizzle(pgliteClient, { schema });

	return db;
};

export const getDb = () => {
	if (!client)
		throw new Error("Database not initialized. Call initDb() first.");
	return client;
};

export const resetDb = () => {
	client = null;
	db = null;
};
