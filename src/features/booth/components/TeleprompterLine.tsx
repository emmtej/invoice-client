import {
	ActionIcon,
	Box,
	Checkbox,
	Group,
	Text,
	TextInput,
} from "@mantine/core";
import { Pencil, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ParsedLine } from "@/types/Script";

interface TeleprompterLineProps {
	line: ParsedLine;
	content: string;
	lineIndex: number;
	isCurrent: boolean;
	isCompleted: boolean;
	isSessionRunning: boolean;
	trackingMode: "line" | "scene";
	onComplete: (lineIndex: number) => void;
	onCompleteScene: (markerIndex: number) => void;
	onEdit: (lineIndex: number, content: string) => Promise<void>;
}

export function TeleprompterLine({
	line,
	content,
	lineIndex,
	isCurrent,
	isCompleted,
	isSessionRunning,
	trackingMode,
	onComplete,
	onCompleteScene,
	onEdit,
}: TeleprompterLineProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditing) {
			inputRef.current?.focus();
		}
	}, [isEditing]);

	const isReadable = line.type === "dialogue" || line.type === "action";
	const isSceneMode = trackingMode === "scene";

	if (line.type === "marker") {
		return (
			<Box
				py="md"
				px="md"
				bg={isCurrent && isSceneMode ? "wave.0" : "transparent"}
				style={{
					borderBottom: "1px dashed var(--mantine-color-gray-3)",
					borderLeft:
						isCurrent && isSceneMode
							? "3px solid var(--mantine-color-wave-5)"
							: "3px solid transparent",
					transition: "background-color 150ms ease",
				}}
			>
				<Group gap="sm" wrap="nowrap">
					{isSceneMode && (
						<Checkbox
							checked={isCompleted}
							onChange={() => onCompleteScene(lineIndex)}
							disabled={!isSessionRunning || isCompleted}
							color="wave"
							style={{ flexShrink: 0 }}
						/>
					)}
					<Text
						size="xs"
						fw={800}
						c={isCompleted ? "gray.5" : "gray.6"}
						tt="uppercase"
						lts={1}
						flex={1}
					>
						{content}
					</Text>
				</Group>
			</Box>
		);
	}

	if (!isReadable) return null;

	const startEditing = () => {
		setEditValue(content);
		setIsEditing(true);
	};

	const saveEdit = () => {
		if (editValue !== content) {
			void onEdit(lineIndex, editValue);
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
			bg={isCurrent && !isSceneMode ? "wave.0" : "transparent"}
			opacity={isCompleted ? 0.45 : 1}
			style={{
				borderLeft:
					isCurrent && !isSceneMode
						? "3px solid var(--mantine-color-wave-5)"
						: "3px solid transparent",
				transition: "background-color 150ms ease, opacity 150ms ease",
			}}
		>
			{!isSceneMode && (
				<Checkbox
					checked={isCompleted}
					onChange={() => onComplete(lineIndex)}
					disabled={!isSessionRunning || isCompleted}
					mt={4}
					color="wave"
					style={{ flexShrink: 0 }}
				/>
			)}

			<Box flex={1} miw={0} ml={isSceneMode ? "md" : 0}>
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
