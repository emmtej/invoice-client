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
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { BoothSession } from "@/features/storage/boothRepository";
import { formatTime } from "../hooks/useTimer";

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
			return "blue";
		case "abandoned":
			return "blue";
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
				<Loader color="blue" size="sm" />
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
						className={`border border-dashed rounded-md opacity-${100 - i * 20}`}
					>
						<Stack gap="xs">
							<Box h={10} bg="gray.0" w="60%" className="rounded-full" />
							<Box h={8} bg="color-mix(in srgb, var(--mantine-color-dark-9) 5%, transparent)" w="40%" className="rounded-full" />
						</Stack>
					</Box>
				))}
				<Text size="xs" c="dimmed" ta="center" fw={500} mt="xs">
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
					radius="md"
					className={`transition-all duration-150 border ${s.status === "in_progress" ? "border-blue-3" : "bg-white hover:bg-gray-0"}`}
				>
					<Stack gap={4}>
						<Group justify="space-between" wrap="nowrap" align="flex-start">
							<UnstyledButton
								onClick={() => {
									if (s.status === "in_progress") {
										onSelect(s);
									}
								}}
								className={`flex-1 ${s.status === "in_progress" ? "cursor-pointer" : "cursor-default"}`}
							>
								<Text size="sm" fw={700} truncate="end" >
									{s.scriptName}
								</Text>
							</UnstyledButton>
							<ActionIcon
								size="sm"
								variant="subtle"
								color="gray"
								radius="md"
								onClick={() => handleDelete(s.id)}
								aria-label="Delete session"
								className="hover:text-red-600 hover:bg-red-60"
							>
								<Trash2 size={14} />
							</ActionIcon>
						</Group>

						<Text size="xs" c="dimmed" fw={500}>
							{formatDate(s.startedAt)}
						</Text>

						<Group justify="space-between" mt={8}>
							<Group gap={8}>
								<Text size="xs" ff="monospace" fw={700} >
									{formatTime(s.elapsedMs)}
								</Text>
								<Text size="xs" c="dimmed">
									•
								</Text>
								<Text size="xs" c="dimmed" fw={600}>
									{s.completedLines}/{s.totalLines} lines
								</Text>
							</Group>
							<Badge
								size="xs"
								variant="light"
								color={statusColor(s.status)}
								radius="sm"
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
