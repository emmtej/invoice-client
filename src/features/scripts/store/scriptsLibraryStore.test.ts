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

import { useScriptsDataStore } from "./useScriptsDataStore";
import { useScriptsUiStore } from "./useScriptsUiStore";

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

describe("Scripts Library Stores", () => {
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

	describe("useScriptsDataStore", () => {
		it("init loads schema and root folders and scripts", async () => {
			folderQueriesMocks.getFoldersAtLevel.mockResolvedValue([rootFolder]);
			scriptsQueriesMocks.getScriptsInFolder.mockResolvedValue([scriptSummary]);
			folderQueriesMocks.getChildItemCountsForFolders.mockResolvedValue({
				"f-root": 2,
			});

			await useScriptsDataStore.getState().init();

			expect(folderQueriesMocks.initSchema).toHaveBeenCalled();
			expect(folderQueriesMocks.getFoldersAtLevel).toHaveBeenCalledWith(null);
			expect(scriptsQueriesMocks.getScriptsInFolder).toHaveBeenCalledWith(null);
			expect(
				folderQueriesMocks.getChildItemCountsForFolders,
			).toHaveBeenCalledWith(["f-root"]);
			expect(useScriptsDataStore.getState().folders).toEqual([rootFolder]);
			expect(useScriptsDataStore.getState().scripts).toEqual([scriptSummary]);
			expect(useScriptsDataStore.getState().folderChildItemCounts).toEqual({
				"f-root": 2,
			});
			expect(useScriptsDataStore.getState().isLoading).toBe(false);
		});

		it("fetchFolderData loads children, scripts, and breadcrumb", async () => {
			const childFolder = {
				id: "f-child",
				name: "Child",
				parentId: "f-root",
				createdAt: new Date("2025-01-03"),
			};
			const inFolderScript = { ...scriptSummary, id: "s2", folderId: "f-root" };
			folderQueriesMocks.getFoldersAtLevel.mockResolvedValue([childFolder]);
			scriptsQueriesMocks.getScriptsInFolder.mockResolvedValue([
				inFolderScript,
			]);
			folderQueriesMocks.getFolderBreadcrumb.mockResolvedValue([
				{ id: "f-root", name: "Rootish" },
			]);

			const result = await useScriptsDataStore
				.getState()
				.fetchFolderData("f-root");

			expect(folderQueriesMocks.getFoldersAtLevel).toHaveBeenCalledWith(
				"f-root",
			);
			expect(scriptsQueriesMocks.getScriptsInFolder).toHaveBeenCalledWith(
				"f-root",
			);
			expect(folderQueriesMocks.getFolderBreadcrumb).toHaveBeenCalledWith(
				"f-root",
			);
			expect(result.breadcrumb).toEqual([{ id: "f-root", name: "Rootish" }]);
			expect(result.folders).toEqual([childFolder]);
			expect(result.scripts).toEqual([inFolderScript]);
		});

		it("createFolder generates id, creates folder, and refreshes list", async () => {
			folderQueriesMocks.getFoldersAtLevel.mockResolvedValue([rootFolder]);

			await useScriptsDataStore.getState().createFolder("New", null);

			expect(folderQueriesMocks.createFolder).toHaveBeenCalledWith(
				"generated-id",
				"New",
				null,
			);
			expect(folderQueriesMocks.getFoldersAtLevel).toHaveBeenCalled();
			expect(scriptsQueriesMocks.getScriptsInFolder).toHaveBeenCalled();
		});

		it("deleteFolder and deleteScript call queries", async () => {
			await useScriptsDataStore.getState().deleteFolder("f-del");
			expect(folderQueriesMocks.deleteFolder).toHaveBeenCalledWith("f-del");

			await useScriptsDataStore.getState().deleteScript("s-del");
			expect(scriptsQueriesMocks.deleteScript).toHaveBeenCalledWith("s-del");
		});
	});

	describe("useScriptsUiStore", () => {
		it("setCurrentFolder clears selection", () => {
			useScriptsUiStore.setState({
				currentFolderId: null,
				selectedIds: ["s1"],
				// biome-ignore lint/suspicious/noExplicitAny: mock bypass
				selectedScript: {} as any,
			});

			useScriptsUiStore.getState().setCurrentFolder("f1");

			expect(useScriptsUiStore.getState().currentFolderId).toBe("f1");
			expect(useScriptsUiStore.getState().selectedIds).toEqual([]);
			expect(useScriptsUiStore.getState().selectedScript).toBeNull();
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

			await useScriptsUiStore.getState().selectScript("s-load");

			expect(scriptsQueriesMocks.getScriptById).toHaveBeenCalledWith("s-load");
			expect(useScriptsUiStore.getState().selectedScript).toEqual(loaded);
			expect(useScriptsUiStore.getState().isPreviewLoading).toBe(false);
		});

		it("toggleSelection handles multi and range selection", () => {
			const allIds = ["1", "2", "3", "4", "5"];
			const store = useScriptsUiStore.getState();

			// Single selection
			store.toggleSelection("1", false, false, allIds);
			expect(useScriptsUiStore.getState().selectedIds).toEqual(["1"]);

			// Multi selection
			store.toggleSelection("3", true, false, allIds);
			expect(useScriptsUiStore.getState().selectedIds).toEqual(["1", "3"]);

			// Range selection
			store.toggleSelection("5", false, true, allIds);
			expect(useScriptsUiStore.getState().selectedIds).toEqual(["3", "4", "5"]);
		});

		it("clearSelection clears selected script and IDs", () => {
			useScriptsUiStore.setState({
				// biome-ignore lint/suspicious/noExplicitAny: mock bypass
				selectedScript: {} as any,
				selectedIds: ["s1"],
			});

			useScriptsUiStore.getState().clearSelection();

			expect(useScriptsUiStore.getState().selectedScript).toBeNull();
			expect(useScriptsUiStore.getState().selectedIds).toEqual([]);
		});
	});
});
