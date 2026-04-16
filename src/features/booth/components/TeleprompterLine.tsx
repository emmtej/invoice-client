import {
	ActionIcon,
	Box,
	Checkbox,
	Group,
	Text,
	TextInput,
} from "@mantine/core";
import { Pencil, X } from "lucide-react";
import { useRef, useState } from "react";
import type { ParsedLine } from "@/types/Script";

interface TeleprompterLineProps {
	line: ParsedLine;
	content: string;
	lineIndex: number;
	isCurrent: boolean;
	isCompleted: boolean;
	isSessionRunning: boolean;
	onComplete: (lineIndex: number) => void;
	onEdit: (lineIndex: number, content: string) => Promise<void>;
}

export function TeleprompterLine({
	line,
	content,
	lineIndex,
	isCurrent,
	isCompleted,
	isSessionRunning,
	onComplete,
	onEdit,
}: TeleprompterLineProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const isReadable = line.type === "dialogue" || line.type === "action";

	if (line.type === "marker") {
		return (
			<Box
				py="xs"
				px="md"
				style={{ borderBottom: "1px dashed var(--mantine-color-gray-3)" }}
			>
				<Text size="xs" fw={700} c="gray.5" tt="uppercase" ta="center">
					{content}
				</Text>
			</Box>
		);
	}

	if (!isReadable) return null;

	const startEditing = () => {
		setEditValue(content);
		setIsEditing(true);
		setTimeout(() => inputRef.current?.focus(), 0);
	};

	const saveEdit = () => {
		if (editValue !== content) {
			onEdit(lineIndex, editValue);
		}
		setIsEditing(false);
	};

	const cancelEdit = () => {
		setIsEditing(false);
	};

	return (
		<Group
			gap="xs"
			wrap="nowrap"
			py="sm"
			px="md"
			align="flex-start"
			bg={isCurrent ? "wave.0" : "transparent"}
			opacity={isCompleted ? 0.45 : 1}
			style={{
				borderLeft: isCurrent
					? "3px solid var(--mantine-color-wave-5)"
					: "3px solid transparent",
				transition: "background-color 150ms ease, opacity 150ms ease",
			}}
		>
			<Checkbox
				checked={isCompleted}
				onChange={() => onComplete(lineIndex)}
				disabled={!isSessionRunning || isCompleted}
				mt={4}
				color="wave"
				style={{ flexShrink: 0 }}
			/>

			<Box flex={1} miw={0}>
				{isEditing ? (
					<Group gap="xs" wrap="nowrap">
						<TextInput
							ref={inputRef}
							value={editValue}
							onChange={(e) => setEditValue(e.currentTarget.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") saveEdit();
								if (e.key === "Escape") cancelEdit();
							}}
							onBlur={saveEdit}
							size="sm"
							flex={1}
						/>
						<ActionIcon
							size="sm"
							variant="subtle"
							color="gray"
							onClick={cancelEdit}
						>
							<X size={14} />
						</ActionIcon>
					</Group>
				) : (
					<Text
						size="md"
						fw={500}
						c={isCompleted ? "gray.5" : "gray.8"}
						td={isCompleted ? "line-through" : undefined}
					>
						{content}
					</Text>
				)}
			</Box>

			{!isEditing && !isCompleted && (
				<Group gap={4} style={{ flexShrink: 0 }} mt={2}>
					<ActionIcon
						size="sm"
						variant="subtle"
						color="gray"
						onClick={startEditing}
						aria-label="Edit line"
					>
						<Pencil size={14} />
					</ActionIcon>
				</Group>
			)}
		</Group>
	);
}
