/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const folderQueriesMocks = vi.hoisted(() => ({
	initSchema: vi.fn().mockResolvedValue(undefined),
	getFoldersAtLevel: vi.fn(),
	getFolderBreadcrumb: vi.fn(),
	createFolder: vi.fn().mockResolvedValue(undefined),
	deleteFolder: vi.fn().mockResolvedValue(undefined),
	getChildItemCountsForFolders: vi.fn().mockResolvedValue({}),
}));

const scriptsQueriesMocks = vi.hoisted(() => ({
	getScriptsInFolder: vi.fn(),
	getScriptById: vi.fn(),
	deleteScript: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/features/storage/folderQueries", () => ({
	folderQueries: folderQueriesMocks,
}));

vi.mock("./scriptsQueries", () => ({
	scriptsQueries: scriptsQueriesMocks,
}));

vi.mock("@/features/storage/pgliteClient", () => ({
	initDb: vi.fn(),
}));

vi.mock("@/utils/id", () => ({
	generateId: vi.fn(() => "generated-id"),
}));

import { useScriptsLibraryStore } from "./scriptsLibraryStore";

const rootFolder = {
	id: "f-root",
	name: "Rootish",
	parentId: null as string | null,
	createdAt: new Date("2025-01-01"),
};

const scriptSummary = {
	id: "s1",
	name: "Script One",
	folderId: null as string | null,
	wordCount: 5,
	invalidLineCount: 0,
	createdAt: new Date("2025-01-02"),
};

