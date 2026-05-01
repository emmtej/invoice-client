import { Mic } from "lucide-react";
import type { FeatureConfig } from "@/types/navigation";

export const boothConfig: FeatureConfig = {
	menu: [
		{
			label: "Booth",
			path: "/booth",
			icon: Mic,
		},
	],
};
