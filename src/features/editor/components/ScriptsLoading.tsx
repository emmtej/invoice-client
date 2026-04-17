import { Flex, Loader, Stack, Text } from "@mantine/core";
import { memo } from "react";

interface ScriptsLoadingProps {
	persistenceEnabled: boolean;
	message?: string;
	subtext?: string;
}

export const ScriptsLoading = memo(
	({ persistenceEnabled, message, subtext }: ScriptsLoadingProps) => {
		const defaultMessage = persistenceEnabled
			? "Initializing Workspace..."
			: "Optimizing Workspace...";

		const defaultSubtext = persistenceEnabled
			? "Preparing your local secure database"
			: "Setting up your secure offline environment";

		return (
			<Flex h="100%" align="center" justify="center">
				<Stack align="center" gap="xs">
					<Loader size="sm" color="wave" />
					<Text size="sm" fw={700} c="gray.6" tt="uppercase" lts={1}>
						{message || defaultMessage}
					</Text>
					<Text size="xs" c="gray.5">
						{subtext || defaultSubtext}
					</Text>
				</Stack>
			</Flex>
		);
	},
);

ScriptsLoading.displayName = "ScriptsLoading";
