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
			className={`
				w-full cursor-pointer transition-all duration-150 group
				${
					isSelected
						? "bg-studio-50 border-studio-400 shadow-sm"
						: "bg-white border-gray-100 hover:bg-gray-50 hover:border-studio-200"
				}
			`}
		>
			<Flex align="flex-start" justify="space-between" gap="sm">
				<Flex align="flex-start" gap="sm" className="flex-1 min-w-0">
					<FolderIcon
						size={20}
						className="text-studio-500 flex-shrink-0 mt-0.5"
					/>
					<Stack gap={4} className="flex-1 min-w-0">
						<Text size="sm" fw={600} c="brand-dark.7" truncate>
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
									className="text-gray-300 flex-shrink-0"
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
					className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:text-on-air-red-600"
				>
					<Trash2 size={14} />
				</ActionIcon>
			</Flex>
		</Card>
	);
}
