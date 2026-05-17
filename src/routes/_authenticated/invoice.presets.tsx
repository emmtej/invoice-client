import { createFileRoute } from "@tanstack/react-router";
import PresetsView from "@/features/invoice/PresetsView";
import { AuthenticatedRouteError } from "@/routes/components/AuthenticatedRouteError";
import { AuthenticatedRouteShell } from "@/routes/components/AuthenticatedRouteShell";

export const Route = createFileRoute("/_authenticated/invoice/presets")({
	errorComponent: ({ reset }) => (
		<AuthenticatedRouteError reset={reset} label="Invoice Presets" />
	),
	component: () => (
		<AuthenticatedRouteShell label="invoice presets">
			<PresetsView />
		</AuthenticatedRouteShell>
	),
});
