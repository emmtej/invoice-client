import { Button, Stack, Text } from "@mantine/core";

interface AuthenticatedRouteErrorProps {
	reset: () => void;
	label?: string;
}

export function AuthenticatedRouteError({
	reset,
	label,
}: AuthenticatedRouteErrorProps) {
	return (
		<Stack p="xl" align="center">
			<Text c="red">Failed to load {label || "page"}</Text>
			<Button onClick={reset} color="red">
				Retry
			</Button>
		</Stack>
	);
}
