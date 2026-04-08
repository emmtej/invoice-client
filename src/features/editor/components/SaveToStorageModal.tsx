import {
	Box,
	Button,
	Checkbox,
	Group,
	Loader,
	ScrollArea,
	Stack,
	Text,
	TextInput,
	UnstyledButton,
} from "@mantine/core";
import { ChevronRight, Folder as FolderIcon, FolderPlus } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { AppModal } from "@/components/ui/modal/AppModal";
import { SectionLabel } from "@/components/ui/text/SectionLabel";
import { createFolder, getAllFolders } from "@/features/storage/folderQueries";
import type { Folder } from "@/features/storage/types";
import type { Script } from "@/types/Script";
import { generateId } from "@/utils/id";

const STUDIO_ICON = "var(--mantine-color-studio-5)";

interface SaveToStorageModalProps {
	opened: boolean;
	onClose: () => void;
	scripts: Script[];
	onConfirm: (
		selectedIds: string[],
		folderId: string | null,
	) => Promise<void>;
}

type FolderListRow =
	| { id: null; label: string; depth: 0; isRoot: true }
	| { id: string; label: string; depth: 0 | 1; isRoot: false };

function buildFolderRows(folders: Folder[]): FolderListRow[] {
	const roots = folders
		.filter((f) => f.parentId === null)
		.sort((a, b) => a.name.localeCompare(b.name));

	const rows: FolderListRow[] = [
		{ id: null, label: "Root (no folder)", depth: 0, isRoot: true },
	];

	for (const root of roots) {
		rows.push({ id: root.id, label: root.name, depth: 0, isRoot: false });
		const children = folders
			.filter((f) => f.parentId === root.id)
			.sort((a, b) => a.name.localeCompare(b.name));
		for (const child of children) {
			rows.push({ id: child.id, label: child.name, depth: 1, isRoot: false });
		}
	}

	return rows;
}

function parentIdForNewFolder(
	selectedFolderId: string | null,
	folders: Folder[],
): string | null {
	if (selectedFolderId === null) return null;
	const selected = folders.find((f) => f.id === selectedFolderId);
	if (!selected) return null;
	if (selected.parentId === null) return selected.id;
	return null;
}

