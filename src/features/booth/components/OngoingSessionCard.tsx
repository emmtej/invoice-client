import { Badge, Box, Button, Group, Text } from "@mantine/core";
import { Clock } from "lucide-react";
import { useCallback } from "react";
import { SurfaceCard } from "@/components/ui/card/SurfaceCard";
import { scriptsQueries } from "@/features/scripts/store/scriptsQueries";
import type { BoothSession } from "../store/boothQueries";
import { useBoothStore } from "../store/useBoothStore";

interface OngoingSessionCardProps {
	session: BoothSession;
}

export function OngoingSessionCard({ session }: OngoingSessionCardProps) {
	const restoreSession = useBoothStore((s) => s.restoreSession);

	const handleSelectSession = useCallback(async () => {
		if (session.status !== "in_progress") return;
		const scriptForSession = await scriptsQueries.getScriptById(
			session.scriptId,
		);
		if (!scriptForSession) return;
		restoreSession(scriptForSession, session);
	}, [session, restoreSession]);

	return (
		<SurfaceCard
			style={{
				border: "2px solid var(--mantine-color-wave-3)",
				backgroundColor: "var(--mantine-color-wave-0)",
				boxShadow: "0 4px 12px rgba(0, 150, 136, 0.08)",
			}}
		>
			<Group justify="space-between" align="center">
				<Box>
					<Text fw={800} size="xl" c="gray.9" lts={-0.2}>
						{session.scriptName}
					</Text>
					<Text size="sm" c="gray.7" fw={500}>
						Started {new Date(session.startedAt).toLocaleString()}
					</Text>
					<Group gap="md" mt={12}>
						<Badge
							variant="filled"
							color="wave"
							size="md"
							className="font-bold"
						>
							{session.completedLines} / {session.totalLines} lines
						</Badge>
						<Group gap="xs">
							<Clock size={16} color="var(--mantine-color-gray-6)" />
							<Text size="sm" c="gray.7" ff="monospace" fw={700}>
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
					color="wave"
					size="lg"
					onClick={handleSelectSession}
					leftSection={<Clock size={20} />}
					style={{
						transition: "transform 150ms ease",
					}}
					className="hover:scale-105 active:scale-95"
				>
					Resume Session
				</Button>
			</Group>
		</SurfaceCard>
	);
}
