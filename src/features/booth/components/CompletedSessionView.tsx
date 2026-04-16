import { Stack } from "@mantine/core";
import { SessionSummary } from "./SessionSummary";

export function CompletedSessionView() {
	return (
		<Stack px="md" py="md" flex={1} mih={0} style={{ overflow: "auto" }}>
			<SessionSummary />
		</Stack>
	);
}
