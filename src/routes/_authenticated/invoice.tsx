import { createFileRoute } from "@tanstack/react-router";
import InvoiceView from "@/features/invoice/InvoiceView";
import { AuthenticatedRouteError } from "@/routes/components/AuthenticatedRouteError";
import { AuthenticatedRouteShell } from "@/routes/components/AuthenticatedRouteShell";

export const Route = createFileRoute("/_authenticated/invoice")({
	errorComponent: ({ reset }) => (
		<AuthenticatedRouteError reset={reset} label="Invoice" />
	),
	component: () => (
		<AuthenticatedRouteShell label="invoice">
			<InvoiceView />
		</AuthenticatedRouteShell>
	),
});
