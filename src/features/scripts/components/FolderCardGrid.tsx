import { ActionIcon, Box, Card, Flex, Group, Stack, Text } from "@mantine/core";
import { Folder as FolderIcon, FolderOpen, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Folder } from "@/features/storage/types";

interface FolderCardGridProps {
	folder: Folder;
	itemCount: number;
	isSelected?: boolean;
	onClick: (e: React.MouseEvent) => void;
	onDelete: () => void;
}

export function FolderCardGrid({
	folder,
	itemCount,
	isSelected = false,
	onClick,
	onDelete,
}: FolderCardGridProps) {
	const [hovered, setHovered] = useState(false);

	return (
		<Card
			bg={isSelected ? "rgba(17, 40, 77, 0.05)" : "white"}
			shadow={hovered ? "md" : "sm"}
			p="md"
			withBorder
			h="100%"
			onClick={onClick}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			styles={{
				root: {
					cursor: "pointer",
					borderColor: isSelected ? "var(--mantine-color-studio-blue-5)" : "rgba(0,0,0,0.05)",
					transition: "all 150ms ease",
					"&:hover": {
						borderColor: isSelected ? "var(--mantine-color-studio-blue-6)" : "var(--mantine-color-studio-blue-3)",
					},
				},
			}}
		>
			<Stack h="100%" justify="space-between" gap="sm">
				<Group justify="space-between" align="flex-start" wrap="nowrap">
					<Flex
						align="center"
						justify="center"
						w={40}
						h={40}
						bg="studio-blue.0"
						style={{ borderRadius: "var(--mantine-radius-md)" }}
					>
						<FolderIcon size={20} color="var(--mantine-color-studio-blue-6)" />
					</Flex>
					<ActionIcon
						variant="subtle"
						color="gray"
						size="sm"
						onClick={(e: React.MouseEvent) => {
							e.stopPropagation();
							onDelete();
						}}
						style={{
							opacity: hovered ? 1 : 0,
							transition: "opacity 150ms ease",
							"&:hover": { color: "var(--mantine-color-on-air-red-6)", backgroundColor: "var(--mantine-color-on-air-red-0)" },
						}}
					>
						<Trash2 size={16} />
					</ActionIcon>
				</Group>

				<Box>
					<Text size="sm" fw={600} c="charcoal" truncate mb={4}>
						{folder.name}
					</Text>
					{itemCount > 0 ? (
						<Text size="xs" c="dimmed" className="tabular-nums">
							{itemCount === 1 ? "1 item" : `${itemCount} items`}
						</Text>
					) : (
						<Flex align="center" gap={6}>
							<FolderOpen size={14} strokeWidth={2} color="rgba(0,0,0,0.2)" aria-hidden />
							<Text size="xs" c="dimmed">Empty</Text>
						</Flex>
					)}
				</Box>
			</Stack>
		</Card>
	);
}
