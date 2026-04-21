import { ActionIcon, Card, Flex, Stack, Text } from "@mantine/core";
import { Folder as FolderIcon, FolderOpen, Trash2 } from "lucide-react";
import { useState } from "react";
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
	const [hovered, setHovered] = useState(false);

	return (
		<Card
			bg={
				isSelected
					? "rgba(17, 40, 77, 0.05)"
					: "transparent"
			}
			shadow="xs"
			py="sm"
			px="md"
			withBorder
			w="100%"
			onClick={onClick}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			styles={{
				root: {
					cursor: "pointer",
					borderColor: isSelected
						? "var(--mantine-color-studio-blue-5)"
						: "rgba(0,0,0,0.05)",
					transition: "border-color 150ms ease, background-color 150ms ease",
					"&:hover": {
						borderColor: isSelected
							? "var(--mantine-color-studio-blue-6)"
							: "var(--mantine-color-studio-blue-3)",
						backgroundColor: isSelected
							? "rgba(17, 40, 77, 0.08)"
							: "rgba(17, 40, 77, 0.02)",
					},
				},
			}}
		>
			<Flex align="flex-start" justify="space-between" gap="sm">
				<Flex align="flex-start" gap="sm" miw={0} style={{ flex: 1 }}>
					<FolderIcon
						size={20}
						color="var(--mantine-color-studio-blue-5)"
						style={{ flexShrink: 0, marginTop: 2 }}
					/>
					<Stack gap={4} miw={0} style={{ flex: 1 }}>
						<Text size="sm" fw={600} c="charcoal" truncate>
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
									color="rgba(0,0,0,0.2)"
									style={{ flexShrink: 0 }}
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
					style={{
						flexShrink: 0,
						opacity: hovered ? 1 : 0,
						transition: "opacity 150ms ease",
						"&:hover": { color: "var(--mantine-color-on-air-red-6)" },
					}}
				>
					<Trash2 size={14} />
				</ActionIcon>
			</Flex>
		</Card>
	);
}
