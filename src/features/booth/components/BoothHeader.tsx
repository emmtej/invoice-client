import { Box, Group, Text } from "@mantine/core";
import { PageTitle } from "@/components/ui/text/PageTitle";
import { BoothSettingsModal } from "./BoothSettingsModal";

export function BoothHeader() {
	return (
		<Box flex="0 0 auto">
			<Group justify="space-between" align="center" wrap="nowrap">
				<Box>
					<PageTitle size="42px">Booth</PageTitle>
					<Text fz="md" c="gray.7" mt={4} className="page-subtitle">
						Track your recording sessions line by line
					</Text>
				</Box>
				<BoothSettingsModal />
			</Group>
		</Box>
	);
}
