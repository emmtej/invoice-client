import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

export interface AppRoute {
	path: string;
	component: ComponentType;
	label: string;
}

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
	routes?: {
		public?: AppRoute[];
		protected?: AppRoute[];
	};
	menu?: AppMenu[];
}
