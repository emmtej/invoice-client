import { type ReactNode, Suspense } from "react";
import { RouteFallback } from "./RouteFallback";

interface AuthenticatedRouteShellProps {
	children: ReactNode;
	label: string;
}

export function AuthenticatedRouteShell({
	children,
	label,
}: AuthenticatedRouteShellProps) {
	return (
		<Suspense fallback={<RouteFallback label={label} />}>{children}</Suspense>
	);
}