describe("useScriptsLibraryStore", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useScriptsLibraryStore.setState({
			currentFolderId: null,
			breadcrumb: [],
			folders: [],
			scripts: [],
			folderChildItemCounts: {},
			selectedScript: null,
			isLoading: false,
			isPreviewLoading: false,
		});
		folderQueriesMocks.initSchema.mockResolvedValue(undefined);
		folderQueriesMocks.getFoldersAtLevel.mockResolvedValue([]);
		folderQueriesMocks.getFolderBreadcrumb.mockResolvedValue([]);
		folderQueriesMocks.createFolder.mockResolvedValue(rootFolder);
		folderQueriesMocks.deleteFolder.mockResolvedValue(undefined);
		folderQueriesMocks.getChildItemCountsForFolders.mockResolvedValue({});
		scriptsQueriesMocks.getScriptsInFolder.mockResolvedValue([]);
		scriptsQueriesMocks.getScriptById.mockResolvedValue(null);
		scriptsQueriesMocks.deleteScript.mockResolvedValue(undefined);
	});

	it("init loads schema and root folders and scripts", async () => {
		folderQueriesMocks.getFoldersAtLevel.mockResolvedValue([rootFolder]);
		scriptsQueriesMocks.getScriptsInFolder.mockResolvedValue([scriptSummary]);
		folderQueriesMocks.getChildItemCountsForFolders.mockResolvedValue({
			"f-root": 2,
		});

		await useScriptsLibraryStore.getState().init();

		expect(folderQueriesMocks.initSchema).toHaveBeenCalled();
		expect(folderQueriesMocks.getFoldersAtLevel).toHaveBeenCalledWith(null);
		expect(scriptsQueriesMocks.getScriptsInFolder).toHaveBeenCalledWith(null);
		expect(
			folderQueriesMocks.getChildItemCountsForFolders,
		).toHaveBeenCalledWith(["f-root"]);
		expect(useScriptsLibraryStore.getState().folders).toEqual([rootFolder]);
		expect(useScriptsLibraryStore.getState().scripts).toEqual([scriptSummary]);
		expect(useScriptsLibraryStore.getState().folderChildItemCounts).toEqual({
			"f-root": 2,
		});
		expect(useScriptsLibraryStore.getState().isLoading).toBe(false);
	});

	it("navigateToFolder loads children, scripts, and breadcrumb inside a folder", async () => {
		const childFolder = {
			id: "f-child",
			name: "Child",
			parentId: "f-root",
			createdAt: new Date("2025-01-03"),
		};
		const inFolderScript = { ...scriptSummary, id: "s2", folderId: "f-root" };
		folderQueriesMocks.getFoldersAtLevel.mockResolvedValue([childFolder]);
		scriptsQueriesMocks.getScriptsInFolder.mockResolvedValue([inFolderScript]);
		folderQueriesMocks.getFolderBreadcrumb.mockResolvedValue([
			{ id: "f-root", name: "Rootish" },
		]);

		await useScriptsLibraryStore.getState().navigateToFolder("f-root");

		expect(folderQueriesMocks.getFoldersAtLevel).toHaveBeenCalledWith("f-root");
		expect(scriptsQueriesMocks.getScriptsInFolder).toHaveBeenCalledWith(
			"f-root",
		);
		expect(folderQueriesMocks.getFolderBreadcrumb).toHaveBeenCalledWith(
			"f-root",
		);
		const state = useScriptsLibraryStore.getState();
		expect(state.currentFolderId).toBe("f-root");
		expect(state.breadcrumb).toEqual([{ id: "f-root", name: "Rootish" }]);
		expect(state.folders).toEqual([childFolder]);
		expect(state.scripts).toEqual([inFolderScript]);
		expect(state.selectedScript).toBeNull();
	});

	it("navigateToFolder(null) clears breadcrumb", async () => {
		useScriptsLibraryStore.setState({
			currentFolderId: "f-root",
			breadcrumb: [{ id: "f-root", name: "Rootish" }],
		});
		folderQueriesMocks.getFoldersAtLevel.mockResolvedValue([]);
		scriptsQueriesMocks.getScriptsInFolder.mockResolvedValue([]);

		await useScriptsLibraryStore.getState().navigateToFolder(null);

		expect(folderQueriesMocks.getFolderBreadcrumb).not.toHaveBeenCalled();
		expect(useScriptsLibraryStore.getState().breadcrumb).toEqual([]);
		expect(useScriptsLibraryStore.getState().currentFolderId).toBeNull();
	});

	it("createFolder generates id, creates folder, and refreshes list", async () => {
		folderQueriesMocks.getFoldersAtLevel.mockResolvedValue([rootFolder]);

		await useScriptsLibraryStore.getState().createFolder("New", null);

		expect(folderQueriesMocks.createFolder).toHaveBeenCalledWith(
			"generated-id",
			"New",
			null,
		);
		expect(folderQueriesMocks.getFoldersAtLevel).toHaveBeenCalled();
		expect(scriptsQueriesMocks.getScriptsInFolder).toHaveBeenCalled();
	});

	it("deleteFolder clears selected script when it belongs to that folder", async () => {
		useScriptsLibraryStore.setState({
			selectedScript: {
				id: "sx",
				name: "X",
				html: "",
				lines: [],
				overview: {
					validLines: [],
					invalidLines: [],
					actionLines: [],
					scenes: [],
					wordCount: 0,
					totalLines: 0,
				},
				source: document.implementation.createHTMLDocument(),
				folderId: "f-del",
			},
		});
		folderQueriesMocks.getFoldersAtLevel.mockResolvedValue([]);

		await useScriptsLibraryStore.getState().deleteFolder("f-del");

		expect(folderQueriesMocks.deleteFolder).toHaveBeenCalledWith("f-del");
		expect(useScriptsLibraryStore.getState().selectedScript).toBeNull();
	});

	it("selectScript loads script and clears preview loading", async () => {
		const loaded = {
			id: "s-load",
			name: "Loaded",
			html: "<p>x</p>",
			lines: [],
			overview: {
				validLines: [],
				invalidLines: [],
				actionLines: [],
				scenes: [],
				wordCount: 0,
				totalLines: 0,
			},
			source: document.implementation.createHTMLDocument(),
		};
		scriptsQueriesMocks.getScriptById.mockResolvedValue(loaded);

		await useScriptsLibraryStore.getState().selectScript("s-load");

		expect(scriptsQueriesMocks.getScriptById).toHaveBeenCalledWith("s-load");
		expect(useScriptsLibraryStore.getState().selectedScript).toEqual(loaded);
		expect(useScriptsLibraryStore.getState().isPreviewLoading).toBe(false);
	});

	it("clearSelection clears selected script", () => {
		useScriptsLibraryStore.setState({
			selectedScript: {
				id: "s",
				name: "S",
				html: "",
				lines: [],
				overview: {
					validLines: [],
					invalidLines: [],
					actionLines: [],
					scenes: [],
					wordCount: 0,
					totalLines: 0,
				},
				source: document.implementation.createHTMLDocument(),
			},
		});

		useScriptsLibraryStore.getState().clearSelection();

		expect(useScriptsLibraryStore.getState().selectedScript).toBeNull();
	});

	it("deleteScript clears selection when deleting the selected script", async () => {
		const doc = document.implementation.createHTMLDocument();
		useScriptsLibraryStore.setState({
			selectedScript: {
				id: "s-del",
				name: "D",
				html: "",
				lines: [],
				overview: {
					validLines: [],
					invalidLines: [],
					actionLines: [],
					scenes: [],
					wordCount: 0,
					totalLines: 0,
				},
				source: doc,
			},
		});
		folderQueriesMocks.getFoldersAtLevel.mockResolvedValue([]);

		await useScriptsLibraryStore.getState().deleteScript("s-del");

		expect(scriptsQueriesMocks.deleteScript).toHaveBeenCalledWith("s-del");
		expect(useScriptsLibraryStore.getState().selectedScript).toBeNull();
	});
});
