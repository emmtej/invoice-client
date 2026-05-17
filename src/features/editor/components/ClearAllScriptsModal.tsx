import { Button, Group, Stack, Text } from "@mantine/core";
import { memo } from "react";
import { AppModal } from "@/components/ui/AppModal";

interface ClearAllScriptsModalProps {
	opened: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export const ClearAllScriptsModal = memo(
	({ opened, onClose, onConfirm }: ClearAllScriptsModalProps) => {
		return (
			<AppModal
				opened={opened}
				onClose={onClose}
				title="Clear all documents?"
				size="sm"
			>
				<Stack gap="md">
					<Text size="sm" c="dimmed">
						This removes every document from the workspace, including pasted
						scripts. Invoice line items you already created are not removed.
					</Text>
					<Group justify="flex-end" gap="xs" mt="xs">
						<Button variant="subtle" color="gray" onClick={onClose}>
							Cancel
						</Button>
						<Button
							data-testid="clear-all-documents-confirm"
							color="red"
							onClick={onConfirm}
						>
							Clear all
						</Button>
					</Group>
				</Stack>
			</AppModal>
		);
	},
);

ClearAllScriptsModal.displayName = "ClearAllScriptsModal";
