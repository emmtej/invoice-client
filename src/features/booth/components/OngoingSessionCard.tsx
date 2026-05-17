import { Badge, Box, Button, Group, Text } from "@mantine/core";
import { Clock } from "lucide-react";
import { useCallback } from "react";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { BoothSession } from "@/features/storage/boothRepository";
import { scriptRepository } from "@/features/storage/scriptRepository";
import { useBoothStore } from "../store";

interface OngoingSessionCardProps {
	session: BoothSession;
}

export function OngoingSessionCard({ session }: OngoingSessionCardProps) {
	const restoreSession = useBoothStore((s) => s.restoreSession);

	const handleSelectSession = useCallback(async () => {
		if (session.status !== "in_progress") return;
		const scriptForSession = await scriptRepository.getScriptById(
			session.scriptId,
		);
		if (!scriptForSession) return;
		restoreSession(scriptForSession, session);
	}, [session, restoreSession]);

	return (
		<SurfaceCard className="border-2 shadow-sm">
			<Group justify="space-between" align="center">
				<Box>
					<Text fw={800} size="xl"  lts={-0.2}>
						{session.scriptName}
					</Text>
					<Text size="sm" c="dimmed" fw={500}>
						Started {new Date(session.startedAt).toLocaleString()}
					</Text>
					<Group gap="md" mt={12}>
						<Badge
							variant="filled"
							color="blue"
							size="md"
							radius="xl"
							className="font-bold"
						>
							{session.completedLines} / {session.totalLines} lines
						</Badge>
						<Group gap="xs">
							<Clock size={16} />
							<Text size="sm" c="dimmed" ff="monospace" fw={700}>
								{Math.floor(session.elapsedMs / 1000 / 60)}m{" "}
								{Math.floor((session.elapsedMs / 1000) % 60)
									.toString()
									.padStart(2, "0")}
								s
							</Text>
						</Group>
					</Group>
				</Box>
				<Button
					color="blue"
					size="lg"
					radius="xl"
					onClick={handleSelectSession}
					leftSection={<Clock size={20} />}
					className="shadow-sm transition-transform hover:scale-105 active:scale-95"
				>
					Resume Session
				</Button>
			</Group>
		</SurfaceCard>
	);
}
