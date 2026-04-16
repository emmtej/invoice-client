import { PGlite } from "@electric-sql/pglite";

export async function initSchema(db: PGlite): Promise<void> {
	// Drop existing tables for fresh start (Destructive Migration)
	await db.exec(`DROP TABLE IF EXISTS script_contents;`);
	await db.exec(`DROP TABLE IF EXISTS scripts;`);

	await db.exec(`
		CREATE TABLE IF NOT EXISTS folders (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			parent_id TEXT REFERENCES folders(id) ON DELETE CASCADE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
		);
	`);

	await db.exec(`
		CREATE TABLE IF NOT EXISTS scripts (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			overview JSONB NOT NULL,
			group_name TEXT,
			label TEXT,
			folder_id TEXT REFERENCES folders(id) ON DELETE CASCADE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
			last_accessed_at TIMESTAMP
		);
	`);

	await db.exec(`
		CREATE TABLE IF NOT EXISTS script_contents (
			script_id TEXT PRIMARY KEY REFERENCES scripts(id) ON DELETE CASCADE,
			html TEXT NOT NULL,
			lines JSONB NOT NULL
		);
	`);

	await db.exec(`
		CREATE TABLE IF NOT EXISTS script_drafts (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			html TEXT NOT NULL,
			overview JSONB NOT NULL,
			lines JSONB NOT NULL,
			group_name TEXT,
			label TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
			expires_at TIMESTAMP NOT NULL
		);
	`);

	await db.exec(`
		CREATE INDEX IF NOT EXISTS idx_script_drafts_expires_at ON script_drafts (expires_at);
	`);

	await db.exec(`
		CREATE INDEX IF NOT EXISTS idx_scripts_recency
			ON scripts (last_accessed_at DESC NULLS LAST, created_at DESC);
	`);

	await db.exec(`
		CREATE INDEX IF NOT EXISTS idx_folders_created_at ON folders (created_at DESC);
	`);

	await db.exec(`
		CREATE TABLE IF NOT EXISTS booth_sessions (
			id TEXT PRIMARY KEY,
			script_id TEXT NOT NULL,
			script_name TEXT NOT NULL,
			total_lines INTEGER DEFAULT 0 NOT NULL,
			completed_lines INTEGER DEFAULT 0 NOT NULL,
			elapsed_ms INTEGER DEFAULT 0 NOT NULL,
			status TEXT DEFAULT 'in_progress' NOT NULL,
			line_timings JSONB DEFAULT '[]' NOT NULL,
			started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
			completed_at TIMESTAMP
		);
	`);
}
