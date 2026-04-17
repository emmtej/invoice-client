import { Box, Group, Text } from "@mantine/core";
import { PageTitle } from "@/components/ui/text/PageTitle";
import { BoothSettingsModal } from "./BoothSettingsModal";

export function BoothHeader() {
	return (
		<Box px="md" pt="md" flex="0 0 auto">
			<Group justify="space-between" align="center" wrap="nowrap">
				<Box>
					<PageTitle>Booth</PageTitle>
					<Text fz="sm" c="gray.5" mt={2}>
						Track your recording sessions line by line
					</Text>
				</Box>
				<BoothSettingsModal />
			</Group>
		</Box>
	);
}
