import { createRouter } from "@tanstack/react-router";
import type { AppLayoutMode } from "@/components/ui/layout/layout-constants";
import { routeTree } from "./routeTree.gen";

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}

	interface StaticDataRouteOption {
		layoutMode?: AppLayoutMode;
	}
}

export const router = createRouter({
	routeTree,
	context: {},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});
