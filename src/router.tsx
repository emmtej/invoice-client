import {
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router";
import { Layout } from "./components/layout/Layout";
import Landing from "./pages/Landing";

const rootRoute = createRootRoute({
	component: () => <Layout />,
});

const landingRoute = createRoute({
	path: "/",
	getParentRoute: () => rootRoute,
	component: () => <Landing />,
});

// TODO:
const routeTree = rootRoute.addChildren([landingRoute]);

export const router = createRouter({ routeTree });
