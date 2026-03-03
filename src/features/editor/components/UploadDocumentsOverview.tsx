import type { Script } from "@/types/Script";
import { Box, Group, Paper, Stack, Table, Text } from "@mantine/core";
import { IconFileText } from "@tabler/icons-react";

interface UploadDocumentsOverviewProps {
	scripts: Script[];
}

export function UploadDocumentsOverview({ scripts }: UploadDocumentsOverviewProps) {
	const totalBillableWords = scripts.reduce(
		(acc, script) => acc + script.overview.wordCount,
		0,
	);

	if (scripts.length === 0) {
		return (
			<Paper withBorder radius="md" p="md">
				<Stack gap="sm">
					<Group gap="xs">
						<IconFileText size={18} color="var(--mantine-color-gray-6)" />
						<Text fw={700} size="sm">
							No documents yet
						</Text>
					</Group>
					<Text size="sm" c="dimmed">
						Upload one or more documents to see billable dialogue word counts here.
					</Text>
				</Stack>
			</Paper>
		);
	}

	return (
		<Stack gap={0}>
			<Paper
				withBorder
				radius="md"
				p="md"
				style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
			>
				<Table stickyHeader highlightOnHover withTableBorder>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Document</Table.Th>
							<Table.Th w={130}>Billable words</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{scripts.map((script) => (
							<Table.Tr key={script.id}>
								<Table.Td>
									<Text fw={700} size="sm" lineClamp={2}>
										{script.name}
									</Text>
								</Table.Td>
								<Table.Td>{script.overview.wordCount}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</Paper>

			<Box
				py="sm"
				px="md"
				bg="gray.0"
				style={{
					border: "1px solid var(--mantine-color-default-border)",
					borderTop: "none",
					borderBottomLeftRadius: "var(--mantine-radius-md)",
					borderBottomRightRadius: "var(--mantine-radius-md)",
				}}
			>
				<Group justify="space-between" align="baseline">
					<Text size="sm" c="dimmed" fw={600} tt="uppercase" lts={0.5}>
						Total billable words
					</Text>
					<Text size="xl" fw={800} lh={1.2}>
						{totalBillableWords}
					</Text>
				</Group>
				<Text size="xs" c="dimmed" mt={4}>
					{scripts.length} document{scripts.length === 1 ? "" : "s"}
				</Text>
			</Box>
		</Stack>
	);
}

