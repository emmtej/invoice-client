import { Box, Flex } from "@mantine/core";
import { ActiveSessionHeader } from "./ActiveSessionHeader";
import { ActiveSessionSidebar } from "./ActiveSessionSidebar";
import { ScriptTeleprompter } from "./ScriptTeleprompter";
import { SessionProgress } from "./SessionProgress";

export function ActiveSessionView() {
	return (
		<Flex
			direction={{ base: "column", md: "row" }}
			flex={1}
			mih={0}
			gap="md"
			px="md"
			pb="md"
			pt="md"
		>
			<Flex direction="column" flex={1} mih={0} gap="sm">
				<ActiveSessionHeader />
				<Box flex="0 0 auto">
					<SessionProgress />
				</Box>
				<Box flex={1} mih={0}>
					<ScriptTeleprompter />
				</Box>
			</Flex>
			<ActiveSessionSidebar />
		</Flex>
	);
}
