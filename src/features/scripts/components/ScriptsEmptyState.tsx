import { Button, Stack, Text } from "@mantine/core";
import { FolderOpen, FolderPlus } from "lucide-react";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { DocxUploadDropzone } from "@/components/ui/upload/DocxUploadDropzone";

interface ScriptsEmptyStateProps {
	isRoot: boolean;
	onCreateFolder?: () => void;
	onUpload?: (files: File[]) => void;
	isUploading?: boolean;
}

export function ScriptsEmptyState({
	isRoot,
	onCreateFolder,
	onUpload,
	isUploading,
}: ScriptsEmptyStateProps) {
	return (
		<Stack align="center" py="xl" gap="md">
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
			{onCreateFolder && onUpload ? (
				<Stack gap="sm" w="100%" maw={440} mx="auto">
					<DocxUploadDropzone
						onFilesSelected={onUpload}
						loading={isUploading}
						multiple
					/>
					<Button
						color="wave"
						variant="outline"
						leftSection={<FolderPlus size={16} />}
						onClick={onCreateFolder}
						mx="auto"
					>
						New Folder
					</Button>
				</Stack>
			) : isRoot ? (
				<Text size="sm" c="gray.6" ta="center" maw={320}>
					Use{" "}
					<Text span fw={600} c="gray.7">
						Upload Scripts
					</Text>{" "}
					or{" "}
					<Text span fw={600} c="gray.7">
						New Folder
					</Text>{" "}
					when those actions are available on this page.
				</Text>
			) : null}
		</Stack>
	);
}
