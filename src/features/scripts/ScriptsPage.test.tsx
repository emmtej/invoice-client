/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/storage/pgliteClient", () => ({
	initDb: vi.fn().mockResolvedValue({ exec: vi.fn(), query: vi.fn() }),
	getDb: vi.fn(() => ({ exec: vi.fn(), query: vi.fn() })),
}));

vi.mock("@/features/storage/folderQueries", () => ({
	folderQueries: {
		initSchema: vi.fn().mockResolvedValue(undefined),
		getFoldersAtLevel: vi.fn().mockResolvedValue([]),
		getAllFolders: vi.fn().mockResolvedValue([]),
		createFolder: vi.fn().mockResolvedValue({
			id: "new",
			name: "New",
			parentId: null,
			createdAt: new Date(),
		}),
		deleteFolder: vi.fn().mockResolvedValue(undefined),
		getFolderBreadcrumb: vi.fn().mockResolvedValue([]),
		getScriptCountInFolder: vi.fn().mockResolvedValue(0),
		getChildItemCountsForFolders: vi.fn().mockResolvedValue({}),
	},
}));

vi.mock("./store/scriptsQueries", () => ({
	scriptsQueries: {
		getScriptsInFolder: vi.fn().mockResolvedValue([]),
		getScriptById: vi.fn().mockResolvedValue(null),
		deleteScript: vi.fn().mockResolvedValue(undefined),
		duplicateScript: vi.fn().mockResolvedValue(undefined),
	},
}));

import { folderQueries } from "@/features/storage/folderQueries";
import { scriptsQueries } from "./store/scriptsQueries";
import { useScriptsDataStore } from "./store/useScriptsDataStore";
import { useScriptsUiStore } from "./store/useScriptsUiStore";

describe("Scripts Library Stores integration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useScriptsDataStore.setState({
			folders: [],
			scripts: [],
			breadcrumb: [],
			folderChildItemCounts: {},
			isLoading: false,
		});
		useScriptsUiStore.setState({
			currentFolderId: null,
			selectedScript: null,
			selectedIds: [],
			lastSelectedId: null,
			isPreviewLoading: false,
		});
	});

	describe("useScriptsDataStore", () => {
		it("should initialize with empty state", async () => {
			await useScriptsDataStore.getState().init();
			const state = useScriptsDataStore.getState();
			expect(state.isLoading).toBe(false);
			expect(state.folders).toEqual([]);
			expect(state.scripts).toEqual([]);
		});

		it("should load folders and scripts on init", async () => {
			const mockFolders = [
				{ id: "f1", name: "Project A", parentId: null, createdAt: new Date() },
			];
			const mockScripts = [
				{
					id: "s1",
					name: "Script 1",
					folderId: null,
					wordCount: 100,
					invalidLineCount: 0,
					createdAt: new Date(),
				},
			];
			(folderQueries.getFoldersAtLevel as any).mockResolvedValue(mockFolders);
			(scriptsQueries.getScriptsInFolder as any).mockResolvedValue(mockScripts);

			await useScriptsDataStore.getState().init();

			expect(useScriptsDataStore.getState().folders).toEqual(mockFolders);
			expect(useScriptsDataStore.getState().scripts).toEqual(mockScripts);
		});

		it("should fetch folder data and build breadcrumb", async () => {
			const subFolders = [
				{ id: "f2", name: "Episode 1", parentId: "f1", createdAt: new Date() },
			];
			const scripts = [
				{
					id: "s1",
					name: "Script 1",
					folderId: "f1",
					wordCount: 50,
					invalidLineCount: 1,
					createdAt: new Date(),
				},
			];
			const crumbs = [{ id: "f1", name: "Project A" }];

			(folderQueries.getFoldersAtLevel as any).mockResolvedValue(subFolders);
			(scriptsQueries.getScriptsInFolder as any).mockResolvedValue(scripts);
			(folderQueries.getFolderBreadcrumb as any).mockResolvedValue(crumbs);

			const result = await useScriptsDataStore.getState().fetchFolderData("f1");

			expect(result.breadcrumb).toEqual(crumbs);
			expect(result.folders).toEqual(subFolders);
			expect(result.scripts).toEqual(scripts);

			const state = useScriptsDataStore.getState();
			expect(state.breadcrumb).toEqual(crumbs);
			expect(state.folders).toEqual(subFolders);
		});

		it("should create a folder and refresh", async () => {
			await useScriptsDataStore.getState().createFolder("New Folder", null);

			expect(folderQueries.createFolder).toHaveBeenCalledWith(
				expect.any(String),
				"New Folder",
				null,
			);
			expect(folderQueries.getFoldersAtLevel).toHaveBeenCalled();
		});

		it("should delete a script", async () => {
			await useScriptsDataStore.getState().deleteScript("s1");
			expect(scriptsQueries.deleteScript).toHaveBeenCalledWith("s1");
		});
	});

	describe("useScriptsUiStore", () => {
		it("should handle navigation state", () => {
			useScriptsUiStore.getState().setCurrentFolder("f1");
			const state = useScriptsUiStore.getState();
			expect(state.currentFolderId).toBe("f1");
			expect(state.selectedScript).toBeNull();
			expect(state.selectedIds).toEqual([]);
		});

		it("should clear selection when navigating to null", () => {
			useScriptsUiStore.setState({
				currentFolderId: "f1",
				selectedIds: ["s1"],
			});

			useScriptsUiStore.getState().setCurrentFolder(null);

			expect(useScriptsUiStore.getState().currentFolderId).toBeNull();
			expect(useScriptsUiStore.getState().selectedIds).toEqual([]);
		});

		it("should select a script for preview", async () => {
			const mockScript = {
				id: "s1",
				name: "Test",
				html: "<p>Hello</p>",
				lines: [],
				overview: {
					wordCount: 1,
					invalidLines: [],
					validLines: [],
					actionLines: [],
					scenes: [],
					totalLines: 1,
				},
				source: document.implementation.createHTMLDocument(),
			};
			(scriptsQueries.getScriptById as any).mockResolvedValue(mockScript);

			await useScriptsUiStore.getState().selectScript("s1");

			expect(useScriptsUiStore.getState().selectedScript).toEqual(mockScript);
			expect(useScriptsUiStore.getState().isPreviewLoading).toBe(false);
		});

		it("should clear selection", () => {
			useScriptsUiStore.setState({
				selectedIds: ["s1"],
				selectedScript: {} as any,
			});
			useScriptsUiStore.getState().clearSelection();
			expect(useScriptsUiStore.getState().selectedIds).toEqual([]);
			expect(useScriptsUiStore.getState().selectedScript).toBeNull();
		});
	});
});
