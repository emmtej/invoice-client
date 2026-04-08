import { Center, Loader, Paper, Stack, Text } from "@mantine/core";
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
const ScriptsPage = lazy(() => import("@/features/scripts"));
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

function RouteFallback({ label }: { label: string }) {
	return (
		<Center mih="50vh">
			<Paper withBorder p="xl" maw={360} w="100%" bg="white">
				<Stack gap="sm" align="center">
					<Loader color="wave" size="sm" />
					<Text fw={700} c="gray.8">
						Loading {label}
					</Text>
					<Text size="sm" c="gray.5" ta="center">
						Hang tight while this screen finishes loading.
					</Text>
				</Stack>
			</Paper>
		</Center>
	);
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
				<Center mih="50vh">
					<Paper withBorder p="xl" maw={420} w="100%" bg="white">
						<Stack gap="sm">
							<Text fw={800} c="gray.8">
								Something went wrong loading this page.
							</Text>
							<Text size="sm" c="gray.5">
								Refresh the page or navigate to another section and try again.
							</Text>
						</Stack>
					</Paper>
				</Center>
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
		<Suspense fallback={<RouteFallback label="authentication" />}>
			<Authentication />
		</Suspense>
	),
});

const registrationRoute = createRoute({
	path: "/register",
	getParentRoute: () => rootRoute,
	component: () => (
		<Suspense fallback={<RouteFallback label="authentication" />}>
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
		<Suspense fallback={<RouteFallback label="dashboard" />}>
			<Dashboard />
		</Suspense>
	),
});

const profileRoute = createRoute({
	getParentRoute: () => authenticatedRoutes,
	path: "/profile",
	component: () => (
		<Suspense fallback={<RouteFallback label="profile" />}>
			<Profile />
		</Suspense>
	),
});

// Note: /editor, /scripts, and /invoice are intentionally public routes
const scriptsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/scripts",
	component: () => (
		<Suspense fallback={<RouteFallback label="scripts" />}>
			<ScriptsPage />
		</Suspense>
	),
});

const editorRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/editor",
	component: () => (
		<Suspense fallback={<RouteFallback label="editor" />}>
			<EditorPage />
		</Suspense>
	),
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

const routeTree = rootRoute.addChildren([
	indexRoute,
	scriptsRoute,
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
