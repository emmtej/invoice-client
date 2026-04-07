import { Flex, Loader, Stack, Text } from "@mantine/core";
import { memo } from "react";

interface ScriptsLoadingProps {
	persistenceEnabled: boolean;
}

export const ScriptsLoading = memo(
	({ persistenceEnabled }: ScriptsLoadingProps) => {
		return (
			<Flex h="100%" align="center" justify="center">
				<Stack align="center" gap="xs">
					<Loader size="sm" color="wave" />
					<Text size="sm" fw={700} c="gray.6" tt="uppercase" lts={1}>
						{persistenceEnabled
							? "Initializing Workspace..."
							: "Optimizing Workspace..."}
					</Text>
					<Text size="xs" c="gray.5">
						{persistenceEnabled
							? "Preparing your local secure database"
							: "Setting up your secure offline environment"}
					</Text>
				</Stack>
			</Flex>
		);
	},
);

ScriptsLoading.displayName = "ScriptsLoading";
