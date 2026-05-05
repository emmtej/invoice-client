import { Button, Code, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<Stack align="center" p="xl">
			<Text fw={800} c="red.8">
				Something went wrong
			</Text>
			<Code>{(error as Error).message}</Code>
			<Button onClick={resetErrorBoundary} mt="md" color="red">
				Try again
			</Button>
		</Stack>
	);
}

export function RouterErrorBoundary({ children }: { children: ReactNode }) {
	return (
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			onError={(error, info) =>
				console.error("Router error:", error, info.componentStack)
			}
		>
			{children}
		</ErrorBoundary>
	);
}
