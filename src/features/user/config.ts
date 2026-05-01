import { User } from "lucide-react";
import type { FeatureConfig } from "@/types/navigation";

export const userConfig: FeatureConfig = {
	menu: [
		{
			label: "Profile",
			path: "/profile",
			icon: User,
		},
	],
};
