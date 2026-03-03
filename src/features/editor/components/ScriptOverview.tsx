import type { Script } from "@/types/Script";
import { Badge, Box, Button, Group, Paper, ScrollArea, Select, Stack, Table, Text, Title } from "@mantine/core";
import { IconEdit, IconFileText, IconFilter } from "@tabler/icons-react";
import { memo, useMemo, useState } from "react";

const stackRootStyle = { flex: 1, minHeight: 0, overflow: "hidden" as const };
const boxFlexStyle = { flex: 1 };
const boxScrollStyle = { flex: 1, minHeight: 0, overflow: "hidden" as const };

interface ScriptOverviewProps {
	script: Script;
	onEdit?: () => void;
}

function ScriptOverviewInner({ script, onEdit }: ScriptOverviewProps) {
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
		<Stack gap="lg" p="lg" style={stackRootStyle}>
			<Paper>
				<Group gap="md" align="center" mb="lg">
					<IconFileText size={28} stroke={1.5} color="var(--mantine-color-violet-6)" />
					<Title order={2}>{script.name}</Title>
					<Box style={boxFlexStyle} />
					{onEdit && (
						<Button
							variant="light"
							color="violet"
							leftSection={<IconEdit size={16} />}
							onClick={onEdit}
						>
							Edit Script
						</Button>
					)}
				</Group>

				<Group justify="space-between" mb="md" align="flex-end">
					<Text size="sm" c="dimmed">
						Total lines: {overview.totalLines} · Words: {overview.wordCount} ·{" "}
						<Text
							span
							size="sm"
							c={overview.invalidLines.length > 0 ? "red" : "dimmed"}
							inherit
						>
							Invalid: {overview.invalidLines.length}
						</Text>
					</Text>
					<Select
						placeholder="Filter by type"
						data={availableTypes}
						value={typeFilter}
						onChange={setTypeFilter}
						clearable
						size="xs"
						leftSection={<IconFilter size={14} />}
						variant="default"
					/>
				</Group>
			</Paper>

			<Box style={boxScrollStyle}>
				<ScrollArea h="100%" scrollbars="y" type="hover">
					{filteredLines.length === 0 ? (
						<Text c="dimmed" ta="center" py="xl" size="sm">No lines matching the selected filter.</Text>
					) : (
						<Table
							stickyHeader
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
									const lineKey = line.id ?? `line-${index}-${line.type}`;
									return (
										<Table.Tr key={lineKey}>
											<Table.Td>
												<Badge
													variant="light"
													color={isInvalid ? "red" : "violet"}
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

export const ScriptOverview = memo(ScriptOverviewInner);
