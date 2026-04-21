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
	ActionIcon,
} from "@mantine/core";
import { ChevronRight, Folder as FolderIcon, FolderPlus, Search, X } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState, useRef } from "react";
import { AppModal } from "@/components/ui/modal/AppModal";
import { SectionLabel } from "@/components/ui/text/SectionLabel";
import {
	createFolder,
	getAllFolders,
	getChildItemCountsForFolders,
	getScriptCountInFolder,
} from "@/features/storage/folderQueries";
import type { Folder } from "@/features/storage/types";
import type { ScriptMetadata } from "@/types/Script";
import { generateId } from "@/utils/id";
import { notify } from "@/utils/notifications";

const STUDIO_ICON = "var(--mantine-color-studio-5)";

interface SaveToLibraryModalProps {
	opened: boolean;
	onClose: () => void;
	title?: string;
	scripts?: ScriptMetadata[];
	itemsLabel?: string;
	onConfirm: (selectedIds: string[], folderId: string | null) => Promise<void>;
}

type FolderListRow =
	| { id: null; label: string; depth: 0; isRoot: true }
	| { id: string; label: string; depth: number; isRoot: false };

function buildFolderRows(folders: Folder[], filter: string): FolderListRow[] {
	const normalizedFilter = filter.toLowerCase().trim();
	
	if (normalizedFilter) {
		return folders
			.filter(f => f.name.toLowerCase().includes(normalizedFilter))
			.map(f => ({ id: f.id, label: f.name, depth: 0, isRoot: false }));
	}

	const roots = folders
		.filter((f) => f.parentId === null)
		.sort((a, b) => a.name.localeCompare(b.name));

	const rows: FolderListRow[] = [
		{ id: null, label: "Root (no folder)", depth: 0, isRoot: true },
	];

	const addChildren = (parentId: string, depth: number) => {
		const children = folders
			.filter((f) => f.parentId === parentId)
			.sort((a, b) => a.name.localeCompare(b.name));
		for (const child of children) {
			rows.push({ id: child.id, label: child.name, depth, isRoot: false });
			addChildren(child.id, depth + 1);
		}
	};

	for (const root of roots) {
		rows.push({ id: root.id, label: root.name, depth: 0, isRoot: false });
		addChildren(root.id, 1);
	}

	return rows;
}

