import {
	ActionIcon,
	Badge,
	Center,
	Group,
	Loader,
	Stack,
	Table,
	Text,
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
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}

export function SessionHistory({
	sessions,
	isLoading,
	onDelete,
	onSelect,
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

	if (isLoading) {
		return (
			<Center py="xl">
				<Loader color="wave" size="sm" />
			</Center>
		);
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
		<Stack gap="md">
			<Text fw={700} size="lg" c="gray.8">
				Session History
			</Text>
			<SurfaceCard p="0">
				<Table highlightOnHover>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Script</Table.Th>
							<Table.Th>Date</Table.Th>
							<Table.Th>Duration</Table.Th>
							<Table.Th>Lines</Table.Th>
							<Table.Th>Status</Table.Th>
							<Table.Th w={40} />
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{sessions.map((s) => (
							<Table.Tr
								key={s.id}
								onClick={() => {
									if (s.status === "in_progress") {
										onSelect(s);
									}
								}}
								style={{
									cursor: s.status === "in_progress" ? "pointer" : "default",
								}}
								bg={s.status === "in_progress" ? "wave.0" : undefined}
							>
								<Table.Td>
									<Text size="sm" fw={500} truncate="end" maw={200}>
										{s.scriptName}
									</Text>
								</Table.Td>
								<Table.Td>
									<Text size="sm" c="gray.6">
										{formatDate(s.startedAt)}
									</Text>
								</Table.Td>
								<Table.Td>
									<Text size="sm" ff="monospace">
										{formatTime(s.elapsedMs)}
									</Text>
								</Table.Td>
								<Table.Td>
									<Text size="sm" c="gray.6">
										{s.completedLines} / {s.totalLines}
									</Text>
								</Table.Td>
								<Table.Td>
									<Badge
										size="sm"
										variant="light"
										color={statusColor(s.status)}
									>
										{s.status === "in_progress" ? "in progress" : s.status}
									</Badge>
								</Table.Td>
								<Table.Td>
									<Group gap={4}>
										<ActionIcon
											size="sm"
											variant="subtle"
											color="red"
											onClick={(event) => {
												event.stopPropagation();
												handleDelete(s.id);
											}}
											aria-label="Delete session"
										>
											<Trash2 size={14} />
										</ActionIcon>
									</Group>
								</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</SurfaceCard>
		</Stack>
	);
}
