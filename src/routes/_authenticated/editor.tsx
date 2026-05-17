import { createFileRoute } from "@tanstack/react-router";
import EditorView from "@/features/editor/EditorView";
import { AuthenticatedRouteError } from "@/routes/components/AuthenticatedRouteError";
import { AuthenticatedRouteShell } from "@/routes/components/AuthenticatedRouteShell";

export const Route = createFileRoute("/_authenticated/editor")({
	errorComponent: ({ reset }) => (
		<AuthenticatedRouteError reset={reset} label="Editor" />
	),
	component: () => (
		<AuthenticatedRouteShell label="editor">
			<EditorView />
		</AuthenticatedRouteShell>
	),
});
