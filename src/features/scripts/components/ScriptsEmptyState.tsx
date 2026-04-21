import { Stack } from "@mantine/core";
import { FolderOpen } from "lucide-react";
import { EmptyState } from "@/components/ui/feedback/EmptyState";

interface ScriptsEmptyStateProps {
	isRoot: boolean;
	onCreateFolder?: () => void;
	onUpload?: (files: File[]) => void;
	isUploading?: boolean;
}

export function ScriptsEmptyState({ isRoot }: ScriptsEmptyStateProps) {
	return (
		<Stack align="center" justify="center" h="100%" py="xl" gap="md">
			<EmptyState
				icon={<FolderOpen size={48} strokeWidth={1.5} color="var(--mantine-color-studio-blue-3)" />}
				title={isRoot ? "No scripts yet" : "This folder is empty"}
				description={
					isRoot
						? "Upload scripts or create a folder using the actions in the top right."
						: "Upload scripts into this folder, or create a subfolder."
				}
				maxDescriptionWidth={280}
			/>
		</Stack>
	);
}
