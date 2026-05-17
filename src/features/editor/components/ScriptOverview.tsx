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
	Title,
} from "@mantine/core";
import { Edit3, Filter, MessageSquare, Search, Zap } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { SectionLabel } from "@/components/ui/text/SectionLabel";
import type { Script } from "@/types/Script";
import { ScriptLineRow } from "./ScriptOverviewItems";

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
		<Stack gap={0} h="100%" bg="white" className="overflow-hidden">
			{/* Modern Dashboard Header */}
			<Box
				p="lg"
				bg="white"
				className="border-b border-gray-100 sticky top-0 z-[20]"
			>
				<Flex justify="space-between" align="center" mb={16} gap="xl">
					<Group gap={20}>
						<Stack gap={4}>
							<Group gap="sm">
								<Title
									order={1}
									className="tracking-tight text-balance text-4xl"
								>
									{script.name}
								</Title>
								{overview.invalidLines.length === 0 && (
									<Badge
										variant="dot"
										color="wave"
										size="sm"
										radius="xl"
										className="border-wave-100 bg-wave-50 text-wave-700"
									>
										Verified
									</Badge>
								)}
							</Group>
							<Group gap="xs">
								<Badge variant="dot" color="wave" size="sm" radius="xl">
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
								c="brand-dark.4"
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
								c="brand-dark.4"
							>
								<Zap size={12} strokeWidth={2.5} />
								<span>Valid</span>
							</Box>
							<Text fw={600} size="sm" c="brand-dark.7">
								{overview.validLines.length}
							</Text>
						</Group>

						<Group gap={8} wrap="nowrap">
							<Box
								className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-[10px]"
								c="brand-dark.4"
							>
								<Search size={12} strokeWidth={2.5} />
								<span>Health</span>
							</Box>
							<Group gap={6}>
								{overview.invalidLines.length > 0 ? (
									<Text fw={600} size="sm" color="on-air-red.6">
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
						radius="md"
						leftSection={
							<Box className="flex items-center text-brand-dark-300">
								<Filter size={14} />
							</Box>
						}
						variant="filled"
						w={180}
						styles={{
							input: {
								backgroundColor: "var(--mantine-color-gray-0)",
								border: "1px solid var(--mantine-color-gray-1)",
							},
						}}
					/>
					{onEdit && (
						<Button
							variant="filled"
							color="wave"
							size="sm"
							radius="xl"
							leftSection={<Edit3 size={16} />}
							onClick={onEdit}
							className="hover:scale-[1.01] transition-all shadow-sm active:scale-95"
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
							verticalSpacing="md"
							horizontalSpacing={32}
							className="border-separate border-spacing-0"
						>
							<Table.Thead bg="white" className="sticky top-0 z-[10]">
								<Table.Tr>
									<Table.Th py="md" className="border-b border-gray-100">
										<SectionLabel letterSpacing={2}>Category</SectionLabel>
									</Table.Th>
									<Table.Th py="md" className="border-b border-gray-100">
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
