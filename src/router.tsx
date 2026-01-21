import {
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import App from "./App";
import { Layout } from "./components/ui/layout/Layout";
import Authentication from "./pages/Authentication";
import Dashboard from "./pages/Dashboard";
import EditorPage from "./pages/Editor";
import { useUserStore } from "./store/userStore";
import Profile from "./pages/Profile";

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

const editorRoute = createRoute({
	path: "/editor",
	getParentRoute: () => rootRoute,
	component: EditorPage,
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

const profileRoute = createRoute({
	getParentRoute: () => authenticatedRoutes,
	path: "/profile",
	component: Profile,
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	editorRoute,
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
