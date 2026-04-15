import { Button, Group, Stack, Text, Textarea } from "@mantine/core";
import { useState } from "react";
import { AppModal } from "@/components/ui/modal/AppModal";
import type { ParsedLine } from "@/types/Script";

interface EditLineModalProps {
	opened: boolean;
	onClose: () => void;
	line: ParsedLine | null;
	lineIndex: number;
	currentContent: string;
	onSave: (lineIndex: number, content: string) => Promise<void>;
}

export function EditLineModal({
	opened,
	onClose,
	line,
	lineIndex,
	currentContent,
	onSave,
}: EditLineModalProps) {
	const [value, setValue] = useState(currentContent);

	const handleOpen = () => {
		setValue(currentContent);
	};

	const handleSave = () => {
		if (value.trim()) {
			onSave(lineIndex, value.trim());
		}
		onClose();
	};

	const speaker =
		line &&
		(line.type === "dialogue" || line.type === "action") &&
		line.speakers.length > 0
			? line.speakers.join(", ")
			: null;

	return (
		<AppModal
			opened={opened}
			onClose={onClose}
			title="Edit Line"
			size="lg"
			onTransitionEnd={handleOpen}
		>
			<Stack gap="md">
				{speaker && (
					<Text size="sm" fw={600} c="gray.6" tt="uppercase">
						Speaker: {speaker}
					</Text>
				)}

				<Textarea
					value={value}
					onChange={(e) => setValue(e.currentTarget.value)}
					minRows={4}
					maxRows={10}
					autosize
					autoFocus
					onKeyDown={(e) => {
						if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
							handleSave();
						}
					}}
				/>

				<Group justify="flex-end" gap="sm">
					<Button variant="default" onClick={onClose}>
						Cancel
					</Button>
					<Button color="wave" onClick={handleSave}>
						Save
					</Button>
				</Group>
			</Stack>
		</AppModal>
	);
}
