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
	ThemeIcon,
	Title,
} from "@mantine/core";
import {
	IconAlertCircle,
	IconBolt,
	IconBookmark,
	IconCircleX,
	IconEdit,
	IconFileText,
	IconFilter,
	IconMessage2,
} from "@tabler/icons-react";
import { memo, useMemo, useState } from "react";
import type { ParsedLine, Script } from "@/types/Script";

const stackRootStyle = { flex: 1, minHeight: 0, overflow: "hidden" as const };
const boxFlexStyle = { flex: 1 };
const boxScrollStyle = { flex: 1, minHeight: 0, overflow: "hidden" as const };

interface ScriptOverviewProps {
	script: Script;
	onEdit?: () => void;
}

const TYPE_CONFIG = {
	dialogue: {
		icon: IconMessage2,
		color: "indigo",
		label: "Dialogue",
		bg: "var(--mantine-color-indigo-0)",
		border: "var(--mantine-color-indigo-2)",
	},
	action: {
		icon: IconBolt,
		color: "teal",
		label: "Action",
		bg: "var(--mantine-color-teal-0)",
		border: "var(--mantine-color-teal-2)",
	},
	marker: {
		icon: IconBookmark,
		color: "gray",
		label: "Marker",
		bg: "var(--mantine-color-gray-0)",
		border: "var(--mantine-color-gray-2)",
	},
	malformed: {
		icon: IconAlertCircle,
		color: "orange",
		label: "Malformed",
		bg: "var(--mantine-color-orange-0)",
		border: "var(--mantine-color-orange-2)",
	},
	invalid: {
		icon: IconCircleX,
		color: "red",
		label: "Invalid",
		bg: "var(--mantine-color-red-0)",
		border: "var(--mantine-color-red-2)",
	},
} as const;

const TypeBadge = memo(({ type }: { type: string }) => {
	const config =
		TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.marker;
	const Icon = config.icon;

	return (
		<Group gap={8} wrap="nowrap">
			<ThemeIcon
				variant="light"
				color={config.color}
				size="sm"
				radius="sm"
				style={{
					backgroundColor: config.bg,
					border: `1px solid ${config.border}`,
				}}
			>
				<Icon size={12} stroke={2.5} />
			</ThemeIcon>
			<Text size="xs" fw={700} c="dimmed" tt="uppercase" lts="0.05em">
				{config.label}
			</Text>
		</Group>
	);
});

const ScriptLineRow = memo(({ line }: { line: ParsedLine }) => {
	return (
		<Table.Tr>
			<Table.Td py="md" w={160}>
				<TypeBadge type={line.type} />
			</Table.Td>
			<Table.Td py="md">
				<Group justify="space-between" wrap="nowrap" align="center" gap="lg">
					<Text size="sm" c="gray.7" style={{ flex: 1, lineHeight: 1.6 }}>
						{line.source}
					</Text>
					{line.type === "dialogue" && (
						<Badge
							variant="outline"
							color="gray.4"
							size="xs"
							radius="xs"
							styles={{
								label: {
									color: "var(--mantine-color-gray-6)",
									fontWeight: 600,
								},
							}}
							style={{ flex: "0 0 auto", borderStyle: "dashed" }}
						>
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
		<Stack gap="lg" p="xl" style={stackRootStyle} bg="gray.0">
			<Paper p="lg" radius="md" withBorder shadow="sm">
				<Group gap="md" align="center" mb="xl">
					<ThemeIcon
						size={40}
						radius="md"
						variant="light"
						color="studio"
						style={{ backgroundColor: "var(--mantine-color-studio-0)" }}
					>
						<IconFileText size={24} stroke={1.5} />
					</ThemeIcon>
					<Stack gap={2}>
						<Title order={3} fw={700}>
							{script.name}
						</Title>
						<Text size="xs" c="dimmed" fw={500}>
							Script Preview & Verification
						</Text>
					</Stack>
					<Box style={boxFlexStyle} />
					{onEdit && (
						<Button
							variant="filled"
							color="studio"
							leftSection={<IconEdit size={16} />}
							onClick={onEdit}
							radius="md"
						>
							Edit Script
						</Button>
					)}
				</Group>

				<Group justify="space-between" align="flex-end">
					<Group gap="xl">
						<Stack gap={2}>
							<Text size="xs" c="dimmed" fw={700} tt="uppercase" lts="0.05em">
								Total Lines
							</Text>
							<Text size="sm" fw={600}>
								{overview.totalLines}
							</Text>
						</Stack>
						<Stack gap={2}>
							<Text size="xs" c="dimmed" fw={700} tt="uppercase" lts="0.05em">
								Words
							</Text>
							<Text size="sm" fw={600}>
								{overview.wordCount}
							</Text>
						</Stack>
						<Stack gap={2}>
							<Text size="xs" c="dimmed" fw={700} tt="uppercase" lts="0.05em">
								Status
							</Text>
							<Group gap={6}>
								{overview.invalidLines.length > 0 ? (
									<>
										<Box
											w={8}
											h={8}
											bg="red.6"
											style={{ borderRadius: "50%" }}
										/>
										<Text size="sm" fw={600} c="red.7">
											{overview.invalidLines.length} Issues
										</Text>
									</>
								) : (
									<>
										<Box
											w={8}
											h={8}
											bg="green.6"
											style={{ borderRadius: "50%" }}
										/>
										<Text size="sm" fw={600} c="green.7">
											Validated
										</Text>
									</>
								)}
							</Group>
						</Stack>
					</Group>
					<Select
						placeholder="Filter by type"
						data={availableTypes}
						value={typeFilter}
						onChange={setTypeFilter}
						clearable
						size="sm"
						radius="md"
						leftSection={<IconFilter size={14} />}
						variant="default"
						w={180}
					/>
				</Group>
			</Paper>

			<Paper radius="md" withBorder shadow="sm" style={boxScrollStyle}>
				<ScrollArea h="100%" scrollbars="y" type="hover" offsetScrollbars>
					{filteredLines.length === 0 ? (
						<Stack align="center" py={60} gap="xs">
							<IconFilter
								size={32}
								stroke={1}
								color="var(--mantine-color-gray-4)"
							/>
							<Text c="dimmed" ta="center" size="sm" fw={500}>
								No lines matching the selected filter.
							</Text>
						</Stack>
					) : (
						<Table stickyHeader verticalSpacing="sm" horizontalSpacing="lg">
							<Table.Thead
								style={{
									backgroundColor: "var(--mantine-color-gray-0)",
									zIndex: 10,
								}}
							>
								<Table.Tr>
									<Table.Th
										w={160}
										style={{
											borderBottom: "1px solid var(--mantine-color-gray-2)",
										}}
									>
										<Text
											size="xs"
											fw={700}
											c="dimmed"
											tt="uppercase"
											lts="0.05em"
										>
											Line Type
										</Text>
									</Table.Th>
									<Table.Th
										style={{
											borderBottom: "1px solid var(--mantine-color-gray-2)",
										}}
									>
										<Text
											size="xs"
											fw={700}
											c="dimmed"
											tt="uppercase"
											lts="0.05em"
										>
											Content / Source
										</Text>
									</Table.Th>
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
			</Paper>
		</Stack>
	);
}

export const ScriptOverview = memo(ScriptOverviewInner);
