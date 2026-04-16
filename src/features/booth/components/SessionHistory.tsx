import {
	ActionIcon,
	Badge,
	Center,
	Group,
	Loader,
	Stack,
	Text,
	UnstyledButton,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { Clock, Trash2 } from "lucide-react";
import { SurfaceCard } from "@/components/ui/card/SurfaceCard";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { formatTime } from "../hooks/useTimer";
import type { BoothSession } from "../store/boothQueries";

interface SessionHistoryProps {
	sessions: BoothSession[];
	isLoading: boolean;
	onDelete: (id: string) => void;
	onSelect: (session: BoothSession) => void;
	hideLoader?: boolean;
}

function statusColor(status: BoothSession["status"]) {
	switch (status) {
		case "completed":
			return "green";
		case "in_progress":
			return "wave";
		case "abandoned":
			return "studio";
	}
}

function formatDate(iso: string): string {
	const d = new Date(iso);
	return d.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}

export function SessionHistory({
	sessions,
	isLoading,
	onDelete,
	onSelect,
	hideLoader,
}: SessionHistoryProps) {
	const handleDelete = (id: string) => {
		modals.openConfirmModal({
			title: "Delete Session Record?",
			children: (
				<Text size="sm">
					Are you sure you want to delete this session record? This action
					cannot be undone.
				</Text>
			),
			labels: { confirm: "Delete", cancel: "Cancel" },
			confirmProps: { color: "red" },
			onConfirm: () => onDelete(id),
		});
	};

	if (isLoading && !hideLoader) {
		return (
			<Center py="xl">
				<Loader color="wave" size="sm" />
			</Center>
		);
	}

	if (isLoading) {
		return null;
	}

	if (sessions.length === 0) {
		return (
			<EmptyState
				icon={<Clock size={40} />}
				title="No sessions yet"
				description="Start a booth session to begin tracking your recordings."
			/>
		);
	}

	return (
		<Stack gap="xs">
			{sessions.map((s) => (
				<SurfaceCard
					key={s.id}
					p="sm"
					style={{
						border:
							s.status === "in_progress"
								? "1px solid var(--mantine-color-wave-2)"
								: undefined,
						backgroundColor:
							s.status === "in_progress"
								? "var(--mantine-color-wave-0)"
								: undefined,
					}}
				>
					<Stack gap={4}>
						<Group justify="space-between" wrap="nowrap" align="flex-start">
							<UnstyledButton
								onClick={() => {
									if (s.status === "in_progress") {
										onSelect(s);
									}
								}}
								style={{
									flex: 1,
									cursor: s.status === "in_progress" ? "pointer" : "default",
								}}
							>
								<Text size="sm" fw={600} truncate="end" c="gray.8">
									{s.scriptName}
								</Text>
							</UnstyledButton>
							<ActionIcon
								size="sm"
								variant="subtle"
								color="red"
								onClick={() => handleDelete(s.id)}
								aria-label="Delete session"
							>
								<Trash2 size={14} />
							</ActionIcon>
						</Group>

						<Text size="xs" c="gray.5">
							{formatDate(s.startedAt)}
						</Text>

						<Group justify="space-between" mt={4}>
							<Group gap={8}>
								<Text size="xs" ff="monospace" fw={500}>
									{formatTime(s.elapsedMs)}
								</Text>
								<Text size="xs" c="gray.5">
									•
								</Text>
								<Text size="xs" c="gray.6">
									{s.completedLines}/{s.totalLines} lines
								</Text>
							</Group>
							<Badge
								size="xs"
								variant="light"
								color={statusColor(s.status)}
								tt="lowercase"
							>
								{s.status === "in_progress" ? "in progress" : s.status}
							</Badge>
						</Group>
					</Stack>
				</SurfaceCard>
			))}
		</Stack>
	);
}
