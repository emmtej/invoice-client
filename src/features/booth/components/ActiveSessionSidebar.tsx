import { Box } from "@mantine/core";
import { SessionTimer } from "./SessionTimer";

export function ActiveSessionSidebar() {
	return (
		<Box
			w={{ base: "100%", md: 320 }}
			flex="0 0 auto"
			style={{
				borderLeft: "1px solid var(--color-stone)",
			}}
			pl={{ base: 0, md: "md" }}
		>
			<SessionTimer />
		</Box>
	);
}
