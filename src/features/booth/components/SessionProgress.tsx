import { Group, Progress, Text } from "@mantine/core";
import { useShallow } from "zustand/react/shallow";
import { useBoothStore } from "../store/useBoothStore";

export function SessionProgress() {
	const { script, completedLineIndices } = useBoothStore(
		useShallow((s) => ({
			script: s.script,
			completedLineIndices: s.completedLineIndices,
		})),
	);

	if (!script) return null;

	const totalReadable = script.lines.filter(
		(l) => l.type === "dialogue" || l.type === "action",
	).length;

	const completed = completedLineIndices.length;
	const remaining = totalReadable - completed;
	const pct = totalReadable > 0 ? (completed / totalReadable) * 100 : 0;

	return (
		<Group gap="md" align="center" px="md">
			<Progress value={pct} color="wave" flex={1} size="lg" radius="xl" />
			<Text size="sm" fw={500} c="gray.6" style={{ whiteSpace: "nowrap" }}>
				{completed} of {totalReadable} lines &mdash; {remaining} remaining
			</Text>
		</Group>
	);
}
