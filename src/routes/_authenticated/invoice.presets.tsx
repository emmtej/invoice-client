import { Button, Stack, Text } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { PresetsView } from "@/features/invoice";
import { RouteFallback } from "@/routes/components/RouteFallback";

export const Route = createFileRoute("/_authenticated/invoice/presets")({
	errorComponent: ({ reset }) => (
		<Stack p="xl" align="center">
			<Text c="red">Failed to load Presets</Text>
			<Button onClick={reset} color="red">
				Retry
			</Button>
		</Stack>
	),
	component: () => (
		<Suspense fallback={<RouteFallback label="presets" />}>
			<PresetsView />
		</Suspense>
	),
});
