import { relations } from "drizzle-orm";
import {
	type AnyPgColumn,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import type { ParsedLine, ScriptOverview } from "@/types/Script";
import type { LineTimingEntry } from "./types";

export const folders = pgTable("folders", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	parentId: text("parent_id").references((): AnyPgColumn => folders.id, {
		onDelete: "cascade",
	}),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const foldersRelations = relations(folders, ({ one, many }) => ({
	parent: one(folders, {
		fields: [folders.parentId],
		references: [folders.id],
		relationName: "folder_parent",
	}),
	subfolders: many(folders, {
		relationName: "folder_parent",
	}),
	scripts: many(scripts),
}));

export const scripts = pgTable("scripts", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	html: text("html").notNull(),
	overview: jsonb("overview").$type<ScriptOverview>().notNull(),
	lines: jsonb("lines").$type<ParsedLine[]>().notNull(),
	groupName: text("group_name"),
	label: text("label"),
	folderId: text("folder_id").references(() => folders.id, {
		onDelete: "cascade",
	}),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scriptsRelations = relations(scripts, ({ one }) => ({
	folder: one(folders, {
		fields: [scripts.folderId],
		references: [folders.id],
	}),
}));

export const scriptDrafts = pgTable(
	"script_drafts",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		html: text("html").notNull(),
		overview: jsonb("overview").$type<ScriptOverview>().notNull(),
		lines: jsonb("lines").$type<ParsedLine[]>().notNull(),
		groupName: text("group_name"),
		label: text("label"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
		expiresAt: timestamp("expires_at").notNull(),
	},
	(table) => [index("idx_script_drafts_expires_at").on(table.expiresAt)],
);

export const boothSessions = pgTable("booth_sessions", {
	id: text("id").primaryKey(),
	scriptId: text("script_id").notNull(),
	scriptName: text("script_name").notNull(),
	totalLines: integer("total_lines").default(0).notNull(),
	completedLines: integer("completed_lines").default(0).notNull(),
	elapsedMs: integer("elapsed_ms").default(0).notNull(),
	status: text("status")
		.$type<"in_progress" | "completed" | "abandoned">()
		.default("in_progress")
		.notNull(),
	lineTimings: jsonb("line_timings")
		.$type<LineTimingEntry[]>()
		.default([])
		.notNull(),
	startedAt: timestamp("started_at").defaultNow().notNull(),
	completedAt: timestamp("completed_at"),
});
