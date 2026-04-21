import { type LucideIcon, Mic, Receipt, User, Wrench } from "lucide-react";
import { type ComponentType, lazy } from "react";

// Core components - Direct import for performance
import BoothPage from "@/features/booth";
import EditorPage from "@/features/editor";
import HomePage from "@/features/home";
import ScriptsPage from "@/features/scripts";

export interface NavChild {
	label: string;
	path: string;
	component: ComponentType;
}

export interface NavItem {
	label: string;
	path?: string;
	icon?: LucideIcon; // Exact type for Lucide
	component?: ComponentType;
	initiallyOpened?: boolean;
	hideInSidebar?: boolean;
	children?: NavChild[];
}

export const NAVIGATION = {
	public: [
		{
			label: "Home",
			path: "/",
			component: HomePage,
			hideInSidebar: true,
		},
		{
			label: "Booth",
			path: "/booth",
			icon: Mic,
			component: BoothPage,
		},
		{
			label: "Invoices",
			icon: Receipt,
			initiallyOpened: true,
			children: [
				{
					label: "New Invoice",
					path: "/invoice",
					component: lazy(() =>
						import("@/features/invoice").then((m) => ({
							default: m.InvoicePage,
						})),
					),
				},
				{
					label: "Presets",
					path: "/invoice/presets",
					component: lazy(() =>
						import("@/features/invoice").then((m) => ({
							default: m.PresetsPage,
						})),
					),
				},
			],
		},
		{
			label: "Tools",
			icon: Wrench,
			initiallyOpened: true,
			children: [
				{
					label: "Scripts",
					path: "/scripts",
					component: ScriptsPage,
				},
				{
					label: "Editor",
					path: "/editor",
					component: EditorPage,
				},
			],
		},
		{
			label: "Login",
			path: "/login",
			component: lazy(() => import("@/features/auth")),
			hideInSidebar: true,
		},
		{
			label: "Register",
			path: "/register",
			component: lazy(() => import("@/features/auth")),
			hideInSidebar: true,
		},
	] as NavItem[],

	protected: [
		{
			label: "Dashboard",
			path: "/dashboard",
			component: lazy(() =>
				import("@/features/user").then((m) => ({ default: m.DashboardPage })),
			),
			hideInSidebar: true,
		},
		{
			label: "Profile",
			path: "/profile",
			icon: User,
			component: lazy(() =>
				import("@/features/user").then((m) => ({ default: m.ProfilePage })),
			),
		},
	] as NavItem[],
};
