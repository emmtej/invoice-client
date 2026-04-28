import { Receipt } from "lucide-react";
import { lazy } from "react";
import type { FeatureConfig } from "@/types/navigation";

export const invoiceConfig: FeatureConfig = {
	routes: {
		public: [
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
	menu: [
		{
			label: "Invoices",
			icon: Receipt,
			initiallyOpened: true,
			children: [
				{
					label: "New Invoice",
					path: "/invoice",
				},
				{
					label: "Presets",
					path: "/invoice/presets",
				},
			],
		},
	],
};
