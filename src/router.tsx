import {
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import EditorPage from "@/features/editor";
import { InvoicePage } from "@/features/invoice";
import App from "./App";
import { Layout } from "./components/ui/layout/Layout";
import Authentication from "./pages/Authentication";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { useUserStore } from "./store/userStore";

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootRoute = createRootRoute({
	component: () => (
		<Layout>
			<Outlet />
			<TanStackRouterDevtools />
		</Layout>
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
	component: Authentication,
});

const registrationRoute = createRoute({
	path: "/register",
	getParentRoute: () => rootRoute,
	component: Authentication,
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
	component: Dashboard,
});

const editorRoute = createRoute({
	getParentRoute: () => authenticatedRoutes,
	path: "/editor",
	component: EditorPage,
});

const profileRoute = createRoute({
	getParentRoute: () => authenticatedRoutes,
	path: "/profile",
	component: Profile,
});

// Testing route for editor (no auth required)
const testEditorRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/test/editor",
	component: EditorPage,
});

// Temporary test route for invoice page – no auth; remove in prod when /invoice is added under authenticatedRoutes
const testInvoiceRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/test/invoice",
	component: InvoicePage,
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	editorRoute,
	loginRoute,
	registrationRoute,
	testEditorRoute,
	testInvoiceRoute,
	authenticatedRoutes.addChildren([dashboardRoute, editorRoute, profileRoute]),
]);

export const router = createRouter({
	routeTree,
	context: {},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});
