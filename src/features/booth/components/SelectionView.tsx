import { Box, Center, Flex, Loader, Stack, Text } from "@mantine/core";
import { type ReactNode, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useBoothStore } from "../store/useBoothStore";
import { OngoingSessionCard } from "./OngoingSessionCard";
import { ScriptSelectionPanel } from "./ScriptSelectionPanel";
import { SelectionSidebar } from "./SelectionSidebar";

interface SelectionViewProps {
	header?: ReactNode;
}

export function SelectionView({ header }: SelectionViewProps) {
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
			direction={{ base: "column", lg: "row" }}
			flex={1}
			mih={0}
			gap={48}
			px={{ base: "md", lg: "xl" }}
			py="xl"
		>
			<Stack
				gap={32}
				flex={1}
				mih={0}
				style={{
					display: isInitialLoading ? "none" : "flex",
				}}
			>
				{header}

				{ongoingSession && (
					<Stack gap="sm">
						<Text fw={700} size="sm" c="gray.7" tt="uppercase" lts={0.5}>
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

			{!isInitialLoading && (
				<Box
					w={{ base: "100%", lg: 320 }}
					style={{ flexShrink: 0 }}
					className="lg:border-l border-gray-100"
					pl={{ base: 0, lg: 48 }}
				>
					<SelectionSidebar isInitialLoading={isInitialLoading} />
				</Box>
			)}
		</Flex>
	);
}
