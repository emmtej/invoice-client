import { Box, Group, Text } from "@mantine/core";
import { PageTitle } from "@/components/ui/text/PageTitle";

export function BoothHeader() {
	return (
		<Box px="md" pt="md" flex="0 0 auto">
			<Group justify="space-between" align="flex-start" wrap="nowrap">
				<Box>
					<PageTitle>Booth</PageTitle>
					<Text c="gray.5" mt={4}>
						Track your recording sessions line by line
					</Text>
				</Box>
			</Group>
		</Box>
	);
}
