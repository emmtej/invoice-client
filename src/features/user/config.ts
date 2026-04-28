import { User } from "lucide-react";
import { lazy } from "react";
import type { FeatureConfig } from "@/types/navigation";

export const userConfig: FeatureConfig = {
	routes: {
		protected: [
			{
				label: "Dashboard",
				path: "/dashboard",
				component: lazy(() => import("@/pages/user/DashboardPage")),
			},
			{
				label: "Profile",
				path: "/profile",
				component: lazy(() => import("@/pages/user/ProfilePage")),
			},
		],
	},
	menu: [
		{
			label: "Profile",
			path: "/profile",
			icon: User,
		},
	],
};
