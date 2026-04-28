import {
	ActionIcon,
	Badge,
	Box,
	Center,
	Group,
	Loader,
	Stack,
	Text,
	UnstyledButton,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { Trash2 } from "lucide-react";
import { SurfaceCard } from "@/components/ui/card/SurfaceCard";
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
			<Stack gap="md" mt="md">
				{[1, 2, 3].map((i) => (
					<Box
						key={i}
						p="md"
						style={{
							border: "1px dashed var(--mantine-color-gray-2)",
							borderRadius: "var(--mantine-radius-md)",
							opacity: 1 - i * 0.2,
						}}
					>
						<Stack gap="xs">
							<Box
								h={10}
								bg="gray.1"
								w="60%"
								style={{ borderRadius: "var(--mantine-radius-xl)" }}
							/>
							<Box
								h={8}
								bg="gray.0"
								w="40%"
								style={{ borderRadius: "var(--mantine-radius-xl)" }}
							/>
						</Stack>
					</Box>
				))}
				<Text size="xs" c="gray.7" ta="center" fw={500} mt="xs">
					Completed sessions will appear here.
				</Text>
			</Stack>
		);
	}

	return (
		<Stack gap="sm" mt="md">
			{sessions.map((s) => (
				<SurfaceCard
					key={s.id}
					p="md"
					style={{
						border:
							s.status === "in_progress"
								? "1px solid var(--mantine-color-wave-2)"
								: "1px solid var(--mantine-color-gray-1)",
						backgroundColor:
							s.status === "in_progress"
								? "var(--mantine-color-wave-0)"
								: "white",
					}}
					className="hover:border-[var(--mantine-color-wave-2)] transition-colors"
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
								<Text size="sm" fw={700} truncate="end" c="gray.9">
									{s.scriptName}
								</Text>
							</UnstyledButton>
							<ActionIcon
								size="sm"
								variant="subtle"
								color="gray"
								onClick={() => handleDelete(s.id)}
								aria-label="Delete session"
								className="hover:text-red-600 hover:bg-red-50"
							>
								<Trash2 size={14} />
							</ActionIcon>
						</Group>

						<Text size="xs" c="gray.7" fw={500}>
							{formatDate(s.startedAt)}
						</Text>

						<Group justify="space-between" mt={8}>
							<Group gap={8}>
								<Text size="xs" ff="monospace" fw={700} c="studio-blue.7">
									{formatTime(s.elapsedMs)}
								</Text>
								<Text size="xs" c="gray.3">
									•
								</Text>
								<Text size="xs" c="gray.7" fw={600}>
									{s.completedLines}/{s.totalLines} lines
								</Text>
							</Group>
							<Badge
								size="xs"
								variant="light"
								color={statusColor(s.status)}
								className="font-bold"
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
