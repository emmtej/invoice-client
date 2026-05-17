import type { LucideIcon } from "lucide-react";
import {
	Activity,
	FileText,
	LayoutDashboard,
	Mic,
	Pencil,
	Receipt,
	User,
} from "lucide-react";
import type { FeatureConfig } from "@/types/navigation";

export const homeConfig: FeatureConfig = {};

export type HomeToolPriority = "primary" | "secondary";

export type HomeTool = {
	title: string;
	description: string;
	icon: LucideIcon;
	to: string;
	color: "red" | "gray" | "blue";
	priority: HomeToolPriority;
};

export const HOME_TOOLS: HomeTool[] = [
	{
		title: "Script Editor",
		description: "Parse scripts and track dialogue",
		icon: Pencil,
		to: "/editor",
		color: "red",
		priority: "primary",
	},
	{
		title: "Invoices",
		description: "Build and export invoice lines",
		icon: Receipt,
		to: "/invoice",
		color: "red",
		priority: "primary",
	},
	{
		title: "Dashboard",
		description: "Your hub for recent activity",
		icon: LayoutDashboard,
		to: "/dashboard",
		color: "gray",
		priority: "secondary",
	},
	{
		title: "Profile",
		description: "Account and defaults",
		icon: User,
		to: "/profile",
		color: "blue",
		priority: "secondary",
	},
];

export const FEATURES_SECTION_COPY = {
	title: "Ready to start?",
	description: "Open a tool and stay in your local workflow.",
} as const;

export const CAPABILITIES_SECTION_COPY = {
	eyebrow: "Studio workflow",
	title: "From script to sent invoice.",
	description:
		"Parse dialogue, track sessions, and ship line items your clients can read without spreadsheet gymnastics.",
} as const;

export type CapabilityRowId = "billing" | "workflow" | "export";

export type CapabilityRow = {
	id: CapabilityRowId;
	title: string;
	body: string;
	icon: LucideIcon;
};

export const CAPABILITY_ROWS: CapabilityRow[] = [
	{
		id: "billing",
		title: "Built for voice talent",
		body: "Line-item invoicing tuned for sessions, pickups, and script-based word counts so booth time maps cleanly to billable lines.",
		icon: Mic,
	},
	{
		id: "workflow",
		title: "Script-aware workflow",
		body: "Parse and review scripts in one place, then flow dialogue counts straight into invoice items without retyping.",
		icon: Activity,
	},
	{
		id: "export",
		title: "Calm desk, clear exports",
		body: "A distraction-free workspace plus client-ready PDF summaries you can hand to accounting when the session wraps.",
		icon: FileText,
	},
];

export const SCROLL_PEEK_COPY = {
	label: "How it works",
	peekTitle: CAPABILITIES_SECTION_COPY.title,
} as const;
