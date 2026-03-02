import type { Script } from "@/types/Script";
import { Badge, Divider, Group, Paper, ScrollArea, Stack, Table, Text } from "@mantine/core";
import { IconFileText, IconReportAnalytics } from "@tabler/icons-react";

interface UploadDocumentsOverviewProps {
	scripts: Script[];
}

export function UploadDocumentsOverview({ scripts }: UploadDocumentsOverviewProps) {
	const totals = scripts.reduce(
		(acc, script) => {
			acc.billableWords += script.overview.wordCount;
			acc.totalLines += script.overview.totalLines;
			acc.invalidLines += script.overview.invalidLines.length;
			return acc;
		},
		{ billableWords: 0, totalLines: 0, invalidLines: 0 },
	);

	if (scripts.length === 0) {
		return (
			<Paper withBorder radius="md" p="md">
				<Stack gap={6}>
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
		<Stack gap="sm">
			<Paper withBorder radius="md" p="md">
				<Stack gap={8}>
					<Group justify="space-between" align="flex-start">
						<Group gap="xs">
							<IconReportAnalytics size={18} color="var(--mantine-color-blue-6)" />
							<div>
								<Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={0.5} style={{ lineHeight: 1 }}>
									Total billable words
								</Text>
								<Text size="lg" fw={800} style={{ lineHeight: 1.2 }}>
									{totals.billableWords}
								</Text>
							</div>
						</Group>
						<Badge variant="light" color="gray">
							{scripts.length} doc{scripts.length === 1 ? "" : "s"}
						</Badge>
					</Group>

					<Divider />

					<Group justify="space-between">
						<Text size="sm" c="dimmed">
							Total lines
						</Text>
						<Text size="sm" fw={700}>
							{totals.totalLines}
						</Text>
					</Group>
					<Group justify="space-between">
						<Text size="sm" c="dimmed">
							Invalid lines
						</Text>
						<Text size="sm" fw={700} c={totals.invalidLines > 0 ? "red" : undefined}>
							{totals.invalidLines}
						</Text>
					</Group>
					<Table stickyHeader highlightOnHover >
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Document</Table.Th>
								<Table.Th w={130}>Billable words</Table.Th>
								<Table.Th w={110}>Total lines</Table.Th>

							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{scripts.map((script) =>  (
									<Table.Tr key={script.id}>
										<Table.Td>
											<Text fw={700} size="sm" lineClamp={2}>
												{script.name}
											</Text>
										</Table.Td>
										<Table.Td>

												{script.overview.wordCount}

										</Table.Td>
										<Table.Td>

												{script.overview.totalLines}

										</Table.Td>
										
									</Table.Tr>
								)
							)}
						</Table.Tbody>
					</Table>
				</Stack>
			</Paper>
		</Stack>
	);
}

