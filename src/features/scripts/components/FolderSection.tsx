import { SimpleGrid, Stack } from "@mantine/core";
import { SectionLabel } from "@/components/ui/text/SectionLabel";
import type { Folder } from "@/features/storage/types";
import { FolderCard } from "./FolderCard";

interface FolderSectionProps {
	folders: Folder[];
	onNavigate: (folderId: string) => void;
	onDelete: (folder: Folder) => void;
}

export function FolderSection({
	folders,
	onNavigate,
	onDelete,
}: FolderSectionProps) {
	return (
		<Stack gap="sm" mb="lg">
			<SectionLabel>Folders ({folders.length})</SectionLabel>
			<SimpleGrid cols={{ base: 1, xs: 2, sm: 3 }} spacing="sm">
				{folders.map((folder) => (
					<FolderCard
						key={folder.id}
						folder={folder}
						onClick={() => onNavigate(folder.id)}
						onDelete={() => onDelete(folder)}
					/>
				))}
			</SimpleGrid>
		</Stack>
	);
}
