/**
 * @vitest-environment jsdom
 */
import type { ReactElement } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MantineProvider } from "@mantine/core";
import { appTheme } from "@/theme";
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
	const onSortAscendingChange = vi.fn();

	beforeEach(() => {
		onSortAscendingChange.mockClear();
	});

	it("lists all folder names before any script name in document order", () => {
		render(
			wrap(
				<ScriptsLibraryItems
					folders={[
						{ id: "f1", name: "Zebra Folder", ...baseFolder },
						{ id: "f2", name: "Alpha Folder", ...baseFolder },
					]}
					scripts={[
						{
							id: "s1",
							name: "A Script",
							folderId: null,
							wordCount: 1,
							invalidLineCount: 0,
							createdAt: new Date(),
						},
					]}
					sortAscending
					onSortAscendingChange={onSortAscendingChange}
					selectedScriptId={null}
					onNavigateFolder={vi.fn()}
					onDeleteFolder={vi.fn()}
					onSelectScript={vi.fn()}
					onDeleteScript={vi.fn()}
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

	it("sort toggle calls onSortAscendingChange", () => {
		render(
			wrap(
				<ScriptsLibraryItems
					folders={[{ id: "f1", name: "F", ...baseFolder }]}
					scripts={[]}
					sortAscending
					onSortAscendingChange={onSortAscendingChange}
					selectedScriptId={null}
					onNavigateFolder={vi.fn()}
					onDeleteFolder={vi.fn()}
					onSelectScript={vi.fn()}
					onDeleteScript={vi.fn()}
				/>,
			),
		);

		fireEvent.click(screen.getByText("Z–A"));
		expect(onSortAscendingChange).toHaveBeenCalledWith(false);
	});

	it("sorts scripts by name when descending", () => {
		render(
			wrap(
				<ScriptsLibraryItems
					folders={[]}
					scripts={[
						{
							id: "1",
							name: "Apple",
							folderId: null,
							wordCount: 1,
							invalidLineCount: 0,
							createdAt: new Date(),
						},
						{
							id: "2",
							name: "Banana",
							folderId: null,
							wordCount: 1,
							invalidLineCount: 0,
							createdAt: new Date(),
						},
					]}
					sortAscending={false}
					onSortAscendingChange={onSortAscendingChange}
					selectedScriptId={null}
					onNavigateFolder={vi.fn()}
					onDeleteFolder={vi.fn()}
					onSelectScript={vi.fn()}
					onDeleteScript={vi.fn()}
				/>,
			),
		);

		const text = document.body.textContent ?? "";
		expect(text.indexOf("Banana")).toBeLessThan(text.indexOf("Apple"));
	});
});
