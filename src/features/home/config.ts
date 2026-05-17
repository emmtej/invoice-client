import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Pencil, Receipt, User } from "lucide-react";
import type { FeatureConfig } from "@/types/navigation";

export const homeConfig: FeatureConfig = {};

export type HomeTool = {
	title: string;
	description: string;
	icon: LucideIcon;
	to: string;
	color: "on-air-red" | "brand-dark" | "studio";
};

export const HOME_TOOLS: HomeTool[] = [
	{
		title: "Script Editor",
		description: "Parse scripts and track dialogue",
		icon: Pencil,
		to: "/editor",
		color: "on-air-red",
	},
	{
		title: "Invoices",
		description: "Build and export invoice lines",
		icon: Receipt,
		to: "/invoice",
		color: "on-air-red",
	},
	{
		title: "Dashboard",
		description: "Your hub for recent activity",
		icon: LayoutDashboard,
		to: "/dashboard",
		color: "brand-dark",
	},
	{
		title: "Profile",
		description: "Account and defaults",
		icon: User,
		to: "/profile",
		color: "studio",
	},
];

export const BENTO_SECTION_COPY = {
	eyebrow: "Core Capabilities",
	description:
		"Whether you're recording from a home booth or a studio session, InVoice keeps your script data and invoice math aligned.",
} as const;

export const FEATURES_SECTION_COPY = {
	title: "Ready to start?",
	description: "Jump straight into your local-first workflow.",
} as const;
