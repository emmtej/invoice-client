import {
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { lazy, Suspense } from "react";
import { RouteFallback } from "./components/router/RouteFallback";
import { RouterErrorBoundary } from "./components/router/RouterErrorBoundary";
import { Layout } from "./components/ui/layout/Layout";
import BoothPage from "./features/booth";
import EditorPage from "./features/editor";
import HomePage from "./features/home";
import ScriptsPage from "./features/scripts";
import { useUserStore } from "./store/userStore";

// Lazy Pages
const InvoicePage = lazy(() =>
	import("@/features/invoice").then((m) => ({ default: m.InvoicePage })),
);
const PresetsPage = lazy(() =>
	import("@/features/invoice").then((m) => ({ default: m.PresetsPage })),
);
const AuthenticationPage = lazy(() => import("@/features/auth"));
const DashboardPage = lazy(() =>
	import("@/features/user").then((m) => ({ default: m.DashboardPage })),
);
const ProfilePage = lazy(() =>
	import("@/features/user").then((m) => ({ default: m.ProfilePage })),
);

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

// --- Public Routes ---
const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: HomePage,
});

const loginRoute = createRoute({
	path: "/login",
	getParentRoute: () => rootRoute,
	component: () => (
		<Suspense fallback={<RouteFallback label="authentication" />}>
			<AuthenticationPage />
		</Suspense>
	),
});

const registrationRoute = createRoute({
	path: "/register",
	getParentRoute: () => rootRoute,
	component: () => (
		<Suspense fallback={<RouteFallback label="authentication" />}>
			<AuthenticationPage />
		</Suspense>
	),
});

const boothRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/booth",
	component: BoothPage,
});

const scriptsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/scripts",
	component: ScriptsPage,
});

const editorRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/editor",
	component: EditorPage,
});

const invoiceRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/invoice",
	component: () => (
		<Suspense fallback={<RouteFallback label="invoice" />}>
			<InvoicePage />
		</Suspense>
	),
});

const invoicePresetsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/invoice/presets",
	component: () => (
		<Suspense fallback={<RouteFallback label="invoice presets" />}>
			<PresetsPage />
		</Suspense>
	),
});

// --- Protected Routes ---
const protectedUserRoutes = createRoute({
	getParentRoute: () => rootRoute,
	id: "authenticated",
	beforeLoad: () => {
		if (!useUserStore.getState().user) {
			throw redirect({ to: "/login" });
		}
	},
});

const dashboardRoute = createRoute({
	getParentRoute: () => protectedUserRoutes,
	path: "/dashboard",
	component: () => (
		<Suspense fallback={<RouteFallback label="dashboard" />}>
			<DashboardPage />
		</Suspense>
	),
});

const profileRoute = createRoute({
	getParentRoute: () => protectedUserRoutes,
	path: "/profile",
	component: () => (
		<Suspense fallback={<RouteFallback label="profile" />}>
			<ProfilePage />
		</Suspense>
	),
});

// --- Router Instance ---
const routeTree = rootRoute.addChildren([
	indexRoute,
	boothRoute,
	scriptsRoute,
	editorRoute,
	invoiceRoute,
	invoicePresetsRoute,
	loginRoute,
	registrationRoute,
	protectedUserRoutes.addChildren([dashboardRoute, profileRoute]),
]);

export const router = createRouter({
	routeTree,
	context: {},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});