export const SaveToLibraryModal = memo(
	({ 
		opened, 
		onClose, 
		scripts = [], 
		onConfirm, 
		title = "Save to Library",
		itemsLabel = "Documents"
	}: SaveToLibraryModalProps) => {
		const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
		const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
		const [folders, setFolders] = useState<Folder[]>([]);
		const [foldersLoading, setFoldersLoading] = useState(false);
		const [counts, setCounts] = useState<Record<string, number>>({});
		const [rootCount, setRootCount] = useState(0);
		const [createFormOpen, setCreateFormOpen] = useState(false);
		const [newFolderName, setNewFolderName] = useState("");
		const [searchQuery, setSearchQuery] = useState("");
		const [isCreatingFolder, setIsCreatingFolder] = useState(false);
		const [isSubmitting, setIsSubmitting] = useState(false);
		
		const viewport = useRef<HTMLDivElement>(null);

		const loadFolders = useCallback(async () => {
			setFoldersLoading(true);
			try {
				const [list, rc] = await Promise.all([
					getAllFolders(),
					getScriptCountInFolder(null)
				]);
				setFolders(list);
				setRootCount(rc);
				
				if (list.length > 0) {
					const c = await getChildItemCountsForFolders(list.map(f => f.id));
					setCounts(c);
				}
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
				setSearchQuery("");
				void loadFolders();
			}
		}, [opened, scripts, loadFolders]);

		const folderRows = useMemo(() => buildFolderRows(folders, searchQuery), [folders, searchQuery]);

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
				const parentId = selectedFolderId;
				const id = generateId();
				await createFolder(id, name, parentId);
				await loadFolders();
				setSelectedFolderId(id);
				setNewFolderName("");
				setCreateFormOpen(false);
				// Small delay to let the list re-render before scrolling
				setTimeout(() => {
					const el = document.getElementById(`folder-${id}`);
					el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
				}, 100);
			} finally {
				setIsCreatingFolder(false);
			}
		};

		const handleSave = async () => {
			setIsSubmitting(true);
			try {
				await onConfirm(Array.from(selectedIds), selectedFolderId);
				notify.success({
					message: `Successfully saved ${selectedIds.size} ${
						selectedIds.size === 1 ? "item" : "items"
					} to library`,
				});
				onClose();
			} catch (error) {
				notify.error({
					message: "Failed to save items to library",
					error,
				});
			} finally {
				setIsSubmitting(false);
			}
		};

		const isRowSelected = (row: FolderListRow) => {
			if (row.isRoot) return selectedFolderId === null;
			return selectedFolderId === row.id;
		};

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
								rightSection={searchQuery && (
									<ActionIcon size="xs" variant="subtle" onClick={() => setSearchQuery("")}>
										<X size={10} />
									</ActionIcon>
								)}
								radius="md"
								w={180}
							/>
						</Group>
						
						<ScrollArea
							h={180}
							viewportRef={viewport}
							style={{ border: "1px solid var(--mantine-color-gray-2)" }}
							p={0}
						>
							{foldersLoading ? (
								<Box py="xl" style={{ display: "flex", justifyContent: "center" }}>
									<Loader color="wave" size="sm" />
								</Box>
							) : (
								<Stack gap={0}>
									{folderRows.map((row) => {
										const selected = isRowSelected(row);
										return (
											<UnstyledButton
												key={row.isRoot ? "root" : row.id}
												id={row.isRoot ? "folder-root" : `folder-${row.id}`}
												onClick={() => setSelectedFolderId(row.isRoot ? null : row.id)}
												className={`w-full px-3 py-2 text-left transition-colors border-l-4 ${
													selected 
														? "bg-wave-50 border-wave-500" 
														: "hover:bg-gray-50 border-transparent"
												}`}
											>
												<Group gap="xs" wrap="nowrap">
													{row.isRoot ? (
														<Text size="sm" fw={selected ? 700 : 500} c={selected ? "wave.7" : "gray.8"}>
															{row.label}
														</Text>
													) : (
														<Group gap="xs" wrap="nowrap" style={{ paddingLeft: searchQuery ? 0 : row.depth * 12 }}>
															{row.depth > 0 && !searchQuery && (
																<ChevronRight size={14} className="flex-shrink-0 text-gray-400" />
															)}
															<FolderIcon
																size={16}
																color={selected ? "var(--mantine-color-wave-5)" : STUDIO_ICON}
																style={{ flexShrink: 0 }}
																fill={selected ? "var(--mantine-color-wave-1)" : "none"}
															/>
															<Text 
																size="sm" 
																fw={selected ? 700 : 500} 
																c={selected ? "wave.7" : "gray.8"} 
																truncate
															>
																{row.label}
															</Text>
														</Group>
													)}
													<Text size="xs" c={selected ? "wave.4" : "gray.4"} ml="auto" fw={500}>
														{row.isRoot ? rootCount : (counts[row.id] || 0)}
													</Text>
												</Group>
											</UnstyledButton>
										);
									})}
									{folderRows.length === 0 && !foldersLoading && (
										<Box p="md" style={{ textAlign: 'center' }}>
											<Text size="sm" c="gray.5 italic">No folders found</Text>
										</Box>
									)}
								</Stack>
							)}
						</ScrollArea>

						{createFormOpen ? (
							<Stack gap="xs" mt="sm">
								<TextInput
									label={selectedFolderId ? "New subfolder in selected" : "New folder in root"}
									placeholder="Folder name"
									value={newFolderName}
									onChange={(e) => setNewFolderName(e.currentTarget.value)}
									radius="md"
									size="sm"
									autoFocus
									onKeyDown={(e) => e.key === 'Enter' && void handleCreateFolder()}
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
									section: { marginRight: 6 }
								}}
							>
								New Folder
							</Button>
						)}
					</Box>

					{scripts.length > 0 && (
						<Box>
							<SectionLabel mb={8}>
								Select {itemsLabel} ({selectedIds.size})
							</SectionLabel>
							<ScrollArea
								h={150}
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
											styles={{
												label: { cursor: 'pointer' },
												input: { cursor: 'pointer' }
											}}
										/>
									))}
								</Stack>
							</ScrollArea>
						</Box>
					)}

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
	},
);

SaveToLibraryModal.displayName = "SaveToLibraryModal";
