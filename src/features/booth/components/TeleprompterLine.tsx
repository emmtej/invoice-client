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
				className={`
					border-b border-dashed border-brand-dark-200 transition-colors duration-150
					${
						isCurrent && isSceneMode
							? "border-l-[3px] border-l-wave-500"
							: "border-l-[3px] border-l-transparent"
					}
				`}
			>
				<Group gap="sm" wrap="nowrap">
					{isSceneMode && (
						<Checkbox
							checked={isCompleted}
							onChange={() => onCompleteScene(lineIndex)}
							disabled={!isSessionRunning || isCompleted}
							color="wave"
							className="flex-shrink-0"
						/>
					)}
					<Text
						size="xs"
						fw={800}
						c={isCompleted ? "brand-dark.2" : "brand-dark.4"}
						tt="uppercase"
						lts={1}
						className="flex-1"
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
			className={`
				transition-all duration-150
				${isCompleted ? "opacity-40" : "opacity-100"}
				${
					isCurrent && !isSceneMode
						? "border-l-[3px] border-l-wave-500"
						: "border-l-[3px] border-l-transparent"
				}
			`}
		>
			{!isSceneMode && (
				<Checkbox
					checked={isCompleted}
					onChange={() => onComplete(lineIndex)}
					disabled={!isSessionRunning || isCompleted}
					mt={4}
					color="wave"
					className="flex-shrink-0"
				/>
			)}

			<Box className={`flex-1 min-w-0 ${isSceneMode ? "ml-8" : "ml-0"}`}>
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
							className="flex-1"
							radius="md"
						/>
						<ActionIcon
							size="sm"
							variant="subtle"
							color="brand-dark.5"
							radius="md"
							onClick={cancelEdit}
							aria-label="Cancel editing"
						>
							<X size={14} />
						</ActionIcon>
					</Group>
				) : (
					<Text
						size="md"
						fw={500}
						c={isCompleted ? "brand-dark.2" : "brand-dark.7"}
						className={isCompleted ? "line-through" : ""}
					>
						{content}
					</Text>
				)}
			</Box>

			{!isEditing && !isCompleted && (
				<Group gap={4} className="flex-shrink-0 mt-0.5">
					<ActionIcon
						size="sm"
						variant="subtle"
						color="brand-dark.5"
						radius="md"
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
