import { createFileRoute } from "@tanstack/react-router";
import { DashboardView } from "@/features/user";
import { AuthenticatedRouteError } from "@/routes/components/AuthenticatedRouteError";
import { AuthenticatedRouteShell } from "@/routes/components/AuthenticatedRouteShell";

export const Route = createFileRoute("/_authenticated/dashboard")({
	errorComponent: ({ reset }) => (
		<AuthenticatedRouteError reset={reset} label="Dashboard" />
	),
	component: () => (
		<AuthenticatedRouteShell label="dashboard">
			<DashboardView />
		</AuthenticatedRouteShell>
	),
});
