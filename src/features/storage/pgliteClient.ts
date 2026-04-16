import { drizzle } from "drizzle-orm/pglite";
import type { PGlite } from "@electric-sql/pglite";
import { initSchema } from "./initSchema";
import * as schema from "./schema";

let client: PGlite | null = null;
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;
/** Ensures only one PGlite.create runs; concurrent opens on the same idb:// URL abort WASM. */
let initPromise: Promise<PGlite> | null = null;
let schemaInitialized = false;

export const initDb = async () => {
	if (client && schemaInitialized) return client;

	if (!initPromise) {
		initPromise = (async () => {
			const { PGlite } = await import("@electric-sql/pglite");
			const c = (await PGlite.create({
				dataDir: "idb://invoice-editor-db",
			})) as PGlite;

			// Initialize schemas if needed
			if (!schemaInitialized) {
				await initSchema(c);
				schemaInitialized = true;
			}

			client = c;
			return c;
		})().catch((err) => {
			initPromise = null;
			throw err;
		});
	}

	return initPromise;
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
	initPromise = null;
};
