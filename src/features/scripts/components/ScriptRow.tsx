import { ActionIcon, Box, Flex, Text } from "@mantine/core";
import { AlertCircle, FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import type { ScriptSummary } from "@/features/storage/types";

interface ScriptRowProps {
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

export function ScriptRow({
	script,
	isSelected,
	onClick,
	onDelete,
}: ScriptRowProps) {
	const [hovered, setHovered] = useState(false);

	return (
		<Box
			py="sm"
			px="md"
			onClick={onClick}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			style={{
				cursor: "pointer",
				borderBottom: "1px solid var(--mantine-color-gray-1)",
				transition: "background-color 150ms ease",
				backgroundColor: isSelected
					? "color-mix(in srgb, var(--mantine-color-wave-5) 10%, white)"
					: hovered
						? "var(--mantine-color-gray-0)"
						: "transparent",
			}}
		>
			<Flex align="center" gap="md">
				<FileText
					size={18}
					color={
						isSelected
							? "var(--mantine-color-wave-6)"
							: "var(--mantine-color-gray-4)"
					}
					style={{ flexShrink: 0 }}
				/>

				<Text
					size="sm"
					fw={isSelected ? 600 : 500}
					c={isSelected ? "wave.8" : "gray.7"}
					flex={1}
					truncate
				>
					{script.name}
				</Text>

				<Text
					size="xs"
					c="gray.5"
					className="tabular-nums"
					style={{ flexShrink: 0 }}
				>
					{script.wordCount.toLocaleString()} words
				</Text>

				{script.invalidLineCount > 0 && (
					<Flex align="center" gap={4} style={{ flexShrink: 0 }}>
						<AlertCircle size={14} color="var(--mantine-color-red-5)" />
						<Text size="xs" c="red.5" className="tabular-nums">
							{script.invalidLineCount}
						</Text>
					</Flex>
				)}

				<Text
					size="xs"
					c="gray.4"
					className="tabular-nums"
					style={{ flexShrink: 0 }}
				>
					{dateFormatter.format(script.createdAt)}
				</Text>

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
						"&:hover": { color: "var(--mantine-color-red-6)" },
					}}
				>
					<Trash2 size={14} />
				</ActionIcon>
			</Flex>
		</Box>
	);
}
