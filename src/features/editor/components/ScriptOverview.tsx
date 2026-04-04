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

const TypeBadge = memo(({ type }: { type: string }) => {
	const config =
		TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.marker;
	const Icon = config.icon;

	return (
		<Group gap={8} wrap="nowrap">
			<ThemeIcon variant="transparent" color={config.color} size="sm">
				<Icon size={14} strokeWidth={2.5} />
			</ThemeIcon>
			<Text size="xs" fw={700} c="dimmed" tt="uppercase" lts="0.05em">
				{config.label}
			</Text>
		</Group>
	);
});

const ScriptLineRow = memo(({ line }: { line: ParsedLine }) => {
	return (
		<Table.Tr className="hover:bg-slate-50/50 transition-colors">
			<Table.Td py="sm" w={180}>
				<TypeBadge type={line.type} />
			</Table.Td>
			<Table.Td py="sm">
				<Group justify="space-between" wrap="nowrap" align="center" gap="xl">
					<Text
						size="md"
						className="text-slate-800 leading-relaxed font-medium"
						style={{ flex: 1 }}
					>
						{line.source}
					</Text>
					{line.type === "dialogue" && (
						<Badge
							variant="outline"
							color="slate.2"
							size="sm"
							radius="md"
							className="border-dashed bg-white shrink-0"
							styles={{
								label: {
									color: "var(--mantine-color-slate-600)",
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

	return (
		<Stack gap={0} h="100%" className="bg-white overflow-hidden">
			{/* Modern Dashboard Header */}
			<Box
				p="lg"
				className="border-b border-slate-100 bg-white sticky top-0 z-20"
			>
				<Flex justify="space-between" align="center" mb={16} gap="xl">
					<Group gap={20}>
						<Stack gap={4}>
							<Group gap="sm">
								<Title
									order={2}
									fw={900}
									lts={-1.2}
									className="text-slate-900 text-3xl"
								>
									{script.name}
								</Title>
								{overview.invalidLines.length === 0 && (
									<Badge
										variant="dot"
										color="emerald"
										size="sm"
										className="bg-emerald-50 text-emerald-700 border-emerald-100"
									>
										Verified
									</Badge>
								)}
							</Group>
							<Group gap="xs">
								<Badge variant="dot" color="studio" size="sm">
									{overview.totalLines} Lines
								</Badge>
							</Group>
						</Stack>
					</Group>

					{/* Notion-style Property Bar: Horizontal */}
					<Group gap="xl" wrap="nowrap" align="center">
						<Group gap={8} wrap="nowrap">
							<Box className="flex items-center gap-1.5 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
								<MessageSquare size={12} strokeWidth={2.5} />
								<span>Words</span>
							</Box>
							<Text fw={800} size="sm" className="text-studio-600 tabular-nums">
								{overview.wordCount}
							</Text>
						</Group>

						<Group gap={8} wrap="nowrap">
							<Box className="flex items-center gap-1.5 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
								<Zap size={12} strokeWidth={2.5} />
								<span>Valid</span>
							</Box>
							<Text fw={700} size="sm" className="text-slate-800">
								{overview.validLines.length}
							</Text>
						</Group>

						<Group gap={8} wrap="nowrap">
							<Box className="flex items-center gap-1.5 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
								<Search size={12} strokeWidth={2.5} />
								<span>Health</span>
							</Box>
							<Group gap={6}>
								{overview.invalidLines.length > 0 ? (
									<Text fw={700} size="sm" color="orange.6">
										{overview.invalidLines.length} Issues
									</Text>
								) : (
									<Text fw={700} size="sm" color="emerald.6">
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
						radius="md"
						leftSection={<Filter size={14} className="text-slate-400" />}
						variant="filled"
						w={180}
						styles={{
							input: {
								backgroundColor: "var(--mantine-color-slate-50)",
								border: "1px solid var(--mantine-color-slate-100)",
							},
						}}
					/>
					{onEdit && (
						<Button
							variant="filled"
							color="studio"
							size="sm"
							leftSection={<Edit3 size={16} />}
							onClick={onEdit}
							radius="md"
							className="hover:scale-[1.01] transition-transform"
						>
							Edit Script
						</Button>
					)}
				</Group>
			</Box>

			{/* Enhanced Script Table Section */}
			<Box className="flex-1 min-h-0 bg-white">
				<ScrollArea h="100%" scrollbars="y" type="hover" offsetScrollbars>
					{filteredLines.length === 0 ? (
						<Stack align="center" py={120} gap="xl">
							<Box className="p-8 rounded-[40px] bg-slate-50 text-slate-200">
								<Search size={64} strokeWidth={1} />
							</Box>
							<Stack gap={8} align="center">
								<Text fw={800} size="lg" className="text-slate-700">
									No lines match your filter
								</Text>
								<Text c="dimmed" ta="center" size="sm" fw={500} maw={320}>
									We couldn't find any script lines matching your current
									selection. Try adjusting the filter or clearing it to see all
									content.
								</Text>
							</Stack>
						</Stack>
					) : (
						<Table
							verticalSpacing="lg"
							horizontalSpacing={32}
							className="border-separate border-spacing-0"
						>
							<Table.Thead className="bg-white sticky top-0 z-10">
								<Table.Tr>
									<Table.Th className="border-b border-slate-100 py-5">
										<Text size="xs" fw={800} c="dimmed" tt="uppercase" lts={2}>
											Category
										</Text>
									</Table.Th>
									<Table.Th className="border-b border-slate-100 py-5">
										<Text size="xs" fw={800} c="dimmed" tt="uppercase" lts={2}>
											Script Content
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
			</Box>
		</Stack>
	);
}

interface ScriptOverviewProps {
	script: Script;
	onEdit?: () => void;
}

export const ScriptOverview = memo(ScriptOverviewInner);
