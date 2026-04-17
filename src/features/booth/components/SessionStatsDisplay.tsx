import { Button, Divider, Group, Stack, Text } from "@mantine/core";
import { RotateCcw } from "lucide-react";
import { formatTime } from "../hooks/useTimer";

interface SessionStatsDisplayProps {
	formattedStartedAt: string | null;
	completedLinesCount: number;
	avgTimePerLine: number;
	wordsPerMinute: number;
	currentEarnings: number;
	hourlyRate: number;
	showCurrentEarnings: boolean;
	showRealizedHourly: boolean;
	onReset: () => void;
}

export function SessionStatsDisplay({
	formattedStartedAt,
	completedLinesCount,
	avgTimePerLine,
	wordsPerMinute,
	currentEarnings,
	hourlyRate,
	showCurrentEarnings,
	showRealizedHourly,
	onReset,
}: SessionStatsDisplayProps) {
	return (
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
					{completedLinesCount}
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

			{(showCurrentEarnings || showRealizedHourly) && (
				<Divider mt="xs" variant="dashed" />
			)}

			{showCurrentEarnings && (
				<Group justify="space-between">
					<Text size="xs" fw={700} c="wave.6" tt="uppercase">
						Current Earnings
					</Text>
					<Text size="sm" fw={800} c="wave.8">
						$
						{currentEarnings.toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</Text>
				</Group>
			)}

			{showRealizedHourly && (
				<Group justify="space-between">
					<Text size="xs" fw={700} c="studio.6" tt="uppercase">
						Realized Hourly
					</Text>
					<Text size="sm" fw={800} c="studio.8">
						${Math.round(hourlyRate).toLocaleString()}/hr
					</Text>
				</Group>
			)}

			<Divider mt="md" />

			<Stack gap="xs">
				<Button
					variant="subtle"
					color="studio"
					leftSection={<RotateCcw size={16} />}
					onClick={onReset}
					fullWidth
				>
					Reset Take
				</Button>
			</Stack>
		</Stack>
	);
}
