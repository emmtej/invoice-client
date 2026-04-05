import { Box, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { DocxUploadButton } from "@/components/ui/button/DocxUploadButton";
import { AppModal } from "@/components/ui/modal/AppModal";
import { UploadDocumentsOverview } from "@/features/editor/components/UploadDocumentsOverview";
import { useFileUpload } from "@/features/editor/hooks/useFileUpload";
import { processDocuments } from "@/features/editor/utils/documentParser";
import type { Script } from "@/types/Script";

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
	const { docFiles, handleFileChange, isLoading, errors, reset } =
		useFileUpload();
	const [scripts, setScripts] = useState<Script[]>([]);
	const [processingError, setProcessingError] = useState<string | null>(null);

	useEffect(() => {
		if (!opened) {
			reset();
			setScripts([]);
			setProcessingError(null);
		}
	}, [opened, reset]);

	useEffect(() => {
		if (!docFiles || docFiles.length === 0) {
			setScripts([]);
			setProcessingError(null);
			return;
		}
		setProcessingError(null);
		try {
			const s = processDocuments(docFiles);
			setScripts(s);
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: typeof err === "string"
						? err
						: "Failed to process documents.";
			setProcessingError(message);
		}
	}, [docFiles]);

	return (
		<AppModal
			opened={opened}
			onClose={onClose}
			title={`Upload Documents for ${itemName}`}
			size="lg"
		>
			<Stack gap="md">
				<DocxUploadButton
					onChange={handleFileChange}
					multiple
					size="md"
					radius="lg"
					fullWidth
					className="shadow-sm shadow-wave-100"
				>
					Upload Document(s)
				</DocxUploadButton>
				{isLoading && (
					<Text size="sm" c="gray.5">
						Processing documents…
					</Text>
				)}
				{errors.length > 0 && (
					<Box>
						{errors.map((err) => (
							<Text key={err} size="sm" c="red">
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
		</AppModal>
	);
}
