import { lazy } from "react";
import type { FeatureConfig } from "@/types/navigation";

export const authConfig: FeatureConfig = {
	routes: {
		public: [
			{
				label: "Login",
				path: "/login",
				component: lazy(() => import("@/pages/auth/AuthenticationPage")),
			},
			{
				label: "Register",
				path: "/register",
				component: lazy(() => import("@/pages/auth/AuthenticationPage")),
			},
		],
	},
};
