import ScriptsPage from "@/pages/scripts/ScriptsPage";
import type { FeatureConfig } from "@/types/navigation";

export const scriptsConfig: FeatureConfig = {
	routes: {
		public: [
			{
				label: "Scripts",
				path: "/scripts",
				component: ScriptsPage,
			},
		],
	},
};
