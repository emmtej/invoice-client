import { Button, Flex, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { AppModal } from "@/components/ui/modal/AppModal";

interface CreateFolderModalProps {
	opened: boolean;
	onClose: () => void;
	onConfirm: (name: string) => Promise<void>;
	parentFolderName?: string;
}

export function CreateFolderModal({
	opened,
	onClose,
	onConfirm,
	parentFolderName,
}: CreateFolderModalProps) {
	const [name, setName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		const trimmed = name.trim();
		if (!trimmed) return;
		setIsSubmitting(true);
		try {
			await onConfirm(trimmed);
			setName("");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		setName("");
		onClose();
	};

	return (
		<AppModal opened={opened} onClose={handleClose} title="New Folder">
			{parentFolderName && (
				<Text size="sm" c="dimmed" mb="md">
					Creating inside{" "}
					<Text span fw={600} c="charcoal">
						{parentFolderName}
					</Text>
				</Text>
			)}
			<TextInput
				label="Folder name"
				placeholder="Enter a name"
				value={name}
				onChange={(e) => setName(e.currentTarget.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") handleSubmit();
				}}
				data-autofocus
				mb="lg"
			/>
			<Flex justify="flex-end" gap="sm">
				<Button variant="default" onClick={handleClose} disabled={isSubmitting}>
					Cancel
				</Button>
				<Button
					color="studio-blue"
					onClick={handleSubmit}
					loading={isSubmitting}
					disabled={!name.trim()}
				>
					Create
				</Button>
			</Flex>
		</AppModal>
	);
}
