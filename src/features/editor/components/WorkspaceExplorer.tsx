import {
	ActionIcon,
	Box,
	Button,
	Group,
	ScrollArea,
	Stack,
	Text,
	Tooltip,
} from "@mantine/core";
import {
	AlertCircle,
	Layers,
	LayoutDashboard,
	Plus,
	Trash2,
} from "lucide-react";
import { memo, useMemo } from "react";
import { SectionLabel } from "@/components/ui/text/SectionLabel";
import type { Script } from "@/types/Script";

interface WorkspaceExplorerProps {
	scripts: Script[];
	activeScriptId: string | null;
	onSelect: (id: string | null) => void;
	onRemove: (id: string) => void;
	onOpenSaveModal: () => void;
	onOpenClearAll: () => void;
}

export const WorkspaceExplorer = memo(
	({
		scripts,
		activeScriptId,
		onSelect,
		onRemove,
		onOpenSaveModal,
		onOpenClearAll,
	}: WorkspaceExplorerProps) => {
		const totalWords = useMemo(
			() => scripts.reduce((acc, s) => acc + s.overview.wordCount, 0),
			[scripts],
		);

		return (
			<Box
				w={300}
				bg="gray.0"
				visibleFrom="md"
				style={{
					borderLeft: "1px solid var(--mantine-color-gray-2)",
					display: "flex",
					flexDirection: "column",
					height: "100%",
				}}
			>
				<Box p="lg" pb={0}>
					<Group gap="sm" mb="xs">
						<LayoutDashboard size={18} className="text-wave-700" />
						<SectionLabel letterSpacing={2}>Workspace Overview</SectionLabel>
					</Group>
					<Box
						p="md"
						bg="wave.0"
						style={{ border: "1px solid var(--mantine-color-wave-2)" }}
						mb="xl"
					>
						<Stack gap={4}>
							<Text
								fw={800}
								size="28px"
								c="wave.8"
								className="tabular-nums leading-none"
							>
								{totalWords.toLocaleString()}
							</Text>
							<Text size="xs" fw={700} c="wave.7" tt="uppercase" lts={1}>
								Billable Words
							</Text>
						</Stack>
					</Box>
					<Group justify="space-between" align="center" mb="md">
						<Group gap="xs">
							<Layers size={16} className="text-gray-400" />
							<SectionLabel>Documents ({scripts.length})</SectionLabel>
						</Group>
						<Group gap={4}>
							<Tooltip label="Clear all documents">
								<ActionIcon
									data-testid="clear-all-documents-trigger"
									variant="subtle"
									color="gray"
									size="sm"
									onClick={onOpenClearAll}
								>
									<Trash2 size={16} />
								</ActionIcon>
							</Tooltip>
							<Tooltip label="Upload new document">
								<ActionIcon
									variant="subtle"
									color="wave"
									size="sm"
									onClick={() => onSelect(null)}
								>
									<Plus size={16} />
								</ActionIcon>
							</Tooltip>
						</Group>
					</Group>{" "}
				</Box>

				<ScrollArea flex={1} px="md" pb="lg">
					<Stack gap={4}>
						{scripts.map((script) => (
							<Box
								key={script.id}
								onClick={() => onSelect(script.id)}
								className={`
								group flex items-center justify-between p-3 cursor-pointer transition-all border
								${
									activeScriptId === script.id
										? "bg-wave-50 border-wave-200"
										: "bg-white border-transparent hover:bg-gray-50"
								}
							`}
							>
								<Box style={{ flex: 1, minWidth: 0 }}>
									<Text
										size="sm"
										fw={700}
										truncate
										c={activeScriptId === script.id ? "wave.9" : "gray.7"}
									>
										{script.name}
									</Text>
								</Box>
								<Group gap="xs" ml="md">
									<Text size="xs" fw={800} className="tabular-nums">
										{script.overview.wordCount}
									</Text>
									{script.overview.invalidLines.length > 0 && (
										<AlertCircle size={14} className="text-studio-6" />
									)}
									<ActionIcon
										variant="subtle"
										color="gray"
										size="xs"
										className="opacity-0 group-hover:opacity-100"
										onClick={(e) => {
											e.stopPropagation();
											onRemove(script.id);
										}}
									>
										<Trash2 size={12} />
									</ActionIcon>
								</Group>
							</Box>
						))}
					</Stack>
				</ScrollArea>

				<Box
					p="lg"
					style={{
						borderTop: "1px solid var(--mantine-color-gray-2)",
						background: "var(--mantine-color-gray-0)",
					}}
				>
					<Button
						fullWidth
						color="wave"
						size="md"
						onClick={onOpenSaveModal}
						disabled={scripts.length === 0}
						className="shadow-md"
					>
						Save to Library
					</Button>
				</Box>
			</Box>
		);
	},
);

WorkspaceExplorer.displayName = "WorkspaceExplorer";
