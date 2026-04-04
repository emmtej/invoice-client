import { Box, Paper, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

interface EmptyStateProps {
	icon: ReactNode;
	title: string;
	description?: string;
	maxDescriptionWidth?: number;
}

export function EmptyState({
	icon,
	title,
	description,
	maxDescriptionWidth = 200,
}: EmptyStateProps) {
	return (
		<Paper py="xl" px="md" bg="transparent">
			<Stack gap="md" align="center">
				<Box
					p="sm"
					bg="gray.0"
					c="gray.3"
					style={{ borderRadius: "var(--mantine-radius-xl)" }}
				>
					{icon}
				</Box>
				<Stack gap={4} ta="center">
					<Text fw={700} size="sm" c="dark.4">
						{title}
					</Text>
					{description && (
						<Text size="xs" c="dimmed" maw={maxDescriptionWidth}>
							{description}
						</Text>
					)}
				</Stack>
			</Stack>
		</Paper>
	);
}
