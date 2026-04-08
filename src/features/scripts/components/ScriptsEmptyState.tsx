import { Button, Stack } from "@mantine/core";
import { FolderOpen, FolderPlus } from "lucide-react";
import { EmptyState } from "@/components/ui/feedback/EmptyState";

interface ScriptsEmptyStateProps {
	isRoot: boolean;
	onCreateFolder: () => void;
}

export function ScriptsEmptyState({
	isRoot,
	onCreateFolder,
}: ScriptsEmptyStateProps) {
	return (
		<Stack align="center" py="xl">
			<EmptyState
				icon={<FolderOpen size={40} />}
				title={isRoot ? "No scripts yet" : "This folder is empty"}
				description={
					isRoot
						? "Create a folder to organize your scripts, or upload scripts in the Editor."
						: "Add scripts to this folder from the Editor, or create a subfolder."
				}
				maxDescriptionWidth={280}
			/>
			<Button
				color="wave"
				variant="light"
				leftSection={<FolderPlus size={16} />}
				onClick={onCreateFolder}
			>
				New Folder
			</Button>
		</Stack>
	);
}
