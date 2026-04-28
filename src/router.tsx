import {
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Suspense } from "react";
import { RouteFallback } from "./components/router/RouteFallback";
import { RouterErrorBoundary } from "./components/router/RouterErrorBoundary";
import { Layout } from "./components/ui/layout/Layout";
import { protectedRoutes, publicRoutes } from "./config/routes";
import { useUserStore } from "./store/userStore";
import type { AppRoute } from "./types/navigation";

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// --- Root ---
const rootRoute = createRootRoute({
	component: () => (
		<RouterErrorBoundary>
			<Layout>
				<Outlet />
				{import.meta.env.DEV && <TanStackRouterDevtools />}
			</Layout>
		</RouterErrorBoundary>
	),
});

// --- Protected Scope ---
const protectedUserRoutes = createRoute({
	getParentRoute: () => rootRoute,
	id: "authenticated",
	beforeLoad: () => {
		if (!useUserStore.getState().user) {
			throw redirect({ to: "/login" });
		}
	},
});

// --- Helper: Map Config to Routes ---
const createRoutesFromConfig = (items: AppRoute[], parent: any) => {
	const routes: any[] = [];

	for (const item of items) {
		const Component = item.component;
		routes.push(
			createRoute({
				getParentRoute: () => parent,
				path: item.path,
				component: () => (
					<Suspense
						fallback={<RouteFallback label={item.label.toLowerCase()} />}
					>
						<Component />
					</Suspense>
				),
			}),
		);
	}

	return routes;
};

const publicRouterRoutes = createRoutesFromConfig(publicRoutes, rootRoute);
const protectedRouterRoutes = createRoutesFromConfig(
	protectedRoutes,
	protectedUserRoutes,
);

// --- Router Instance ---
const routeTree = rootRoute.addChildren([
	...publicRouterRoutes,
	protectedUserRoutes.addChildren(protectedRouterRoutes),
]);

export const router = createRouter({
	routeTree,
	context: {},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});
