import { ActionIcon, Badge, Group, Stack, Text } from "@mantine/core";
import { Pause, Play, Square } from "lucide-react";
import { formatTime } from "../hooks/useTimer";

interface SessionTimerDisplayProps {
	elapsedMs: number;
	isRunning: boolean;
	isPaused: boolean;
	onPause: () => void;
	onResume: () => void;
	onStop: () => void;
}

export function SessionTimerDisplay({
	elapsedMs,
	isRunning,
	isPaused,
	onPause,
	onResume,
	onStop,
}: SessionTimerDisplayProps) {
	return (
		<Stack gap="sm" align="center">
			<Text
				ff="monospace"
				fz={56}
				fw={800}
				c={isRunning ? "gray.9" : "gray.5"}
				lh={1}
			>
				{formatTime(elapsedMs)}
			</Text>

			<Group gap="md" align="center" justify="center">
				{isRunning && (
					<ActionIcon
						size={64}
						radius="xl"
						color="yellow.6"
						variant="filled"
						onClick={onPause}
						aria-label="Pause session"
					>
						<Pause size={32} />
					</ActionIcon>
				)}

				{isPaused && (
					<ActionIcon
						size={64}
						radius="xl"
						color="wave"
						variant="filled"
						onClick={onResume}
						aria-label="Resume session"
					>
						<Play size={32} />
					</ActionIcon>
				)}

				{(isRunning || isPaused) && (
					<ActionIcon
						size={64}
						radius="xl"
						color="studio"
						variant="light"
						onClick={onStop}
						aria-label="Stop session"
					>
						<Square size={28} />
					</ActionIcon>
				)}
			</Group>

			<Group gap="xs">
				{isPaused && (
					<Badge color="yellow" variant="light" size="lg" radius="sm">
						Paused
					</Badge>
				)}
				{isRunning && (
					<Badge color="wave" variant="light" size="lg" radius="sm">
						Recording
					</Badge>
				)}
			</Group>
		</Stack>
	);
}
