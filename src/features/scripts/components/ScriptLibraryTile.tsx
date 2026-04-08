import { ActionIcon, Card, Flex, Group, Text } from "@mantine/core";
import { AlertCircle, FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import type { ScriptSummary } from "@/features/storage/types";

interface ScriptLibraryTileProps {
	script: ScriptSummary;
	isSelected: boolean;
	onClick: () => void;
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
	const [hovered, setHovered] = useState(false);

	return (
		<Card
			bg="white"
			shadow="xs"
			py="sm"
			px="md"
			withBorder
			w="100%"
			radius="sm"
			onClick={onClick}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			styles={{
				root: {
					cursor: "pointer",
					borderColor: isSelected
						? "var(--mantine-color-wave-5)"
						: "var(--mantine-color-gray-2)",
					backgroundColor: isSelected
						? "color-mix(in srgb, var(--mantine-color-wave-5) 8%, white)"
						: "var(--mantine-color-white)",
					transition: "border-color 150ms ease, background-color 150ms ease",
				},
			}}
		>
			<Flex align="center" justify="space-between" gap="md" wrap="nowrap">
				<Flex align="center" gap="sm" miw={0} style={{ flex: 1 }}>
					<FileText
						size={20}
						color={
							isSelected
								? "var(--mantine-color-wave-6)"
								: "var(--mantine-color-gray-5)"
						}
						style={{ flexShrink: 0 }}
					/>
					<Text
						size="sm"
						fw={600}
						c={isSelected ? "wave.8" : "gray.7"}
						truncate
						style={{ flex: 1, minWidth: 0 }}
					>
						{script.name}
					</Text>
				</Flex>

				<Group
					gap="md"
					wrap="nowrap"
					justify="flex-end"
					visibleFrom="sm"
					style={{ flexShrink: 0 }}
				>
					<Text size="xs" c="gray.5" className="tabular-nums">
						{script.wordCount.toLocaleString()} words
					</Text>
					{script.invalidLineCount > 0 && (
						<Flex align="center" gap={4}>
							<AlertCircle size={14} color="var(--mantine-color-red-5)" />
							<Text size="xs" c="red.5" className="tabular-nums">
								{script.invalidLineCount}
							</Text>
						</Flex>
					)}
					<Text size="xs" c="gray.4" className="tabular-nums">
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
					style={{
						flexShrink: 0,
						opacity: hovered ? 1 : 0,
						transition: "opacity 150ms ease",
					}}
				>
					<Trash2 size={14} />
				</ActionIcon>
			</Flex>

			<Group gap="xs" mt="xs" hiddenFrom="sm" wrap="wrap">
				<Text size="xs" c="gray.5" className="tabular-nums">
					{script.wordCount.toLocaleString()} words
				</Text>
				{script.invalidLineCount > 0 && (
					<Flex align="center" gap={4}>
						<AlertCircle size={12} color="var(--mantine-color-red-5)" />
						<Text size="xs" c="red.5" className="tabular-nums">
							{script.invalidLineCount}
						</Text>
					</Flex>
				)}
				<Text size="xs" c="gray.4" className="tabular-nums">
					{dateFormatter.format(script.createdAt)}
				</Text>
			</Group>
		</Card>
	);
}
