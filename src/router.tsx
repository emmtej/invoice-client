import {
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Layout } from "./components/layout/Layout";
import EditorPage from "./pages/Editor";

import App from "./App";

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
	component: () => <EditorPage />,
});

// TODO:
const routeTree = rootRoute.addChildren([indexRoute, editorRoute]);

export const router = createRouter({
	routeTree,
	context: {},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});
