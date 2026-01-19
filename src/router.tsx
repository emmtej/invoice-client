import {
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import App from "./App";
import { Layout } from "./components/ui/layout/Layout";
import EditorPage from "./pages/Editor";
import Authentication from "./pages/Authentication";

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

const routeTree = rootRoute.addChildren([
	indexRoute,
	editorRoute,
	loginRoute,
	registrationRoute,
]);

export const router = createRouter({
	routeTree,
	context: {},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});
