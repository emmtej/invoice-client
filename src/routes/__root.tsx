import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { RouterErrorBoundary } from "@/components/router/RouterErrorBoundary";
import { Layout } from "@/components/ui/layout/Layout";

export const Route = createRootRoute({
	component: () => (
		<RouterErrorBoundary>
			<Layout>
				<Outlet />
				{import.meta.env.DEV && <TanStackRouterDevtools />}
			</Layout>
		</RouterErrorBoundary>
	),
});
