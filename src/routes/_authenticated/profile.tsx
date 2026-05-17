import { createFileRoute } from "@tanstack/react-router";
import { ProfileView } from "@/features/user";
import { AuthenticatedRouteError } from "@/routes/components/AuthenticatedRouteError";
import { AuthenticatedRouteShell } from "@/routes/components/AuthenticatedRouteShell";

export const Route = createFileRoute("/_authenticated/profile")({
	errorComponent: ({ reset }) => (
		<AuthenticatedRouteError reset={reset} label="Profile" />
	),
	component: () => (
		<AuthenticatedRouteShell label="profile">
			<ProfileView />
		</AuthenticatedRouteShell>
	),
});
