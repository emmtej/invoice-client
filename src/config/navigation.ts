import { type LucideIcon, Mic, Receipt, User, Wrench } from "lucide-react";
import { type ComponentType, lazy } from "react";

// Core components - Direct import for performance
import BoothPage from "@/pages/booth/BoothPage";
import EditorPage from "@/pages/editor/EditorPage";
import HomePage from "@/pages/home/HomePage";
import ScriptsPage from "@/pages/scripts/ScriptsPage";

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
					component: lazy(() => import("@/pages/invoice/InvoicePage")),
				},
				{
					label: "Presets",
					path: "/invoice/presets",
					component: lazy(() => import("@/pages/invoice/PresetsPage")),
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
			component: lazy(() => import("@/pages/auth/AuthenticationPage")),
			hideInSidebar: true,
		},
		{
			label: "Register",
			path: "/register",
			component: lazy(() => import("@/pages/auth/AuthenticationPage")),
			hideInSidebar: true,
		},
	] as NavItem[],

	protected: [
		{
			label: "Dashboard",
			path: "/dashboard",
			component: lazy(() => import("@/pages/user/DashboardPage")),
			hideInSidebar: true,
		},
		{
			label: "Profile",
			path: "/profile",
			icon: User,
			component: lazy(() => import("@/pages/user/ProfilePage")),
		},
	] as NavItem[],
};
