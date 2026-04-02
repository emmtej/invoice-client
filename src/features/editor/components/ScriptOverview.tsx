import {
	Badge,
	Box,
	Button,
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
	CheckCircle2,
	Edit3,
	FileText,
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
				<Icon size={12} strokeWidth={2.5} />
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
			<Table.Td py="md" w={160}>
				<TypeBadge type={line.type} />
			</Table.Td>
			<Table.Td py="md">
				<Group justify="space-between" wrap="nowrap" align="center" gap="lg">
					<Text
						size="sm"
						className="text-slate-700 leading-relaxed font-medium"
						style={{ flex: 1 }}
					>
						{line.source}
					</Text>
					{line.type === "dialogue" && (
						<Badge
							variant="outline"
							color="gray.4"
							size="xs"
							radius="sm"
							className="border-dashed border-slate-300 bg-white"
							styles={{
								label: {
									color: "var(--mantine-color-slate-600)",
									fontWeight: 600,
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
		<Stack gap={0} h="100%" className="bg-slate-50/20 overflow-hidden">
			{/* Header Section */}
			<Box
				p="xl"
				className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-20"
			>
				<Group justify="space-between" align="center" mb="xl">
					<Group gap="md">
						<Box className="p-3 rounded-xl bg-studio-50 text-studio-600">
							<FileText size={24} strokeWidth={1.5} />
						</Box>
						<Stack gap={0}>
							<Title order={3} fw={800} lts={-0.5} className="text-slate-900">
								{script.name}
							</Title>
							<Text size="xs" c="dimmed" fw={600} tt="uppercase" lts={1}>
								Parsed Script Analysis
							</Text>
						</Stack>
					</Group>
					{onEdit && (
						<Button
							variant="filled"
							color="studio"
							leftSection={<Edit3 size={16} />}
							onClick={onEdit}
							radius="md"
							className="shadow-sm shadow-studio-200"
						>
							Edit Script
						</Button>
					)}
				</Group>

				<Group justify="space-between" align="flex-end">
					<Group gap={40}>
						<Stack gap={4}>
							<Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={0.5}>
								Total Lines
							</Text>
							<Text size="xl" fw={800} className="text-slate-800">
								{overview.totalLines}
							</Text>
						</Stack>
						<Stack gap={4}>
							<Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={0.5}>
								Billable Words
							</Text>
							<Text size="xl" fw={800} className="text-studio-600">
								{overview.wordCount}
							</Text>
						</Stack>
						<Stack gap={4}>
							<Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={0.5}>
								Validation Status
							</Text>
							<Group gap={8}>
								{overview.invalidLines.length > 0 ? (
									<>
										<AlertCircle size={18} className="text-amber-500" />
										<Text size="sm" fw={700} className="text-amber-600">
											{overview.invalidLines.length} Issues
										</Text>
									</>
								) : (
									<>
										<CheckCircle2 size={18} className="text-emerald-500" />
										<Text size="sm" fw={700} className="text-emerald-600">
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
						leftSection={<Filter size={14} className="text-slate-400" />}
						variant="default"
						w={180}
						className="shadow-xs"
					/>
				</Group>
			</Box>

			{/* Content Section */}
			<Box className="flex-1 min-h-0 bg-white">
				<ScrollArea h="100%" scrollbars="y" type="hover" offsetScrollbars>
					{filteredLines.length === 0 ? (
						<Stack align="center" py={80} gap="md">
							<Box className="p-4 rounded-full bg-slate-50 text-slate-300">
								<Search size={40} strokeWidth={1} />
							</Box>
							<Text c="dimmed" ta="center" size="sm" fw={600} maw={300}>
								No script lines match your current filter. Try selecting a
								different type.
							</Text>
						</Stack>
					) : (
						<Table
							verticalSpacing="sm"
							horizontalSpacing="xl"
							className="border-separate border-spacing-0"
						>
							<Table.Thead className="bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
								<Table.Tr>
									<Table.Th className="border-b border-slate-100 py-4">
										<Text size="xs" fw={800} c="dimmed" tt="uppercase" lts={1}>
											Line Type
										</Text>
									</Table.Th>
									<Table.Th className="border-b border-slate-100 py-4">
										<Text size="xs" fw={800} c="dimmed" tt="uppercase" lts={1}>
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
			</Box>
		</Stack>
	);
}

interface ScriptOverviewProps {
	script: Script;
	onEdit?: () => void;
}

export const ScriptOverview = memo(ScriptOverviewInner);
