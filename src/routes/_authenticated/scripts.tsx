import { createFileRoute } from "@tanstack/react-router";
import ScriptsView from "@/features/scripts/ScriptsView";
import { AuthenticatedRouteError } from "@/routes/components/AuthenticatedRouteError";
import { AuthenticatedRouteShell } from "@/routes/components/AuthenticatedRouteShell";

export const Route = createFileRoute("/_authenticated/scripts")({
	errorComponent: ({ reset }) => (
		<AuthenticatedRouteError reset={reset} label="Scripts" />
	),
	component: () => (
		<AuthenticatedRouteShell label="scripts">
			<ScriptsView />
		</AuthenticatedRouteShell>
	),
});
