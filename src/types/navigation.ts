import type { LucideIcon } from "lucide-react";

export interface AppMenu {
	label: string;
	path?: string;
	icon?: LucideIcon;
	initiallyOpened?: boolean;
	children?: Array<{
		label: string;
		path: string;
	}>;
}

export interface FeatureConfig {
	menu?: AppMenu[];
}
