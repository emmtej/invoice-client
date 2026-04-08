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
		createFolder: vi
			.fn()
			.mockResolvedValue({
				id: "new",
				name: "New",
				parentId: null,
				createdAt: new Date(),
			}),
		deleteFolder: vi.fn().mockResolvedValue(undefined),
		getFolderBreadcrumb: vi.fn().mockResolvedValue([]),
		getScriptCountInFolder: vi.fn().mockResolvedValue(0),
	},
}));

vi.mock("./store/scriptsQueries", () => ({
	scriptsQueries: {
		getScriptsInFolder: vi.fn().mockResolvedValue([]),
		getScriptById: vi.fn().mockResolvedValue(null),
		deleteScript: vi.fn().mockResolvedValue(undefined),
	},
}));

import { useScriptsLibraryStore } from "./store/scriptsLibraryStore";
import { folderQueries } from "@/features/storage/folderQueries";
import { scriptsQueries } from "./store/scriptsQueries";

describe("ScriptsPage store integration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useScriptsLibraryStore.setState({
			currentFolderId: null,
			breadcrumb: [],
			folders: [],
			scripts: [],
			selectedScript: null,
			isLoading: false,
			isPreviewLoading: false,
		});
	});

	it("should initialize with empty state", async () => {
		await useScriptsLibraryStore.getState().init();
		const state = useScriptsLibraryStore.getState();
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

		await useScriptsLibraryStore.getState().init();

		expect(useScriptsLibraryStore.getState().folders).toEqual(mockFolders);
		expect(useScriptsLibraryStore.getState().scripts).toEqual(mockScripts);
	});

	it("should navigate into a folder and build breadcrumb", async () => {
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

		await useScriptsLibraryStore.getState().navigateToFolder("f1");

		const state = useScriptsLibraryStore.getState();
		expect(state.currentFolderId).toBe("f1");
		expect(state.breadcrumb).toEqual(crumbs);
		expect(state.folders).toEqual(subFolders);
		expect(state.scripts).toEqual(scripts);
	});

	it("should navigate back to root and clear breadcrumb", async () => {
		useScriptsLibraryStore.setState({
			currentFolderId: "f1",
			breadcrumb: [{ id: "f1", name: "Project A" }],
		});

		await useScriptsLibraryStore.getState().navigateToFolder(null);

		expect(useScriptsLibraryStore.getState().currentFolderId).toBeNull();
		expect(useScriptsLibraryStore.getState().breadcrumb).toEqual([]);
	});

	it("should clear selected script when navigating", async () => {
		useScriptsLibraryStore.setState({ selectedScript: { id: "s1" } as any });

		await useScriptsLibraryStore.getState().navigateToFolder("f1");

		expect(useScriptsLibraryStore.getState().selectedScript).toBeNull();
	});

	it("should create a folder and refresh", async () => {
		await useScriptsLibraryStore.getState().createFolder("New Folder", null);

		expect(folderQueries.createFolder).toHaveBeenCalledWith(
			expect.any(String),
			"New Folder",
			null,
		);
		expect(folderQueries.getFoldersAtLevel).toHaveBeenCalled();
	});

	it("should delete a folder and refresh", async () => {
		await useScriptsLibraryStore.getState().deleteFolder("f1");

		expect(folderQueries.deleteFolder).toHaveBeenCalledWith("f1");
		expect(folderQueries.getFoldersAtLevel).toHaveBeenCalled();
	});

	it("should clear selection when deleting the selected script's folder", async () => {
		useScriptsLibraryStore.setState({
			selectedScript: { id: "s1", folderId: "f1" } as any,
		});

		await useScriptsLibraryStore.getState().deleteFolder("f1");

		expect(useScriptsLibraryStore.getState().selectedScript).toBeNull();
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

		await useScriptsLibraryStore.getState().selectScript("s1");

		expect(useScriptsLibraryStore.getState().selectedScript).toEqual(mockScript);
		expect(useScriptsLibraryStore.getState().isPreviewLoading).toBe(false);
	});

	it("should delete a script and refresh", async () => {
		await useScriptsLibraryStore.getState().deleteScript("s1");

		expect(scriptsQueries.deleteScript).toHaveBeenCalledWith("s1");
		expect(scriptsQueries.getScriptsInFolder).toHaveBeenCalled();
	});
});
