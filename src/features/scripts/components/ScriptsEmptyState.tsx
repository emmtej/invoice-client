import { Button, Group, Stack } from "@mantine/core";
import { FolderOpen, FolderPlus } from "lucide-react";
import { DocxUploadButton } from "@/components/ui/button/DocxUploadButton";
import { EmptyState } from "@/components/ui/feedback/EmptyState";

interface ScriptsEmptyStateProps {
	isRoot: boolean;
	onCreateFolder: () => void;
	onUpload: (files: File[]) => void;
	isUploading?: boolean;
}

export function ScriptsEmptyState({
	isRoot,
	onCreateFolder,
	onUpload,
	isUploading,
}: ScriptsEmptyStateProps) {
	return (
		<Stack align="center" py="xl">
			<EmptyState
				icon={<FolderOpen size={40} />}
				title={isRoot ? "No scripts yet" : "This folder is empty"}
				description={
					isRoot
						? "Upload scripts or create a folder to start organizing."
						: "Upload scripts into this folder, or create a subfolder."
				}
				maxDescriptionWidth={280}
			/>
			<Group gap="sm">
				<DocxUploadButton
					onChange={onUpload}
					multiple
					variant="light"
					color="wave"
					loading={isUploading}
				>
					Upload Scripts
				</DocxUploadButton>
				<Button
					color="wave"
					variant="outline"
					leftSection={<FolderPlus size={16} />}
					onClick={onCreateFolder}
				>
					New Folder
				</Button>
			</Group>
		</Stack>
	);
}
