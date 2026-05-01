import type { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { runMigrations } from "./runMigrations";
import * as schema from "./schema";
import { usePgliteStore } from "./store/usePgliteStore";

export type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;
export type DbTransaction = Parameters<
	Parameters<DrizzleDb["transaction"]>[0]
>[0];

let client: PGlite | null = null;
let db: DrizzleDb | null = null;
/** Ensures only one PGlite.create runs; concurrent opens on the same idb:// URL abort WASM. */
let initPromise: Promise<PGlite> | null = null;
let schemaInitialized = false;

export const initDb = async () => {
	if (client && schemaInitialized) return client;

	if (!initPromise) {
		usePgliteStore.getState().setStatus("initializing");
		initPromise = (async () => {
			try {
				const { PGlite } = await import("@electric-sql/pglite");
				const c = (await PGlite.create({
					dataDir: "idb://invoice-editor-db",
				})) as PGlite;

				client = c;
				db = drizzle(c, { schema });

				// Initialize schemas if needed
				if (!schemaInitialized) {
					await runMigrations();
					schemaInitialized = true;
				}

				usePgliteStore.getState().setStatus("ready");
				return c;
			} catch (err) {
				usePgliteStore.getState().setStatus("error");
				throw err;
			}
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
	if (!db) db = drizzle(pgliteClient, { schema });

	return db;
};

export const getDbStatus = () => ({
	isInitializing: usePgliteStore.getState().status === "initializing",
	isReady: usePgliteStore.getState().status === "ready",
});

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
