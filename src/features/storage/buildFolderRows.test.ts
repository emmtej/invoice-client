import { describe, expect, it } from "vitest";
import type { Folder } from "@/features/storage/types";
import { buildFolderRows } from "./buildFolderRows";

describe("buildFolderRows", () => {
	const mockFolders: Folder[] = [
		{
			id: "1",
			name: "Z Folder",
			parentId: null,
			createdAt: new Date(),
		},
		{
			id: "2",
			name: "A Folder",
			parentId: null,
			createdAt: new Date(),
		},
		{
			id: "3",
			name: "Child of A",
			parentId: "2",
			createdAt: new Date(),
		},
	];

	it("returns root and sorted top-level folders", () => {
		const result = buildFolderRows(mockFolders, "");

		expect(result).toHaveLength(4);
		expect(result[0]).toEqual({
			id: null,
			label: "Root (no folder)",
			depth: 0,
			isRoot: true,
		});
		expect(result[1]).toMatchObject({ id: "2", label: "A Folder", depth: 0 });
		expect(result[2]).toMatchObject({ id: "3", label: "Child of A", depth: 1 });
		expect(result[3]).toMatchObject({ id: "1", label: "Z Folder", depth: 0 });
	});

	it("filters folders by name and flattens result", () => {
		const result = buildFolderRows(mockFolders, "child");

		expect(result).toHaveLength(1);
		expect(result[0]).toMatchObject({
			id: "3",
			label: "Child of A",
			depth: 0,
			isRoot: false,
		});
	});

	it("returns only root when folders array is empty", () => {
		const result = buildFolderRows([], "");

		expect(result).toHaveLength(1);
		expect(result[0].id).toBeNull();
	});
});
