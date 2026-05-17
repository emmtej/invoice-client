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
				<Box p="sm" bg="gray.0" c="dimmed">
					{icon}
				</Box>
				<Stack gap={4} ta="center">
					<Text fw={600} size="sm">
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
