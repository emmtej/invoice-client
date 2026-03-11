import {
	Badge,
	Box,
	Button,
	Group,
	Paper,
	ScrollArea,
	Select,
	Stack,
	Table,
	Text,
	Title,
} from "@mantine/core";
import { IconEdit, IconFileText, IconFilter } from "@tabler/icons-react";
import { memo, useMemo, useState } from "react";
import type { ParsedLine, Script } from "@/types/Script";

const stackRootStyle = { flex: 1, minHeight: 0, overflow: "hidden" as const };
const boxFlexStyle = { flex: 1 };
const boxScrollStyle = { flex: 1, minHeight: 0, overflow: "hidden" as const };

interface ScriptOverviewProps {
	script: Script;
	onEdit?: () => void;
}

const getLineBadgeProps = (type: string) => {
	switch (type) {
		case "dialogue":
			return { color: "violet", variant: "filled" as const };
		case "action":
			return { color: "teal", variant: "light" as const };
		case "marker":
			return { color: "blue", variant: "light" as const };
		case "malformed":
			return { color: "red", variant: "light" as const };
		case "invalid":
			return { color: "orange", variant: "light" as const };
		default:
			return { color: "gray", variant: "light" as const };
	}
};

const ScriptLineRow = memo(({ line }: { line: ParsedLine }) => {
	const badgeProps = getLineBadgeProps(line.type);

	return (
		<Table.Tr>
			<Table.Td>
				<Badge {...badgeProps} fullWidth tt="capitalize">
					{line.type}
				</Badge>
			</Table.Td>
			<Table.Td>
				<Group justify="space-between" wrap="nowrap" align="center">
					<Text size="sm" lineClamp={2} style={{ flex: 1 }}>
						{line.source}
					</Text>
					{line.type === "dialogue" && (
						<Badge variant="dot" color="gray" size="sm" style={{ flex: "0 0 auto" }}>
							{line.metadata.wordCount} words
						</Badge>
					)}
				</Group>
			</Table.Td>
		</Table.Tr>
	);
});

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
					<IconFileText
						size={28}
						stroke={1.5}
						color="var(--mantine-color-violet-6)"
					/>
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
						<Text c="dimmed" ta="center" py="xl" size="sm">
							No lines matching the selected filter.
						</Text>
					) : (
						<Table stickyHeader>
							<Table.Thead>
								<Table.Tr>
									<Table.Th w={120}>Type</Table.Th>
									<Table.Th>Content / Source</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{filteredLines.map((line, index) => (
									<ScriptLineRow
										key={line.id ?? `line-${index}-${line.type}`}
										line={line}
									/>
								))}
							</Table.Tbody>
						</Table>
					)}
				</ScrollArea>
			</Box>
		</Stack>
	);
}

export const ScriptOverview = memo(ScriptOverviewInner);
