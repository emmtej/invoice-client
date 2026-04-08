let db: any = null;

export const initDb = async () => {
	if (db) return db;

	const { PGlite } = await import("@electric-sql/pglite");
	db = await PGlite.create({ dataDir: "idb://invoice-editor-db" });

	return db;
};

export const getDb = () => {
	if (!db) throw new Error("Database not initialized. Call initDb() first.");
	return db;
};

export const resetDb = () => {
	db = null;
};
