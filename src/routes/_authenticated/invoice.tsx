import { Button, Stack, Text } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { RouteFallback } from "@/components/router/RouteFallback";
import { InvoiceView } from "@/features/invoice";

export const Route = createFileRoute("/_authenticated/invoice")({
	errorComponent: ({ reset }) => (
		<Stack p="xl" align="center">
			<Text c="red">Failed to load Invoice</Text>
			<Button onClick={reset} color="red">
				Retry
			</Button>
		</Stack>
	),
	component: () => (
		<Suspense fallback={<RouteFallback label="invoice" />}>
			<InvoiceView />
		</Suspense>
	),
});
