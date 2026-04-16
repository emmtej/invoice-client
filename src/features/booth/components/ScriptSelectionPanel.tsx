import { Box, Button, Group, Stack, Text } from "@mantine/core";
import { useShallow } from "zustand/react/shallow";
import { SurfaceCard } from "@/components/ui/card/SurfaceCard";
import { useBoothStore } from "../store/useBoothStore";
import { ScriptSelector } from "./ScriptSelector";
import { SessionTimer } from "./SessionTimer";

interface ScriptSelectionPanelProps {
	setIsLoadingScripts: (loading: boolean) => void;
	isInitialLoading: boolean;
}

export function ScriptSelectionPanel({
	setIsLoadingScripts,
	isInitialLoading,
}: ScriptSelectionPanelProps) {
	const { script, status, setScript, resetSession } = useBoothStore(
		useShallow((s) => ({
			script: s.script,
			status: s.status,
			setScript: s.setScript,
			resetSession: s.resetSession,
		})),
	);

	return (
		<Stack gap="md">
			<Group justify="space-between" align="center">
				<Text fw={700} size="sm" c="gray.6" tt="uppercase" lts={0.5}>
					{status === "selecting" ? "Selected Script" : "Start New Session"}
				</Text>
				{status === "selecting" && (
					<Button
						variant="subtle"
						color="gray"
						size="xs"
						onClick={resetSession}
					>
						Choose another script
					</Button>
				)}
			</Group>

			{status === "idle" && (
				<ScriptSelector
					onSelect={setScript}
					onLoadingChange={setIsLoadingScripts}
					hideLoader={isInitialLoading}
				/>
			)}

			{status === "selecting" && script && (
				<SurfaceCard
					py={40}
					style={{ border: "1px dashed var(--mantine-color-gray-3)" }}
				>
					<Stack align="center" gap="xl">
						<Box ta="center">
							<Text fw={800} size="24px" c="gray.8">
								{script.name}
							</Text>
							<Text size="sm" c="gray.6" mt={4}>
								Ready to start recording
							</Text>
						</Box>
						<SessionTimer />
					</Stack>
				</SurfaceCard>
			)}
		</Stack>
	);
}
