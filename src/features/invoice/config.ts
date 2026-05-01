import { Receipt } from "lucide-react";
import type { FeatureConfig } from "@/types/navigation";

export const invoiceConfig: FeatureConfig = {
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
