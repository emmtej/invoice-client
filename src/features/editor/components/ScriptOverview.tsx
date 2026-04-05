import {
	Badge,
	Box,
	Button,
	Flex,
	Group,
	ScrollArea,
	Select,
	Stack,
	Table,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import {
	AlertCircle,
	Edit3,
	Filter,
	MessageSquare,
	Search,
	Tag,
	Zap,
} from "lucide-react";
import { memo, useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { SectionLabel } from "@/components/ui/text/SectionLabel";
import type { ParsedLine, Script } from "@/types/Script";

const TYPE_CONFIG = {
	dialogue: {
		icon: MessageSquare,
		color: "indigo",
		label: "Dialogue",
		bg: "var(--mantine-color-indigo-0)",
		border: "var(--mantine-color-indigo-2)",
	},
	action: {
		icon: Zap,
		color: "teal",
		label: "Action",
		bg: "var(--mantine-color-teal-0)",
		border: "var(--mantine-color-teal-2)",
	},
	marker: {
		icon: Tag,
		color: "gray",
		label: "Marker",
		bg: "var(--mantine-color-gray-0)",
		border: "var(--mantine-color-gray-2)",
	},
	malformed: {
		icon: AlertCircle,
		color: "orange",
		label: "Malformed",
		bg: "var(--mantine-color-orange-0)",
		border: "var(--mantine-color-orange-2)",
	},
	invalid: {
		icon: AlertCircle,
		color: "red",
		label: "Invalid",
		bg: "var(--mantine-color-red-0)",
		border: "var(--mantine-color-red-2)",
	},
} as const;

const TypeBadge = memo(({ type }: { type: ParsedLine["type"] }) => {
	const config =
		TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.marker;
	const Icon = config.icon;

	return (
		<Group gap={8} wrap="nowrap">
			<ThemeIcon variant="transparent" color={config.color} size="sm">
				<Icon size={14} strokeWidth={2.5} />
			</ThemeIcon>
			<Text size="xs" fw={600} c="gray.5" tt="uppercase" lts="0.05em">
				{config.label}
			</Text>
		</Group>
	);
});

const ScriptLineRow = memo(({ line }: { line: ParsedLine }) => {
	return (
		<Table.Tr className="transition-colors hover:bg-gray-50/70">
			<Table.Td py="sm" w={180}>
				<TypeBadge type={line.type} />
			</Table.Td>
			<Table.Td py="sm">
				<Group justify="space-between" wrap="nowrap" align="center" gap="xl">
					<Text
						size="md"
						c="gray.8"
						fw={500}
						className="leading-relaxed"
						style={{ flex: 1 }}
					>
						{line.source}
					</Text>
					{line.type === "dialogue" && (
						<Badge
							variant="outline"
							color="gray"
							size="sm"
							className="border-dashed bg-white shrink-0"
							styles={{
								label: {
									color: "var(--mantine-color-gray-6)",
									fontWeight: 700,
								},
							}}
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

	const headerStickyStyle = {
		borderBottom: "1px solid var(--mantine-color-gray-2)",
		position: "sticky" as const,
		top: 0,
		zIndex: 20,
	};
	const tableHeadStickyStyle = {
		position: "sticky" as const,
		top: 0,
		zIndex: 10,
		backgroundColor: "var(--mantine-color-white)",
	};
	const tableThBorderStyle = {
		borderBottom: "1px solid var(--mantine-color-gray-2)",
	} as const;

	return (
		<Stack gap={0} h="100%" bg="white" style={{ overflow: "hidden" }}>
			{/* Modern Dashboard Header */}
			<Box p="lg" bg="white" style={headerStickyStyle}>
				<Flex justify="space-between" align="center" mb={16} gap="xl">
					<Group gap={20}>
						<Stack gap={4}>
							<Group gap="sm">
								<Title
									order={1}
									size="42px"
									className="tracking-tight text-balance"
								>
									{script.name}
								</Title>
								{overview.invalidLines.length === 0 && (
									<Badge
										variant="dot"
										color="wave"
										size="sm"
										className="border-wave-100 bg-wave-50 text-wave-700"
									>
										Verified
									</Badge>
								)}
							</Group>
							<Group gap="xs">
								<Badge variant="dot" color="wave" size="sm">
									{overview.totalLines} Lines
								</Badge>
							</Group>
						</Stack>
					</Group>

					{/* Notion-style Property Bar: Horizontal */}
					<Group gap="xl" wrap="nowrap" align="center">
						<Group gap={8} wrap="nowrap">
							<Box
								className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-[10px]"
								c="gray.5"
							>
								<MessageSquare size={12} strokeWidth={2.5} />
								<span>Words</span>
							</Box>
							<Text fw={800} size="sm" className="text-wave-700 tabular-nums">
								{overview.wordCount}
							</Text>
						</Group>

						<Group gap={8} wrap="nowrap">
							<Box
								className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-[10px]"
								c="gray.5"
							>
								<Zap size={12} strokeWidth={2.5} />
								<span>Valid</span>
							</Box>
							<Text fw={600} size="sm" c="gray.8">
								{overview.validLines.length}
							</Text>
						</Group>

						<Group gap={8} wrap="nowrap">
							<Box
								className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-[10px]"
								c="gray.5"
							>
								<Search size={12} strokeWidth={2.5} />
								<span>Health</span>
							</Box>
							<Group gap={6}>
								{overview.invalidLines.length > 0 ? (
									<Text fw={600} size="sm" color="orange.6">
										{overview.invalidLines.length} Issues
									</Text>
								) : (
									<Text fw={600} size="sm" c="wave.7">
										Ready
									</Text>
								)}
							</Group>
						</Group>
					</Group>
				</Flex>

				{/* Actions Row */}
				<Group gap="md">
					<Select
						placeholder="Filter content"
						data={availableTypes}
						value={typeFilter}
						onChange={setTypeFilter}
						clearable
						size="sm"
						leftSection={
							<Box
								component="span"
								c="gray.5"
								style={{ display: "flex", alignItems: "center" }}
							>
								<Filter size={14} />
							</Box>
						}
						variant="filled"
						w={180}
						styles={{
							input: {
								backgroundColor: "var(--mantine-color-gray-0)",
								border: "1px solid var(--mantine-color-gray-2)",
							},
						}}
					/>
					{onEdit && (
						<Button
							variant="filled"
							color="wave"
							size="sm"
							leftSection={<Edit3 size={16} />}
							onClick={onEdit}
							className="hover:scale-[1.01] transition-transform"
						>
							Edit Script
						</Button>
					)}
				</Group>
			</Box>

			{/* Enhanced Script Table Section */}
			<Box flex={1} mih={0} bg="white">
				<ScrollArea h="100%" scrollbars="y" type="hover" offsetScrollbars>
					{filteredLines.length === 0 ? (
						<EmptyState
							icon={<Search size={64} strokeWidth={1} />}
							title="No lines match your filter"
							description="We couldn't find any script lines matching your current selection. Try adjusting the filter or clearing it to see all content."
							maxDescriptionWidth={320}
						/>
					) : (
						<Table
							verticalSpacing="lg"
							horizontalSpacing={32}
							className="border-separate border-spacing-0"
						>
							<Table.Thead bg="white" style={tableHeadStickyStyle}>
								<Table.Tr>
									<Table.Th py="lg" style={tableThBorderStyle}>
										<SectionLabel letterSpacing={2}>Category</SectionLabel>
									</Table.Th>
									<Table.Th py="lg" style={tableThBorderStyle}>
										<SectionLabel letterSpacing={2}>
											Script Content
										</SectionLabel>
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
			</Box>
		</Stack>
	);
}

interface ScriptOverviewProps {
	script: Script;
	onEdit?: () => void;
}

export const ScriptOverview = memo(ScriptOverviewInner);
