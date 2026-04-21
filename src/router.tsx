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
import { NAVIGATION, type NavItem } from "./config/navigation";
import { useUserStore } from "./store/userStore";

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
const createRoutesFromConfig = (items: NavItem[], parent: any) => {
	const routes: any[] = [];

	for (const item of items) {
		if (item.path && item.component) {
			const Component = item.component;
			routes.push(
				createRoute({
					getParentRoute: () => parent,
					path: item.path,
					component: () => (
						<Suspense fallback={<RouteFallback label={item.label.toLowerCase()} />}>
							<Component />
						</Suspense>
					),
				}),
			);
		}

		if (item.children) {
			for (const child of item.children) {
				const ChildComponent = child.component;
				routes.push(
					createRoute({
						getParentRoute: () => parent,
						path: child.path,
						component: () => (
							<Suspense fallback={<RouteFallback label={child.label.toLowerCase()} />}>
								<ChildComponent />
							</Suspense>
						),
					}),
				);
			}
		}
	}

	return routes;
};

const publicRoutes = createRoutesFromConfig(NAVIGATION.public, rootRoute);
const protectedRoutes = createRoutesFromConfig(
	NAVIGATION.protected,
	protectedUserRoutes,
);

// --- Router Instance ---
const routeTree = rootRoute.addChildren([
	...publicRoutes,
	protectedUserRoutes.addChildren(protectedRoutes),
]);

export const router = createRouter({
	routeTree,
	context: {},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});
