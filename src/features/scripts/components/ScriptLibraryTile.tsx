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
			className={`
				w-full cursor-pointer transition-all duration-150 group
				${
					isSelected
						? "bg-studio-50 border-studio-400 shadow-sm"
						: "bg-white border-gray-100 hover:bg-gray-50 hover:border-studio-200"
				}
			`}
		>
			<Flex align="center" justify="space-between" gap="md" wrap="nowrap">
				<Flex align="center" gap="sm" className="flex-1 min-w-0">
					<FileText
						size={20}
						className={`flex-shrink-0 ${
							isSelected ? "text-studio-600" : "text-gray-400"
						}`}
					/>
					<Text
						size="sm"
						fw={600}
						c={isSelected ? "studio.7" : "brand-dark.7"}
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
							<AlertCircle size={14} className="text-on-air-500" />
							<Text size="xs" c="on-air-red.5" className="tabular-nums">
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
					className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:text-on-air-red-600"
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
						<AlertCircle size={12} className="text-on-air-500" />
						<Text size="xs" c="on-air-red.5" className="tabular-nums">
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
