import { Button, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { ArrowLeft, Clock, Hash, Timer } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { SurfaceCard } from "@/components/ui/card/SurfaceCard";
import { formatTime } from "../hooks/useTimer";
import { useBoothStore } from "../store/useBoothStore";

function StatCard({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) {
	return (
		<SurfaceCard>
			<Stack gap={4} align="center">
				{icon}
				<Text size="xs" c="gray.5" fw={500}>
					{label}
				</Text>
				<Text fw={700} size="lg" c="gray.8">
					{value}
				</Text>
			</Stack>
		</SurfaceCard>
	);
}

export function SessionSummary() {
	const { elapsedMs, completedLineIndices, lineTimings, script, resetSession } =
		useBoothStore(
			useShallow((s) => ({
				elapsedMs: s.elapsedMs,
				completedLineIndices: s.completedLineIndices,
				lineTimings: s.lineTimings,
				script: s.script,
				resetSession: s.resetSession,
			})),
		);

	const totalLines = completedLineIndices.length;
	const avgMs =
		lineTimings.length > 0
			? lineTimings.reduce((sum, t) => sum + t.elapsedMs, 0) /
				lineTimings.length
			: 0;

	return (
		<Stack gap="lg" py="md">
			<Text fw={800} size="xl" c="gray.8" ta="center">
				Session Complete
			</Text>

			{script && (
				<Text size="sm" c="gray.5" ta="center">
					{script.name}
				</Text>
			)}

			<SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
				<StatCard
					icon={<Clock size={20} color="var(--mantine-color-wave-5)" />}
					label="Total Time"
					value={formatTime(elapsedMs)}
				/>
				<StatCard
					icon={<Hash size={20} color="var(--mantine-color-wave-5)" />}
					label="Lines Read"
					value={totalLines.toString()}
				/>
				<StatCard
					icon={<Timer size={20} color="var(--mantine-color-wave-5)" />}
					label="Avg per Line"
					value={formatTime(avgMs)}
				/>
			</SimpleGrid>

			<Group justify="center">
				<Button
					variant="light"
					color="wave"
					leftSection={<ArrowLeft size={16} />}
					onClick={resetSession}
				>
					Back to Scripts
				</Button>
			</Group>
		</Stack>
	);
}
