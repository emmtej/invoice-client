import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AppLayout } from "@/components/ui/AppLayout";
import { RouterErrorBoundary } from "@/routes/components/RouterErrorBoundary";

export const Route = createRootRoute({
	component: () => (
		<RouterErrorBoundary>
			<AppLayout>
				<Outlet />
				{import.meta.env.DEV && <TanStackRouterDevtools />}
			</AppLayout>
		</RouterErrorBoundary>
	),
});
