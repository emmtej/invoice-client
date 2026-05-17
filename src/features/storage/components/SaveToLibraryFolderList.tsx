import {
	Box,
	Group,
	Loader,
	ScrollArea,
	Stack,
	Text,
	UnstyledButton,
} from "@mantine/core";
import { ChevronRight, Folder as FolderIcon } from "lucide-react";
import type { FolderListRow } from "../buildFolderRows";

const FOLDER_ICON_COLOR = "var(--mantine-color-gray-6)";

interface SaveToLibraryFolderListProps {
	loading: boolean;
	rows: FolderListRow[];
	selectedFolderId: string | null;
	onSelect: (id: string | null) => void;
	counts: Record<string, number>;
	rootCount: number;
	searchQuery: string;
	viewportRef?: React.RefObject<HTMLDivElement | null>;
}

export function SaveToLibraryFolderList({
	loading,
	rows,
	selectedFolderId,
	onSelect,
	counts,
	rootCount,
	searchQuery,
	viewportRef,
}: SaveToLibraryFolderListProps) {
	const isRowSelected = (row: FolderListRow) => {
		if (row.isRoot) return selectedFolderId === null;
		return selectedFolderId === row.id;
	};

	if (loading) {
		return (
			<Box py="xl" style={{ display: "flex", justifyContent: "center" }}>
				<Loader color="blue" size="sm" />
			</Box>
		);
	}

	return (
		<ScrollArea
			h={180}
			viewportRef={viewportRef}
			style={{ border: "1px solid var(--mantine-color-gray-2)" }}
			p={0}
		>
			<Stack gap={0}>
				{rows.map((row) => {
					const selected = isRowSelected(row);
					return (
						<UnstyledButton
							key={row.isRoot ? "root" : row.id}
							id={row.isRoot ? "folder-root" : `folder-${row.id}`}
							onClick={() => onSelect(row.isRoot ? null : row.id)}
							className={`w-full px-3 py-2 text-left transition-colors border-l-4 ${selected ? "border-blue-5 bg-blue-0" : "border-transparent hover:bg-gray-0"}`}
						>
							<Group gap="xs" wrap="nowrap">
								{row.isRoot ? (
									<Text
										size="sm"
										fw={selected ? 700 : 500}
										c={selected ? "blue" : "dimmed"}
									>
										{row.label}
									</Text>
								) : (
									<Group
										gap="xs"
										wrap="nowrap"
										style={{
											paddingLeft: searchQuery ? 0 : row.depth * 12,
										}}
									>
										{row.depth > 0 && !searchQuery && (
											<ChevronRight
												size={14}
												className="flex-shrink-0"
											/>
										)}
										<FolderIcon
											size={16}
											color={
												selected ? "var(--mantine-color-blue-6)" : FOLDER_ICON_COLOR
											}
											style={{ flexShrink: 0 }}
											fill={selected ? "var(--mantine-color-blue-6)" : "none"}
										/>
										<Text
											size="sm"
											fw={selected ? 700 : 500}
											c={selected ? "blue" : "dimmed"}
											truncate
										>
											{row.label}
										</Text>
									</Group>
								)}
								<Text
									size="xs"
									c={selected ? "blue" : "dimmed"}
									ml="auto"
									fw={500}
								>
									{row.isRoot ? rootCount : counts[row.id] || 0}
								</Text>
							</Group>
						</UnstyledButton>
					);
				})}
				{rows.length === 0 && (
					<Box p="md" style={{ textAlign: "center" }}>
						<Text size="sm" c="dimmed" fs="italic">
							No folders found
						</Text>
					</Box>
				)}
			</Stack>
		</ScrollArea>
	);
}
