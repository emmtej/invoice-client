import { Center, Flex, Loader, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useBoothStore } from "../store/useBoothStore";
import { OngoingSessionCard } from "./OngoingSessionCard";
import { ScriptSelectionPanel } from "./ScriptSelectionPanel";
import { SelectionSidebar } from "./SelectionSidebar";

export function SelectionView() {
	const { sessions, isLoadingSessions } = useBoothStore(
		useShallow((s) => ({
			sessions: s.sessions,
			isLoadingSessions: s.isLoadingSessions,
		})),
	);

	const [isLoadingScripts, setIsLoadingScripts] = useState(true);

	const isInitialLoading = isLoadingSessions || isLoadingScripts;

	const ongoingSession = sessions.find((s) => s.status === "in_progress");

	return (
		<Flex
			direction={{ base: "column", md: "row" }}
			flex={1}
			mih={0}
			gap="xl"
			px="md"
			py="md"
		>
			{isInitialLoading && (
				<Center flex={1}>
					<Stack align="center" gap="xs">
						<Loader color="wave" size="sm" />
						<Text size="sm" c="gray.6" fw={500}>
							Loading...
						</Text>
					</Stack>
				</Center>
			)}

			<Stack
				gap="xl"
				flex={1}
				mih={0}
				style={{
					overflow: "auto",
					display: isInitialLoading ? "none" : "flex",
				}}
			>
				{ongoingSession && (
					<Stack gap="sm">
						<Text fw={700} size="sm" c="gray.6" tt="uppercase" lts={0.5}>
							Ongoing Session
						</Text>
						<OngoingSessionCard session={ongoingSession} />
					</Stack>
				)}

				<ScriptSelectionPanel
					setIsLoadingScripts={setIsLoadingScripts}
					isInitialLoading={isInitialLoading}
				/>
			</Stack>

			{!isInitialLoading && (
				<SelectionSidebar isInitialLoading={isInitialLoading} />
			)}
		</Flex>
	);
}
