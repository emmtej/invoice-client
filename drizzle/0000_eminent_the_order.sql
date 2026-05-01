CREATE TABLE "booth_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"script_id" text NOT NULL,
	"script_name" text NOT NULL,
	"total_lines" integer DEFAULT 0 NOT NULL,
	"completed_lines" integer DEFAULT 0 NOT NULL,
	"elapsed_ms" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"line_timings" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "folders" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"parent_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "script_contents" (
	"script_id" text PRIMARY KEY NOT NULL,
	"html" text NOT NULL,
	"lines" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "script_drafts" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"html" text NOT NULL,
	"overview" jsonb NOT NULL,
	"lines" jsonb NOT NULL,
	"group_name" text,
	"label" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scripts" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"overview" jsonb NOT NULL,
	"group_name" text,
	"label" text,
	"folder_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_accessed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "folders" ADD CONSTRAINT "folders_parent_id_folders_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "script_contents" ADD CONSTRAINT "script_contents_script_id_scripts_id_fk" FOREIGN KEY ("script_id") REFERENCES "public"."scripts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scripts" ADD CONSTRAINT "scripts_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_script_drafts_expires_at" ON "script_drafts" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_scripts_recency" ON "scripts" USING btree ("last_accessed_at","created_at");