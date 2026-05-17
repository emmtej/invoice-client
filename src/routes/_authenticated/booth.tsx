import { createFileRoute } from "@tanstack/react-router";
import { BoothView } from "@/features/booth";
import { AuthenticatedRouteError } from "@/routes/components/AuthenticatedRouteError";
import { AuthenticatedRouteShell } from "@/routes/components/AuthenticatedRouteShell";

export const Route = createFileRoute("/_authenticated/booth")({
	errorComponent: ({ reset }) => (
		<AuthenticatedRouteError reset={reset} label="Booth" />
	),
	component: () => (
		<AuthenticatedRouteShell label="booth">
			<BoothView />
		</AuthenticatedRouteShell>
	),
});
