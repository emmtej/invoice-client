import { Button, Stack, Text } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { RouteFallback } from "@/components/router/RouteFallback";
import { BoothView } from "@/features/booth";

export const Route = createFileRoute("/_authenticated/booth")({
	errorComponent: ({ reset }) => (
		<Stack p="xl" align="center">
			<Text c="red">Failed to load Booth</Text>
			<Button onClick={reset} color="red">
				Retry
			</Button>
		</Stack>
	),
	component: () => (
		<Suspense fallback={<RouteFallback label="booth" />}>
			<BoothView />
		</Suspense>
	),
});
