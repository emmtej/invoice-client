import { Box } from "@mantine/core";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { SectionLabel } from "@/components/ui/text/SectionLabel";
import { scriptsQueries } from "@/features/scripts/store/scriptsQueries";
import type { BoothSession } from "../store/boothQueries";
import { useBoothStore } from "../store/useBoothStore";
import { SessionHistory } from "./SessionHistory";

interface SelectionSidebarProps {
	isInitialLoading: boolean;
}

export function SelectionSidebar({ isInitialLoading }: SelectionSidebarProps) {
	const { sessions, isLoadingSessions, deleteSessionRecord, restoreSession } =
		useBoothStore(
			useShallow((s) => ({
				sessions: s.sessions,
				isLoadingSessions: s.isLoadingSessions,
				deleteSessionRecord: s.deleteSessionRecord,
				restoreSession: s.restoreSession,
			})),
		);

	const ongoingSession = sessions.find((s) => s.status === "in_progress");

	const handleSelectSession = useCallback(
		async (session: BoothSession) => {
			if (session.status !== "in_progress") return;
			const scriptForSession = await scriptsQueries.getScriptById(
				session.scriptId,
			);
			if (!scriptForSession) return;
			restoreSession(scriptForSession, session);
		},
		[restoreSession],
	);

	return (
		<Box
			w={{ base: "100%", md: 320 }}
			style={{
				borderLeft: "1px solid var(--mantine-color-gray-2)",
				display: "flex",
				flexDirection: "column",
			}}
			pl={{ base: 0, md: "xl" }}
			pt={{ base: "xl", md: 0 }}
		>
			<SectionLabel mb="md">Sessions</SectionLabel>
			<SessionHistory
				sessions={
					ongoingSession
						? sessions.filter((s) => s.id !== ongoingSession.id)
						: sessions
				}
				isLoading={isLoadingSessions}
				onDelete={deleteSessionRecord}
				onSelect={handleSelectSession}
				hideLoader={isInitialLoading}
			/>
		</Box>
	);
}
