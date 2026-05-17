import { ActionIcon, Card, Flex, Group, Text } from "@mantine/core";
import { AlertCircle, FileText, Trash2 } from "lucide-react";
import type { ScriptSummary } from "@/features/storage/types";

interface ScriptLibraryTileProps {
	script: ScriptSummary;
	isSelected: boolean;
	onClick: (e: React.MouseEvent) => void;
	onDelete: () => void;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
});

export function ScriptLibraryTile({
	script,
	isSelected,
	onClick,
	onDelete,
}: ScriptLibraryTileProps) {
	return (
		<Card
			radius="md"
			p="sm"
			withBorder
			onClick={onClick}
			className={`w-full cursor-pointer transition-all duration-150 group ${isSelected ? "border-blue-3 shadow-sm" : "bg-white hover:bg-gray-0 hover:border-gray-3"}`}
		>
			<Flex align="center" justify="space-between" gap="md" wrap="nowrap">
				<Flex align="center" gap="sm" className="flex-1 min-w-0">
					<FileText
						size={20}
						className="flex-shrink-0"
					/>
					<Text
						size="sm"
						fw={600}
						
						truncate
						className="flex-1 min-w-0"
					>
						{script.name}
					</Text>
				</Flex>

				<Group
					gap="md"
					wrap="nowrap"
					justify="flex-end"
					visibleFrom="sm"
					className="flex-shrink-0"
				>
					<Text size="xs" c="dimmed" className="tabular-nums">
						{script.wordCount.toLocaleString()} words
					</Text>
					{script.invalidLineCount > 0 && (
						<Flex align="center" gap={4}>
							<AlertCircle size={14} />
							<Text size="xs" c="red" className="tabular-nums">
								{script.invalidLineCount}
							</Text>
						</Flex>
					)}
					<Text size="xs" c="dimmed" className="tabular-nums opacity-60">
						{dateFormatter.format(script.createdAt)}
					</Text>
				</Group>

				<ActionIcon
					variant="subtle"
					color="gray"
					size="sm"
					onClick={(e: React.MouseEvent) => {
						e.stopPropagation();
						onDelete();
					}}
					aria-label="Delete script"
					className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
				>
					<Trash2 size={14} />
				</ActionIcon>
			</Flex>

			<Group gap="xs" mt="xs" hiddenFrom="sm" wrap="wrap">
				<Text size="xs" c="dimmed" className="tabular-nums">
					{script.wordCount.toLocaleString()} words
				</Text>
				{script.invalidLineCount > 0 && (
					<Flex align="center" gap={4}>
						<AlertCircle size={12} />
						<Text size="xs" c="red" className="tabular-nums">
							{script.invalidLineCount}
						</Text>
					</Flex>
				)}
				<Text size="xs" c="dimmed" className="tabular-nums opacity-60">
					{dateFormatter.format(script.createdAt)}
				</Text>
			</Group>
		</Card>
	);
}
