import { Center, Loader, Paper, Stack, Text } from "@mantine/core";
import { usePgliteStore } from "@/features/storage/store/usePgliteStore";

export function RouteFallback({ label }: { label: string }) {
	const status = usePgliteStore((s) => s.status);
	const isDbInitializing = status === "initializing";

	return (
		<Center mih="50vh">
			<Paper withBorder p="xl" maw={360} w="100%" bg="white">
				<Stack gap="sm" align="center">
					<Loader color="wave" size="sm" />
					<Text fw={700} c="gray.8">
						{isDbInitializing ? "Setting up studio..." : `Loading ${label}`}
					</Text>
					<Text size="sm" c="gray.5" ta="center">
						{isDbInitializing
							? "Initializing your local database for the first time."
							: "Hang tight while this screen finishes loading."}
					</Text>
				</Stack>
			</Paper>
		</Center>
	);
}
