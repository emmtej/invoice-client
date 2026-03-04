import type { Script } from "@/types/Script";
import { useFileUpload } from "@/features/editor/hooks/useFileUpload";
import { processDocuments } from "@/features/editor/utils/documentParser";
import { UploadDocumentsOverview } from "@/features/editor/components/UploadDocumentsOverview";
import { Box, Button, FileButton, Modal, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";

export interface AddDocumentsToItemModalProps {
	itemId: string;
	itemName: string;
	opened: boolean;
	onClose: () => void;
}

export function AddDocumentsToItemModal({
	itemId,
	itemName,
	opened,
	onClose,
}: AddDocumentsToItemModalProps) {
	const { docFiles, handleFileChange, isLoading, errors } = useFileUpload();
	const [scripts, setScripts] = useState<Script[]>([]);
	const [processingError, setProcessingError] = useState<string | null>(null);

	useEffect(() => {
		if (!docFiles || docFiles.length === 0) {
			setScripts([]);
			setProcessingError(null);
			return;
		}
		let cancelled = false;
		setProcessingError(null);
		processDocuments(docFiles)
			.then((s) => {
				if (!cancelled) setScripts(s);
			})
			.catch((err) => {
				if (cancelled) return;
				const message =
					err instanceof Error ? err.message : typeof err === "string" ? err : "Failed to process documents.";
				setProcessingError(message);
			});
		return () => {
			cancelled = true;
		};
	}, [docFiles]);

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={`Upload documents for ${itemName}`}
			size="lg"
			centered
		>
			<Stack gap="md">
				<FileButton
					onChange={handleFileChange}
					accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
					multiple
				>
					{(props) => (
						<Button {...props} variant="default" size="sm" fullWidth>
							Upload Document(s)
						</Button>
					)}
				</FileButton>
				{isLoading && (
					<Text size="sm" c="dimmed">
						Processing documents…
					</Text>
				)}
				{errors.length > 0 && (
					<Box>
						{errors.map((err, i) => (
							<Text key={i} size="sm" c="red">
								{err}
							</Text>
						))}
					</Box>
				)}
				{processingError && (
					<Box>
						<Text size="sm" c="red">
							{processingError}
						</Text>
					</Box>
				)}
				<UploadDocumentsOverview
					scripts={scripts}
					targetItemId={itemId}
					targetItemName={itemName}
					onAddedToInvoice={onClose}
				/>
			</Stack>
		</Modal>
	);
}
