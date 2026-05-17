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
				<Box p="sm" bg="color-mix(in srgb, var(--mantine-color-forest-9) 3%, transparent)" c="brand-dark.3">
					{icon}
				</Box>
				<Stack gap={4} ta="center">
					<Text fw={600} size="sm" c="brand-dark.6">
						{title}
					</Text>
					{description && (
						<Text size="xs" c="brand-dark.4" maw={maxDescriptionWidth}>
							{description}
						</Text>
					)}
				</Stack>
			</Stack>
		</Paper>
	);
}