export const SaveToStorageModal = memo(
	({ opened, onClose, scripts, onConfirm }: SaveToStorageModalProps) => {
		const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
		const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
			null,
		);
		const [folders, setFolders] = useState<Folder[]>([]);
		const [foldersLoading, setFoldersLoading] = useState(false);
		const [createFormOpen, setCreateFormOpen] = useState(false);
		const [newFolderName, setNewFolderName] = useState("");
		const [isCreatingFolder, setIsCreatingFolder] = useState(false);
		const [isSubmitting, setIsSubmitting] = useState(false);

		const loadFolders = useCallback(async () => {
			setFoldersLoading(true);
			try {
				const list = await getAllFolders();
				setFolders(list);
			} catch {
				setFolders([]);
			} finally {
				setFoldersLoading(false);
			}
		}, []);

		useEffect(() => {
			if (opened) {
				setSelectedIds(new Set(scripts.map((s) => s.id)));
				setSelectedFolderId(null);
				setCreateFormOpen(false);
				setNewFolderName("");
				void loadFolders();
			}
		}, [opened, scripts, loadFolders]);

		const folderRows = useMemo(() => buildFolderRows(folders), [folders]);

		const toggleScript = (id: string) => {
			setSelectedIds((prev) => {
				const next = new Set(prev);
				if (next.has(id)) next.delete(id);
				else next.add(id);
				return next;
			});
		};

		const handleCreateFolder = async () => {
			const name = newFolderName.trim();
			if (!name) return;

			setIsCreatingFolder(true);
			try {
				const parentId = parentIdForNewFolder(selectedFolderId, folders);
				const id = generateId();
				await createFolder(id, name, parentId);
				await loadFolders();
				setSelectedFolderId(id);
				setNewFolderName("");
				setCreateFormOpen(false);
			} finally {
				setIsCreatingFolder(false);
			}
		};

		const handleSave = async () => {
			setIsSubmitting(true);
			await onConfirm(Array.from(selectedIds), selectedFolderId);
			setIsSubmitting(false);
			onClose();
		};

		const isRowSelected = (row: FolderListRow) => {
			if (row.isRoot) return selectedFolderId === null;
			return selectedFolderId === row.id;
		};

		return (
			<AppModal
				opened={opened}
				onClose={onClose}
				title="Save to Library"
				size="md"
				radius={0}
			>
				<Stack gap="md">
					<Text size="sm" c="gray.6">
						Choose a folder and select which drafts to move to long-term
						storage.
					</Text>

					<Box>
						<SectionLabel mb={8}>Destination Folder</SectionLabel>
						<ScrollArea
							h={150}
							style={{ border: "1px solid var(--mantine-color-gray-2)" }}
							p="xs"
						>
							{foldersLoading ? (
								<Box py="md" style={{ display: "flex", justifyContent: "center" }}>
									<Loader color="wave" size="sm" />
								</Box>
							) : (
								<Stack gap={2}>
									{folderRows.map((row) => {
										const selected = isRowSelected(row);
										return (
											<UnstyledButton
												key={row.isRoot ? "root" : row.id}
												onClick={() =>
													setSelectedFolderId(row.isRoot ? null : row.id)
												}
												className={`w-full rounded-none px-2 py-2 text-left transition-colors ${
													selected
														? "bg-wave-50"
														: "hover:bg-gray-50"
												}`}
											>
												{row.isRoot ? (
													<Text size="sm" fw={600} c="gray.8">
														{row.label}
													</Text>
												) : row.depth === 0 ? (
													<Group gap="xs" wrap="nowrap">
														<FolderIcon
															size={18}
															color={STUDIO_ICON}
															style={{ flexShrink: 0 }}
														/>
														<Text size="sm" fw={600} c="gray.8" truncate>
															{row.label}
														</Text>
													</Group>
												) : (
													<Group gap={4} wrap="nowrap" pl="md">
														<ChevronRight
															size={14}
															className="flex-shrink-0 text-gray-400"
														/>
														<FolderIcon
															size={18}
															color={STUDIO_ICON}
															style={{ flexShrink: 0 }}
														/>
														<Text size="sm" fw={600} c="gray.8" truncate>
															{row.label}
														</Text>
													</Group>
												)}
											</UnstyledButton>
										);
									})}
								</Stack>
							)}
						</ScrollArea>

						{createFormOpen ? (
							<Stack gap="xs" mt="sm">
								<TextInput
									placeholder="Folder name"
									value={newFolderName}
									onChange={(e) => setNewFolderName(e.currentTarget.value)}
									radius={0}
									size="sm"
								/>
								<Group gap="xs" justify="flex-end">
									<Button
										variant="subtle"
										color="gray"
										size="xs"
										radius={0}
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
										radius={0}
										loading={isCreatingFolder}
										disabled={!newFolderName.trim()}
										onClick={() => void handleCreateFolder()}
									>
										Create
									</Button>
								</Group>
							</Stack>
						) : (
							<Text
								component="button"
								type="button"
								mt="sm"
								size="sm"
								fw={600}
								c="wave"
								style={{
									cursor: "pointer",
									background: "none",
									border: "none",
									padding: 0,
									display: "inline-flex",
									alignItems: "center",
									gap: 6,
								}}
								onClick={() => setCreateFormOpen(true)}
							>
								<FolderPlus size={16} />
								New Folder
							</Text>
						)}
					</Box>

					<Box>
						<SectionLabel mb={8}>
							Select Documents ({selectedIds.size})
						</SectionLabel>
						<ScrollArea
							h={200}
							style={{ border: "1px solid var(--mantine-color-gray-2)" }}
							p="xs"
						>
							<Stack gap={4}>
								{scripts.map((s) => (
									<Checkbox
										key={s.id}
										label={s.name}
										checked={selectedIds.has(s.id)}
										onChange={() => toggleScript(s.id)}
										color="wave"
										size="sm"
									/>
								))}
							</Stack>
						</ScrollArea>
					</Box>

					<Group justify="flex-end" mt="xl">
						<Button variant="subtle" color="gray" onClick={onClose} radius={0}>
							Cancel
						</Button>
						<Button
							color="wave"
							onClick={() => void handleSave()}
							loading={isSubmitting}
							disabled={selectedIds.size === 0}
							radius={0}
						>
							Confirm & Save
						</Button>
					</Group>
				</Stack>
			</AppModal>
		);
	},
);

SaveToStorageModal.displayName = "SaveToStorageModal";
