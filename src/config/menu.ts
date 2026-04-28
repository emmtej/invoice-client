import { Wrench } from "lucide-react";
import { boothConfig } from "@/features/booth/config";
import { invoiceConfig } from "@/features/invoice/config";
import { userConfig } from "@/features/user/config";
import type { AppMenu } from "@/types/navigation";

export const MENU: AppMenu[] = [
	// Invoices from feature config
	...(invoiceConfig.menu ?? []),

	// Tools group
	{
		label: "Tools",
		icon: Wrench,
		initiallyOpened: true,
		children: [
			{ label: "Scripts", path: "/scripts" },
			{ label: "Editor", path: "/editor" },
		],
	},

	// Booth from feature config
	...(boothConfig.menu ?? []),

	// Profile from feature config
	...(userConfig.menu ?? []),
];
