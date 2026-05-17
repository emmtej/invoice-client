import { Button, Flex, Text } from "@mantine/core";
import { useState } from "react";
import { AppModal } from "@/components/ui/modal/AppModal";

interface DeleteScriptModalProps {
	opened: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	scriptName: string;
}

export function DeleteScriptModal({
	opened,
	onClose,
	onConfirm,
	scriptName,
}: DeleteScriptModalProps) {
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
		<AppModal opened={opened} onClose={onClose} title="Delete Script">
			<Text size="sm" c="brand-dark.4" mb="md">
				Are you sure you want to delete{" "}
				<Text span fw={600} c="brand-dark.7">
					{scriptName}
				</Text>
				? This action cannot be undone.
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
