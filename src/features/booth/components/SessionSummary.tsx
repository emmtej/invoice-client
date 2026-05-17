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
		<SurfaceCard radius="3xl" withBorder className="border-stone shadow-sm">
			<Stack gap={4} align="center">
				{icon}
				<Text size="xs" c="brand-dark.5" fw={500} tt="uppercase" lts={1}>
					{label}
				</Text>
				<Text fw={800} size="xl" c="brand-dark.7">
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
		<Stack gap="xl" py="md">
			<Stack gap={4}>
				<Text fw={900} size="28px" c="brand-dark.7" ta="center">
					Session Complete
				</Text>

				{script && (
					<Text size="sm" c="brand-dark.5" ta="center" fw={500}>
						{script.name}
					</Text>
				)}
			</Stack>

			<SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
				<StatCard
					icon={<Clock size={20} className="text-wave-500" />}
					label="Total Time"
					value={formatTime(elapsedMs)}
				/>
				<StatCard
					icon={<Hash size={20} className="text-wave-500" />}
					label="Lines Read"
					value={totalLines.toString()}
				/>
				<StatCard
					icon={<Timer size={20} className="text-wave-500" />}
					label="Avg per Line"
					value={formatTime(avgMs)}
				/>
			</SimpleGrid>

			<Group justify="center" mt="xl">
				<Button
					variant="light"
					color="wave"
					radius="xl"
					size="md"
					leftSection={<ArrowLeft size={16} />}
					onClick={resetSession}
					className="px-8 shadow-sm transition-transform active:scale-95"
				>
					Back to Scripts
				</Button>
			</Group>
		</Stack>
	);
}
