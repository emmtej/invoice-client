import { Button, Stack, Text } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { RouteFallback } from "@/components/router/RouteFallback";
import { ProfileView } from "@/features/user";

export const Route = createFileRoute("/_authenticated/profile")({
	errorComponent: ({ reset }) => (
		<Stack p="xl" align="center">
			<Text c="red">Failed to load Profile</Text>
			<Button onClick={reset} color="red">
				Retry
			</Button>
		</Stack>
	),
	component: () => (
		<Suspense fallback={<RouteFallback label="profile" />}>
			<ProfileView />
		</Suspense>
	),
});
