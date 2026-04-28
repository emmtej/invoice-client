import { authConfig } from "@/features/auth/config";
import { boothConfig } from "@/features/booth/config";
import { editorConfig } from "@/features/editor/config";
import { homeConfig } from "@/features/home/config";
import { invoiceConfig } from "@/features/invoice/config";
import { scriptsConfig } from "@/features/scripts/config";
import { userConfig } from "@/features/user/config";
import type { AppRoute } from "@/types/navigation";

const features = [
	authConfig,
	homeConfig,
	invoiceConfig,
	boothConfig,
	scriptsConfig,
	editorConfig,
	userConfig,
];

export const publicRoutes: AppRoute[] = features.flatMap(
	(f) => f.routes?.public ?? [],
);

export const protectedRoutes: AppRoute[] = features.flatMap(
	(f) => f.routes?.protected ?? [],
);
