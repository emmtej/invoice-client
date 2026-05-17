import { Button, Center, Loader, Paper, Stack, Text } from "@mantine/core";
import { AlertCircle, RefreshCw } from "lucide-react";
import { initDb, resetDb } from "@/features/storage/pgliteClient";
import { usePgliteStore } from "@/features/storage/usePgliteStore";

export function RouteFallback({ label }: { label: string }) {
	const status = usePgliteStore((s) => s.status);
	const isDbInitializing = status === "initializing";
	const isDbError = status === "error";

	const handleRetry = () => {
		resetDb();
		void initDb();
	};

	if (isDbError) {
		return (
			<Center mih="50vh">
				<Paper withBorder p="xl" maw={360} w="100%" bg="white">
					<Stack gap="sm" align="center">
						<AlertCircle size={32} color="var(--mantine-color-red-6)" />
						<Text fw={700} >
							Database Error
						</Text>
						<Text size="sm" c="dimmed" ta="center">
							Failed to initialize local storage. This can happen if another tab
							is using the database or if storage is blocked.
						</Text>
						<Button
							variant="subtle"
							color="blue"
							leftSection={<RefreshCw size={14} />}
							onClick={handleRetry}
							size="xs"
							mt="xs"
						>
							Retry Initialization
						</Button>
					</Stack>
				</Paper>
			</Center>
		);
	}

	return (
		<Center mih="50vh">
			<Paper withBorder p="xl" maw={360} w="100%" bg="white">
				<Stack gap="sm" align="center">
					<Loader color="blue" size="sm" />
					<Text fw={700} >
						{isDbInitializing ? "Setting up studio..." : `Loading ${label}`}
					</Text>
					<Text size="sm" c="dimmed" ta="center">
						{isDbInitializing
							? "Initializing your local database for the first time."
							: "Hang tight while this screen finishes loading."}
					</Text>
				</Stack>
			</Paper>
		</Center>
	);
}
