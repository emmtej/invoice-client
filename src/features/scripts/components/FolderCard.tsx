import { ActionIcon, Card, Flex, Stack, Text } from "@mantine/core";
import { Folder as FolderIcon, FolderOpen, Trash2 } from "lucide-react";
import type { Folder } from "@/features/storage/types";

interface FolderCardProps {
	folder: Folder;
	/** Direct items in this folder: subfolders plus scripts. */
	itemCount: number;
	isSelected?: boolean;
	onClick: (e: React.MouseEvent) => void;
	onDelete: () => void;
}

export function FolderCard({
	folder,
	itemCount,
	isSelected = false,
	onClick,
	onDelete,
}: FolderCardProps) {
	return (
		<Card
			radius="md"
			p="sm"
			withBorder
			onClick={onClick}
			className={`w-full cursor-pointer transition-all duration-150 group ${isSelected ? "border-blue-3 shadow-sm" : "bg-white hover:bg-gray-0 hover:border-gray-3"}`}
		>
			<Flex align="flex-start" justify="space-between" gap="sm">
				<Flex align="flex-start" gap="sm" className="flex-1 min-w-0">
					<FolderIcon
						size={20}
						className="flex-shrink-0 mt-0.5"
					/>
					<Stack gap={4} className="flex-1 min-w-0">
						<Text size="sm" fw={600} truncate>
							{folder.name}
						</Text>
						{itemCount > 0 ? (
							<Text size="xs" c="dimmed" className="tabular-nums">
								{itemCount === 1 ? "1 item" : `${itemCount} items`}
							</Text>
						) : (
							<Flex align="center" gap={6}>
								<FolderOpen
									size={14}
									strokeWidth={2}
									className="flex-shrink-0"
									aria-hidden
								/>
								<Text size="xs" c="dimmed">
									Empty
								</Text>
							</Flex>
						)}
					</Stack>
				</Flex>
				<ActionIcon
					variant="subtle"
					color="gray"
					size="sm"
					onClick={(e: React.MouseEvent) => {
						e.stopPropagation();
						onDelete();
					}}
					aria-label="Delete folder"
					className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
				>
					<Trash2 size={14} />
				</ActionIcon>
			</Flex>
		</Card>
	);
}
