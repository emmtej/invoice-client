import { ActionIcon, Card, Flex, Text } from "@mantine/core";
import { Folder as FolderIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Folder } from "@/features/storage/types";

interface FolderCardProps {
	folder: Folder;
	onClick: () => void;
	onDelete: () => void;
}

export function FolderCard({ folder, onClick, onDelete }: FolderCardProps) {
	const [hovered, setHovered] = useState(false);

	return (
		<Card
			bg="white"
			shadow="sm"
			p="md"
			onClick={onClick}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			style={{
				border: "1px solid #F3F4F6",
				cursor: "pointer",
				transition: "border-color 150ms ease",
				"&:hover": { borderColor: "var(--mantine-color-wave-3)" },
			}}
		>
			<Flex align="center" justify="space-between">
				<Flex align="center" gap="sm" miw={0}>
					<FolderIcon
						size={20}
						color="var(--mantine-color-studio-5)"
						style={{ flexShrink: 0 }}
					/>
					<Text size="sm" fw={600} c="gray.7" truncate>
						{folder.name}
					</Text>
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
						"&:hover": { color: "var(--mantine-color-red-6)" },
					}}
				>
					<Trash2 size={14} />
				</ActionIcon>
			</Flex>
		</Card>
	);
}
