import {
	ActionIcon,
	Badge,
	Button,
	Divider,
	Group,
	Stack,
	Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { Pause, Play, RotateCcw, Square } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { formatTime } from "../hooks/useTimer";
import { useBoothStore } from "../store/useBoothStore";

export function SessionTimer() {
	const {
		status,
		script,
		elapsedMs,
		completedLineIndices,
		lineTimings,
		startedAt,
		startSession,
		pauseSession,
		resumeSession,
		stopSession,
		restartSession,
	} = useBoothStore(
		useShallow((s) => ({
			status: s.status,
			script: s.script,
			elapsedMs: s.elapsedMs,
			completedLineIndices: s.completedLineIndices,
			lineTimings: s.lineTimings,
			startedAt: s.startedAt,
			startSession: s.startSession,
			pauseSession: s.pauseSession,
			resumeSession: s.resumeSession,
			stopSession: s.stopSession,
			restartSession: s.restartSession,
		})),
	);

	const handleStopClick = () => {
		modals.openConfirmModal({
			title: "Stop Session?",
			children: (
				<Text size="sm">
					Are you sure you want to stop this recording session? All completed
					lines will be saved to your history.
				</Text>
			),
			labels: { confirm: "Stop Session", cancel: "Keep Recording" },
			confirmProps: { color: "studio" },
			onConfirm: stopSession,
		});
	};

	const handleResetClick = () => {
		modals.openConfirmModal({
			title: "Reset Session?",
			children: (
				<Text size="sm">
					This will clear all progress and restart the timer for this script.
					This take will be marked as abandoned in your history.
				</Text>
			),
			labels: { confirm: "Reset", cancel: "Cancel" },
			confirmProps: { color: "studio" },
			onConfirm: restartSession,
		});
	};

	const isRunning = status === "running";
	const isPaused = status === "paused";
	const isSelecting = status === "selecting";

	const avgTimePerLine =
		lineTimings.length > 0
			? lineTimings.reduce((acc, t) => acc + t.elapsedMs, 0) /
				lineTimings.length
			: 0;

	const totalWordsCompleted = completedLineIndices.reduce((acc, idx) => {
		const line = script?.lines[idx];
		if (line?.type === "dialogue") {
			return acc + (line.metadata?.wordCount || 0);
		}
		return acc;
	}, 0);

	const elapsedMinutes = elapsedMs / 1000 / 60;
	const wordsPerMinute =
		elapsedMinutes > 0 ? totalWordsCompleted / elapsedMinutes : 0;

	const formattedStartedAt = startedAt
		? `${new Date(startedAt).toLocaleTimeString(undefined, {
				hour: "numeric",
				minute: "2-digit",
			})}, ${new Date(startedAt).toLocaleDateString(undefined, {
				month: "short",
				day: "numeric",
			})}`
		: null;

	return (
		<Stack gap="xl" py="md">
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
					{isSelecting && (
						<ActionIcon
							size={64}
							radius="xl"
							color="wave"
							variant="filled"
							onClick={startSession}
							aria-label="Start session"
						>
							<Play size={32} />
						</ActionIcon>
					)}

					{isRunning && (
						<ActionIcon
							size={64}
							radius="xl"
							color="yellow.6"
							variant="filled"
							onClick={pauseSession}
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
							onClick={resumeSession}
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
							onClick={handleStopClick}
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

			{(isRunning || isPaused) && (
				<Stack gap="md" px="md">
					<Divider label="Session Stats" labelPosition="center" />
					{formattedStartedAt && (
						<Group justify="space-between">
							<Text size="xs" fw={700} c="gray.5" tt="uppercase">
								Started
							</Text>
							<Text size="xs" fw={600} c="gray.7">
								{formattedStartedAt}
							</Text>
						</Group>
					)}
					<Group justify="space-between">
						<Text size="xs" fw={700} c="gray.5" tt="uppercase">
							Lines Completed
						</Text>
						<Text size="sm" fw={600}>
							{completedLineIndices.length}
						</Text>
					</Group>
					<Group justify="space-between">
						<Text size="xs" fw={700} c="gray.5" tt="uppercase">
							Avg Time / Line
						</Text>
						<Text size="sm" fw={600}>
							{formatTime(avgTimePerLine)}
						</Text>
					</Group>
					<Group justify="space-between">
						<Text size="xs" fw={700} c="gray.5" tt="uppercase">
							Avg Words / Min
						</Text>
						<Text size="sm" fw={600}>
							{Math.round(wordsPerMinute)}
						</Text>
					</Group>

					<Divider mt="md" />

					<Stack gap="xs">
						<Button
							variant="subtle"
							color="studio"
							leftSection={<RotateCcw size={16} />}
							onClick={handleResetClick}
							fullWidth
						>
							Reset Take
						</Button>
					</Stack>
				</Stack>
			)}
		</Stack>
	);
}
