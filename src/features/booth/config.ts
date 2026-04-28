import { Mic } from "lucide-react";
import BoothPage from "@/pages/booth/BoothPage";
import type { FeatureConfig } from "@/types/navigation";

export const boothConfig: FeatureConfig = {
	routes: {
		public: [
			{
				label: "Booth",
				path: "/booth",
				component: BoothPage,
			},
		],
	},
	menu: [
		{
			label: "Booth",
			path: "/booth",
			icon: Mic,
		},
	],
};
