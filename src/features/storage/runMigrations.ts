import { migrate } from "drizzle-orm/pglite/migrator";
import { getDrizzleDb } from "./pgliteClient";

export async function runMigrations() {
	const db = await getDrizzleDb();
	await migrate(db, { migrationsFolder: "./drizzle" });
}
