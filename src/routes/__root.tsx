import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Layout } from "@/components/ui/layout/Layout";
import { RouterErrorBoundary } from "@/routes/components/RouterErrorBoundary";

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
