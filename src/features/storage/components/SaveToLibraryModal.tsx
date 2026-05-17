import {
	ActionIcon,
	Box,
	Button,
	Group,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { FolderPlus, Search, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { AppModal } from "@/components/ui/modal/AppModal";
import { SectionLabel } from "@/components/ui/text/SectionLabel";
import type { ScriptMetadata } from "@/types/Script";
import { useSaveToLibraryModal } from "../hooks/useSaveToLibraryModal";
import { SaveToLibraryFolderList } from "./SaveToLibraryFolderList";
import { SaveToLibraryScriptList } from "./SaveToLibraryScriptList";

interface SaveToLibraryModalProps {
	opened: boolean;
	onClose: () => void;
	title?: string;
	scripts?: ScriptMetadata[];
	itemsLabel?: string;
	onConfirm: (selectedIds: string[], folderId: string | null) => Promise<void>;
}

export function SaveToLibraryModal({
	opened,
	onClose,
	scripts = [],
	onConfirm,
	title = "Save to Library",
	itemsLabel = "Documents",
}: SaveToLibraryModalProps) {
	const {
		selectedIds,
		selectedFolderId,
		setSelectedFolderId,
		foldersLoading,
		counts,
		rootCount,
		createFormOpen,
		setCreateFormOpen,
		newFolderName,
		setNewFolderName,
		searchQuery,
		setSearchQuery,
		isCreatingFolder,
		isSubmitting,
		folderRows,
		toggleScript,
		handleCreateFolder,
		handleSave,
	} = useSaveToLibraryModal({ opened, onClose, scripts, onConfirm });

	const viewport = useRef<HTMLDivElement>(null);

	// Scroll to new folder when it appears
	useEffect(() => {
		if (selectedFolderId) {
			const el = document.getElementById(`folder-${selectedFolderId}`);
			if (el) {
				el.scrollIntoView({ block: "nearest", behavior: "smooth" });
			}
		}
	}, [selectedFolderId]);

	return (
		<AppModal
			opened={opened}
			onClose={onClose}
			title={title}
			size="md"
			radius="md"
		>
			<Stack gap="md">
				<Text size="sm" c="gray.6">
					Choose a destination and select items to move to library.
				</Text>

				<Box>
					<Group justify="space-between" align="flex-end" mb={8}>
						<SectionLabel>Destination Folder</SectionLabel>
						<TextInput
							placeholder="Search folders..."
							size="xs"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.currentTarget.value)}
							leftSection={<Search size={12} />}
							rightSection={
								searchQuery && (
									<ActionIcon
										size="xs"
										variant="subtle"
										onClick={() => setSearchQuery("")}
									>
										<X size={10} />
									</ActionIcon>
								)
							}
							radius="md"
							w={180}
						/>
					</Group>

					<SaveToLibraryFolderList
						loading={foldersLoading}
						rows={folderRows}
						selectedFolderId={selectedFolderId}
						onSelect={setSelectedFolderId}
						counts={counts}
						rootCount={rootCount}
						searchQuery={searchQuery}
						viewportRef={viewport}
					/>

					{createFormOpen ? (
						<Stack gap="xs" mt="sm">
							<TextInput
								label={
									selectedFolderId
										? "New subfolder in selected"
										: "New folder in root"
								}
								placeholder="Folder name"
								value={newFolderName}
								onChange={(e) => setNewFolderName(e.currentTarget.value)}
								radius="md"
								size="sm"
								autoFocus
								onKeyDown={(e) =>
									e.key === "Enter" && void handleCreateFolder()
								}
							/>
							<Group gap="xs" justify="flex-end">
								<Button
									variant="subtle"
									color="gray"
									size="xs"
									radius="md"
									onClick={() => {
										setCreateFormOpen(false);
										setNewFolderName("");
									}}
								>
									Cancel
								</Button>
								<Button
									color="wave"
									size="xs"
									radius="md"
									loading={isCreatingFolder}
									disabled={!newFolderName.trim()}
									onClick={() => void handleCreateFolder()}
								>
									Create Folder
								</Button>
							</Group>
						</Stack>
					) : (
						<Button
							variant="subtle"
							color="wave"
							size="xs"
							mt="xs"
							leftSection={<FolderPlus size={14} />}
							onClick={() => setCreateFormOpen(true)}
							radius="md"
							styles={{
								section: { marginRight: 6 },
							}}
						>
							New Folder
						</Button>
					)}
				</Box>

				<SaveToLibraryScriptList
					scripts={scripts}
					selectedIds={selectedIds}
					onToggle={toggleScript}
					label={itemsLabel}
				/>

				<Group justify="flex-end" mt="md">
					<Button variant="subtle" color="gray" onClick={onClose} radius="md">
						Cancel
					</Button>
					<Button
						color="wave"
						onClick={() => void handleSave()}
						loading={isSubmitting}
						disabled={scripts.length > 0 && selectedIds.size === 0}
						radius="md"
					>
						Confirm & Save
					</Button>
				</Group>
			</Stack>
		</AppModal>
	);
}
