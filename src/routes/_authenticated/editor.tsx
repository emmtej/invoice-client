import { Button, Stack, Text } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { EditorView } from "@/features/editor";
import { RouteFallback } from "@/routes/components/RouteFallback";

export const Route = createFileRoute("/_authenticated/editor")({
	errorComponent: ({ reset }) => (
		<Stack p="xl" align="center">
			<Text c="red">Failed to load Editor</Text>
			<Button onClick={reset} color="red">
				Retry
			</Button>
		</Stack>
	),
	component: () => (
		<Suspense fallback={<RouteFallback label="editor" />}>
			<EditorView />
		</Suspense>
	),
});
