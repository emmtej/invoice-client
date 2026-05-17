import type { Folder } from "@/features/storage/types";

export type FolderListRow =
	| { id: null; label: string; depth: 0; isRoot: true }
	| { id: string; label: string; depth: number; isRoot: false };

export function buildFolderRows(
	folders: Folder[],
	filter: string,
): FolderListRow[] {
	const normalizedFilter = filter.toLowerCase().trim();

	if (normalizedFilter) {
		return folders
			.filter((f) => f.name.toLowerCase().includes(normalizedFilter))
			.map((f) => ({ id: f.id, label: f.name, depth: 0, isRoot: false }));
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
