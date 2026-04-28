import HomePage from "@/pages/home/HomePage";
import type { FeatureConfig } from "@/types/navigation";

export const homeConfig: FeatureConfig = {
	routes: {
		public: [
			{
				label: "Home",
				path: "/",
				component: HomePage,
			},
		],
	},
};
