import type { Script } from "@/types/Script";
import { Badge, Box, Button, Group, Paper, ScrollArea, Select, SimpleGrid, Stack, Table, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconEdit, IconFileText, IconFilter, IconHash, IconReportAnalytics } from "@tabler/icons-react";
import { useMemo, useState } from "react";

interface ScriptOverviewProps {
	script: Script;
	onEdit?: () => void;
}

export function ScriptOverview({ script, onEdit }: ScriptOverviewProps) {
	const { overview } = script;
	const [typeFilter, setTypeFilter] = useState<string | null>(null);

	const availableTypes = useMemo(() => {
		const types = new Set(script.lines.map((line) => line.type));
		return Array.from(types).map((type) => ({
			value: type,
			label: type.charAt(0).toUpperCase() + type.slice(1),
		}));
	}, [script.lines]);

	const filteredLines = useMemo(() => {
		if (!typeFilter) return script.lines;
		return script.lines.filter((line) => line.type === typeFilter);
	}, [script.lines, typeFilter]);

	return (
		<Stack gap="lg" p="md" style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
			<Paper radius="md" shadow="sm">
				<Group justify="space-between" mb="xl">
					<Stack gap={4}>
						<Group gap="xs">
							<IconFileText size={28} stroke={1.5} color="var(--mantine-color-blue-filled)" />
							<Title order={2}>{script.name}</Title>
						</Group>
					</Stack>
					{onEdit && (
						<Button
							variant="light"
							leftSection={<IconEdit size={16} />}
							onClick={onEdit}
						>
							Edit Script
						</Button>
					)}
				</Group>

				<SimpleGrid cols={{ base: 1, xs: 3 }} spacing="xl" mb="xl">
					<Group gap="md">
						<Paper withBorder p="xs" radius="sm" bg="var(--mantine-color-gray-0)">
							<IconHash size={20} stroke={1.5} color="var(--mantine-color-gray-7)" />
						</Paper>
						<Stack gap={0}>
							<Text size="xs" c="dimmed" fw={600} tt="uppercase" lts={0.8}>Total Lines</Text>
							<Text size="xl" fw={700} style={{ lineHeight: 1 }}>{overview.totalLines}</Text>
						</Stack>
					</Group>

					<Group gap="md">
						<Paper withBorder p="xs" radius="sm" bg="var(--mantine-color-blue-0)">
							<IconReportAnalytics size={20} stroke={1.5} color="var(--mantine-color-blue-7)" />
						</Paper>
						<Stack gap={0}>
							<Text size="xs" c="dimmed" fw={600} tt="uppercase" lts={0.8}>Word Count</Text>
							<Text size="xl" fw={700} style={{ lineHeight: 1 }}>{overview.wordCount}</Text>
						</Stack>
					</Group>

					<Group gap="md">
						<Paper 
							withBorder 
							p="xs" 
							radius="sm" 
							bg={overview.invalidLines.length > 0 ? "var(--mantine-color-red-0)" : "var(--mantine-color-gray-0)"}
						>
							<IconAlertCircle 
								size={20} 
								stroke={1.5} 
								color={overview.invalidLines.length > 0 ? "var(--mantine-color-red-7)" : "var(--mantine-color-gray-7)"} 
							/>
						</Paper>
						<Stack gap={0}>
							<Text size="xs" c="dimmed" fw={600} tt="uppercase" lts={0.8}>Invalid Lines</Text>
							<Text 
								size="xl" 
								fw={700} 
								style={{ lineHeight: 1 }}
								c={overview.invalidLines.length > 0 ? "red" : "inherit"}
							>
								{overview.invalidLines.length}
							</Text>
						</Stack>
					</Group>
				</SimpleGrid>

				<Group justify="space-between" mb="md" align="flex-end">
					<Title order={4}>Line Details</Title>
					<Select
						placeholder="Filter by type"
						data={availableTypes}
						value={typeFilter}
						onChange={setTypeFilter}
						clearable
						size="xs"
						leftSection={<IconFilter size={14} />}
						variant="filled"
						styles={{
							input: {
								backgroundColor: "var(--mantine-color-gray-0)",
								borderRadius: "var(--mantine-radius-sm)",
							}
						}}
					/>
				</Group>
			</Paper>

			<Box style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
				<ScrollArea h="100%" scrollbars="y" type="hover">
					{filteredLines.length === 0 ? (
						<Text c="dimmed" ta="center" py="xl" size="sm">No lines matching the selected filter.</Text>
					) : (
						<Table
							stickyHeader
							stickyHeaderOffset={0}
							striped
							highlightOnHover
							withTableBorder
						>
							<Table.Thead>
								<Table.Tr>
									<Table.Th w={120}>Type</Table.Th>
									<Table.Th>Content / Source</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{filteredLines.map((line, index) => {
									const isInvalid = line.type === "invalid" || line.type === "malformed";
									return (
										<Table.Tr key={`${index}-${line.type}`}>
											<Table.Td>
												<Badge
													variant="light"
													color={isInvalid ? "red" : "blue"}
													fullWidth
												>
													{line.type}
												</Badge>
											</Table.Td>
											<Table.Td>
												<Text size="sm" lineClamp={2}>
													{line.source}
												</Text>
											</Table.Td>
										</Table.Tr>
									);
								})}
							</Table.Tbody>
						</Table>
					)}
				</ScrollArea>
			</Box>
		</Stack>
	);
}
