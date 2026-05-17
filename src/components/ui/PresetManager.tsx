import { Box, Button, Group, Stack, Text } from "@mantine/core";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

interface PresetManagerProps<T> {
	title: string;
	description: string;
	items: T[];
	onAdd: () => void;
	addLabel?: string;
	emptyMessage?: string;
	children: (items: T[]) => ReactNode;
}

export function PresetManager<T>({
	title,
	description,
	items,
	onAdd,
	addLabel = "Add Preset",
	emptyMessage = "No presets created yet.",
	children,
}: PresetManagerProps<T>) {
	return (
		<Stack gap="md">
			<Group justify="space-between" align="flex-start">
				<Box>
					<Text fw={700} size="lg">
						{title}
					</Text>
					<Text size="sm" c="dimmed">
						{description}
					</Text>
				</Box>
				<Button leftSection={<Plus size={16} />} color="blue" onClick={onAdd}>
					{addLabel}
				</Button>
			</Group>

			{items.length > 0 ? (
				children(items)
			) : (
				<SurfaceCard p="xl">
					<Stack align="center" gap="xs">
						<Text c="dimmed" fs="italic">
							{emptyMessage}
						</Text>
						<Button
							variant="subtle"
							color="blue"
							onClick={onAdd}
							leftSection={<Plus size={16} />}
						>
							Create your first preset
						</Button>
					</Stack>
				</SurfaceCard>
			)}
		</Stack>
	);
}
