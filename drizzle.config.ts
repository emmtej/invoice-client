import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/features/storage/schema.ts",
	out: "./src/features/storage/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: "idb://invoice-editor-db",
	},
});
