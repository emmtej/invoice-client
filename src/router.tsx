import {
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import React, { lazy, Suspense } from "react";
import App from "./App";
import { Layout } from "./components/ui/layout/Layout";
import { useUserStore } from "./store/userStore";

const EditorPage = lazy(() => import("@/features/editor"));
const InvoicePage = lazy(() =>
	import("@/features/invoice").then((m) => ({ default: m.InvoicePage })),
);
const Authentication = lazy(() => import("./pages/Authentication"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

class ErrorBoundary extends React.Component<
	{ children: React.ReactNode },
	{ hasError: boolean }
> {
	state = { hasError: false };
	static getDerivedStateFromError() {
		return { hasError: true };
	}
	render() {
		if (this.state.hasError)
			return (
				<div style={{ padding: 20 }}>
					Something went wrong loading this page.
				</div>
			);
		return this.props.children;
	}
}

const rootRoute = createRootRoute({
	component: () => (
		<ErrorBoundary>
			<Layout>
				<Outlet />
				<TanStackRouterDevtools />
			</Layout>
		</ErrorBoundary>
	),
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: App,
});

const loginRoute = createRoute({
	path: "/login",
	getParentRoute: () => rootRoute,
	component: () => (
		<Suspense fallback={<div>Loading...</div>}>
			<Authentication />
		</Suspense>
	),
});

const registrationRoute = createRoute({
	path: "/register",
	getParentRoute: () => rootRoute,
	component: () => (
		<Suspense fallback={<div>Loading...</div>}>
			<Authentication />
		</Suspense>
	),
});

// Protected Routes
const authenticatedRoutes = createRoute({
	getParentRoute: () => rootRoute,
	id: "authenticated",
	beforeLoad: () => {
		if (!useUserStore.getState().user) {
			throw redirect({ to: "/login" });
		}
	},
});

const dashboardRoute = createRoute({
	getParentRoute: () => authenticatedRoutes,
	path: "/dashboard",
	component: () => (
		<Suspense fallback={<div>Loading...</div>}>
			<Dashboard />
		</Suspense>
	),
});

const profileRoute = createRoute({
	getParentRoute: () => authenticatedRoutes,
	path: "/profile",
	component: () => (
		<Suspense fallback={<div>Loading...</div>}>
			<Profile />
		</Suspense>
	),
});

// Note: /editor and /invoice are intentionally public routes
const editorRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/editor",
	component: () => (
		<Suspense fallback={<div>Loading...</div>}>
			<EditorPage />
		</Suspense>
	),
});

const invoiceRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/invoice",
	component: () => (
		<Suspense fallback={<div>Loading...</div>}>
			<InvoicePage />
		</Suspense>
	),
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	editorRoute,
	invoiceRoute,
	loginRoute,
	registrationRoute,
	authenticatedRoutes.addChildren([dashboardRoute, profileRoute]),
]);

export const router = createRouter({
	routeTree,
	context: {},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});
