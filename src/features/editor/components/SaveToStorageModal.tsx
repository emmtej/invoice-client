import {
	Box,
	Button,
	Checkbox,
	Group,
	ScrollArea,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { memo, useEffect, useState } from "react";
import { AppModal } from "@/components/ui/modal/AppModal";
import type { Script } from "@/types/Script";

interface SaveToStorageModalProps {
	opened: boolean;
	onClose: () => void;
	scripts: Script[];
	onConfirm: (
		selectedIds: string[],
		groupName: string,
		label: string,
	) => Promise<void>;
}

export const SaveToStorageModal = memo(
	({ opened, onClose, scripts, onConfirm }: SaveToStorageModalProps) => {
		const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
		const [groupName, setGroupName] = useState("");
		const [label, setLabel] = useState("");
		const [isSubmitting, setIsSubmitting] = useState(false);

		useEffect(() => {
			if (opened) {
				setSelectedIds(new Set(scripts.map((s) => s.id)));
				setGroupName("");
				setLabel("");
			}
		}, [opened, scripts]);

		const toggleScript = (id: string) => {
			setSelectedIds((prev) => {
				const next = new Set(prev);
				if (next.has(id)) next.delete(id);
				else next.add(id);
				return next;
			});
		};

		const handleSave = async () => {
			setIsSubmitting(true);
			await onConfirm(Array.from(selectedIds), groupName.trim(), label.trim());
			setIsSubmitting(false);
			onClose();
		};

		return (
			<AppModal
				opened={opened}
				onClose={onClose}
				title="Save to Library"
				size="md"
			>
				<Stack gap="md">
					<Text size="sm" c="gray.6">
						Organize your scripts into groups and provide a label for context.
					</Text>

					<TextInput
						label="Group / Folder Name"
						placeholder="e.g. Project X, Episode 1"
						value={groupName}
						onChange={(e) => setGroupName(e.currentTarget.value)}
					/>

					<TextInput
						label="Context Label"
						placeholder="e.g. Translation, Final VO"
						value={label}
						onChange={(e) => setLabel(e.currentTarget.value)}
					/>

					<Box>
						<Text size="xs" fw={700} tt="uppercase" c="gray.5" mb={8} lts={1}>
							Select Documents ({selectedIds.size})
						</Text>
						<ScrollArea
							h={200}
							style={{ border: "1px solid var(--mantine-color-gray-2)" }}
							p="xs"
						>
							<Stack gap={4}>
								{scripts.map((s) => (
									<Checkbox
										key={s.id}
										label={s.name}
										checked={selectedIds.has(s.id)}
										onChange={() => toggleScript(s.id)}
										color="wave"
										size="sm"
									/>
								))}
							</Stack>
						</ScrollArea>
					</Box>

					<Group justify="flex-end" mt="xl">
						<Button variant="subtle" color="gray" onClick={onClose}>
							Cancel
						</Button>
						<Button
							color="wave"
							onClick={handleSave}
							loading={isSubmitting}
							disabled={selectedIds.size === 0}
						>
							Confirm & Save
						</Button>
					</Group>
				</Stack>
			</AppModal>
		);
	},
);

SaveToStorageModal.displayName = "SaveToStorageModal";
