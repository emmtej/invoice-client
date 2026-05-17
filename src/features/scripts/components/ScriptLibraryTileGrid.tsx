import { ActionIcon, Box, Card, Flex, Group, Stack, Text } from "@mantine/core";
import { AlertCircle, FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import type { ScriptSummary } from "@/features/storage/types";

interface ScriptLibraryTileGridProps {
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

export function ScriptLibraryTileGrid({
	script,
	isSelected,
	onClick,
	onDelete,
}: ScriptLibraryTileGridProps) {
	const [hovered, setHovered] = useState(false);

	return (
		<Card
			bg={isSelected ? "blue.0" : "white"}
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
					borderColor: isSelected
						? "var(--mantine-color-blue-4)"
						: "var(--mantine-color-gray-3)",
					transition: "border-color 150ms ease",
					"&:hover": {
						borderColor: "var(--mantine-color-blue-4)",
					},
				},
			}}
		>
			<Stack h="100%" justify="space-between" gap="md">
				<Group justify="space-between" align="flex-start" wrap="nowrap">
					<Flex
						align="center"
						justify="center"
						w={40}
						h={40}
						bg="gray.0"
						style={{ borderRadius: "var(--mantine-radius-md)" }}
					>
						<FileText
							size={20}
							color={
								isSelected
									? "var(--mantine-color-blue-6)"
									: "var(--mantine-color-gray-6)"
							}
						/>
					</Flex>
					<ActionIcon
						variant="subtle"
						color="gray"
						size="sm"
						onClick={(e: React.MouseEvent) => {
							e.stopPropagation();
							onDelete();
						}}
						aria-label="Delete script"
						style={{
							opacity: hovered ? 1 : 0,
							transition: "opacity 150ms ease",
							"&:hover": {
								color: "var(--mantine-color-red-6)",
								backgroundColor: "var(--mantine-color-red-0)",
							},
						}}
					>
						<Trash2 size={16} />
					</ActionIcon>
				</Group>

				<Box>
					<Text
						size="sm"
						fw={600}
						
						lineClamp={2}
						mb="xs"
						h={40}
					>
						{script.name}
					</Text>

					<Stack gap={4}>
						<Group justify="space-between" wrap="nowrap">
							<Text size="xs" c="dimmed" className="tabular-nums" truncate>
								{script.wordCount.toLocaleString()} words
							</Text>
							{script.invalidLineCount > 0 && (
								<Flex align="center" gap={4}>
									<AlertCircle
										size={12}
										color="var(--mantine-color-red-5)"
									/>
									<Text size="xs" c="red" className="tabular-nums">
										{script.invalidLineCount}
									</Text>
								</Flex>
							)}
						</Group>
						<Text
							size="xs"
							c="dimmed"
							className="tabular-nums"
							style={{ opacity: 0.6 }}
						>
							{dateFormatter.format(script.createdAt)}
						</Text>
					</Stack>
				</Box>
			</Stack>
		</Card>
	);
}
