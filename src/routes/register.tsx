import { createFileRoute } from "@tanstack/react-router";
import AuthenticationView from "@/features/auth/AuthenticationView";

export const Route = createFileRoute("/register")({
	component: AuthenticationView,
});
