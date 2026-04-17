import { Checkbox, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useShallow } from "zustand/react/shallow";
import { useBoothStore } from "../store/useBoothStore";
import { useBoothSettingsStore } from "../store/useBoothSettingsStore";
import { SessionTimerDisplay } from "./SessionTimerDisplay";
import { SessionStatsDisplay } from "./SessionStatsDisplay";

export function SessionTimer() {
	const {
		status,
		script,
		elapsedMs,
		completedLineIndices,
		lineTimings,
		startedAt,
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
			pauseSession: s.pauseSession,
			resumeSession: s.resumeSession,
			stopSession: s.stopSession,
			restartSession: s.restartSession,
		})),
	);

	const { wordCountPricing, showCurrentEarnings, showRealizedHourly } =
		useBoothSettingsStore(
			useShallow((s) => ({
				wordCountPricing: s.wordCountPricing,
				showCurrentEarnings: s.showCurrentEarnings,
				showRealizedHourly: s.showRealizedHourly,
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
		let shouldResetTimer = true;

		modals.openConfirmModal({
			title: "Reset Take?",
			children: (
				<Stack gap="md">
					<Text size="sm">
						This will clear all line progress for this script and start a new
						take. This current take will be marked as abandoned.
					</Text>
					<Checkbox
						label="Also reset the session timer to zero"
						defaultChecked={shouldResetTimer}
						onChange={(event) => {
							shouldResetTimer = event.currentTarget.checked;
						}}
						color="wave"
					/>
				</Stack>
			),
			labels: { confirm: "Reset Take", cancel: "Cancel" },
			confirmProps: { color: "studio" },
			onConfirm: () => restartSession(shouldResetTimer),
		});
	};

	const isRunning = status === "running";
	const isPaused = status === "paused";

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

	const currentEarnings = totalWordsCompleted * wordCountPricing;
	const elapsedHours = elapsedMs / 1000 / 60 / 60;
	const hourlyRate = elapsedHours > 0 ? currentEarnings / elapsedHours : 0;

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
			<SessionTimerDisplay
				elapsedMs={elapsedMs}
				isRunning={isRunning}
				isPaused={isPaused}
				onPause={pauseSession}
				onResume={resumeSession}
				onStop={handleStopClick}
			/>

			{(isRunning || isPaused) && (
				<SessionStatsDisplay
					formattedStartedAt={formattedStartedAt}
					completedLinesCount={completedLineIndices.length}
					avgTimePerLine={avgTimePerLine}
					wordsPerMinute={wordsPerMinute}
					currentEarnings={currentEarnings}
					hourlyRate={hourlyRate}
					showCurrentEarnings={showCurrentEarnings}
					showRealizedHourly={showRealizedHourly}
					onReset={handleResetClick}
				/>
			)}
		</Stack>
	);
}
