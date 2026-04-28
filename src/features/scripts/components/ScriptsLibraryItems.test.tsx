/**
 * @vitest-environment jsdom
 */

import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { appTheme } from "@/theme";
import { useScriptsDataStore } from "../store/useScriptsDataStore";
import { useScriptsUiStore } from "../store/useScriptsUiStore";
import { ScriptsLibraryItems } from "./ScriptsLibraryItems";

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));

afterEach(() => {
	cleanup();
});

function wrap(ui: ReactElement) {
	return <MantineProvider theme={appTheme}>{ui}</MantineProvider>;
}

const baseFolder = {
	parentId: null as string | null,
	createdAt: new Date("2025-01-01"),
};

describe("ScriptsLibraryItems", () => {
	beforeEach(() => {
		useScriptsDataStore.setState({
			folders: [],
			scripts: [],
			folderChildItemCounts: {},
		});
		useScriptsUiStore.setState({
			viewMode: "list",
			selectedScript: null,
			selectedIds: [],
		});
	});

	it("lists all folder names before any script name in document order", () => {
		useScriptsDataStore.setState({
			folders: [
				{ id: "f1", name: "Zebra Folder", ...baseFolder },
				{ id: "f2", name: "Alpha Folder", ...baseFolder },
			],
			scripts: [
				{
					id: "s1",
					name: "A Script",
					folderId: null,
					wordCount: 1,
					invalidLineCount: 0,
					createdAt: new Date(),
					lastAccessedAt: null,
				},
			],
		});

		render(
			wrap(
				<ScriptsLibraryItems
					onNavigateFolder={vi.fn()}
					hasMoreScripts={false}
					isLoadingMore={false}
					onLoadMore={vi.fn()}
					allCurrentIds={["f1", "f2", "s1"]}
				/>,
			),
		);

		const text = document.body.textContent ?? "";
		const idxAlpha = text.indexOf("Alpha Folder");
		const idxZebra = text.indexOf("Zebra Folder");
		const idxScript = text.indexOf("A Script");
		expect(idxAlpha).toBeGreaterThanOrEqual(0);
		expect(idxZebra).toBeGreaterThanOrEqual(0);
		expect(idxScript).toBeGreaterThanOrEqual(0);
		expect(Math.max(idxAlpha, idxZebra)).toBeLessThan(idxScript);
	});

	it("sorts scripts by name when descending", () => {
		useScriptsDataStore.setState({
			scripts: [
				{
					id: "1",
					name: "Apple",
					folderId: null,
					wordCount: 1,
					invalidLineCount: 0,
					createdAt: new Date(),
					lastAccessedAt: null,
				},
				{
					id: "2",
					name: "Banana",
					folderId: null,
					wordCount: 1,
					invalidLineCount: 0,
					createdAt: new Date(),
					lastAccessedAt: null,
				},
			],
		});

		render(
			wrap(
				<ScriptsLibraryItems
					onNavigateFolder={vi.fn()}
					hasMoreScripts={false}
					isLoadingMore={false}
					onLoadMore={vi.fn()}
					allCurrentIds={["1", "2"]}
				/>,
			),
		);

		// Click to sort descending
		fireEvent.click(screen.getByText("Name"));

		const text = document.body.textContent ?? "";
		expect(text.indexOf("Banana")).toBeLessThan(text.indexOf("Apple"));
	});
});
