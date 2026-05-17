import { Button, Flex, Text } from "@mantine/core";
import { useState } from "react";
import { AppModal } from "@/components/ui/modal/AppModal";

interface DeleteFolderModalProps {
	opened: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	folderName: string;
}

export function DeleteFolderModal({
	opened,
	onClose,
	onConfirm,
	folderName,
}: DeleteFolderModalProps) {
	const [isDeleting, setIsDeleting] = useState(false);

	const handleConfirm = async () => {
		setIsDeleting(true);
		try {
			await onConfirm();
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<AppModal opened={opened} onClose={onClose} title="Delete Folder">
			<Text size="sm" c="brand-dark.4" mb="md">
				Are you sure you want to delete{" "}
				<Text span fw={600} c="brand-dark.7">
					{folderName}
				</Text>
				? All scripts and subfolders inside this folder will be permanently
				removed.
			</Text>
			<Flex justify="flex-end" gap="sm">
				<Button
					variant="subtle"
					color="brand-dark.5"
					onClick={onClose}
					disabled={isDeleting}
				>
					Cancel
				</Button>
				<Button color="on-air-red" onClick={handleConfirm} loading={isDeleting}>
					Delete
				</Button>
			</Flex>
		</AppModal>
	);
}
