import { Box, Group, Text } from "@mantine/core";
import { PageTitle } from "@/components/ui/PageTitle";
import { BoothSettingsModal } from "./BoothSettingsModal";

export function BoothHeader() {
	return (
		<Box flex="0 0 auto">
			<Group justify="space-between" align="center" wrap="nowrap">
				<Box>
					<PageTitle>Booth</PageTitle>
					<Text fz="md" c="dimmed" mt={4}>
						Track your recording sessions line by line
					</Text>
				</Box>
				<BoothSettingsModal />
			</Group>
		</Box>
	);
}
