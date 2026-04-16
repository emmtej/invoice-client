/**
 * @vitest-environment jsdom
 */

import { MantineProvider } from "@mantine/core";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { appTheme } from "@/theme";
import { ScriptsEmptyState } from "./ScriptsEmptyState";

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

function wrap(ui: ReactElement) {
	return <MantineProvider theme={appTheme}>{ui}</MantineProvider>;
}

afterEach(() => {
	cleanup();
});

describe("ScriptsEmptyState", () => {
	it("at root without handlers shows hint only — no upload or new-folder buttons", () => {
		render(wrap(<ScriptsEmptyState isRoot />));

		expect(screen.getByText("No scripts yet")).toBeTruthy();
		expect(
			screen.getByText(/when those actions are available on this page/i),
		).toBeTruthy();

		expect(screen.queryByText(/drop word documents here/i)).toBeNull();
		expect(screen.queryByRole("button", { name: /new folder/i })).toBeNull();
	});

	it("at root with handlers shows upload and new-folder buttons", () => {
		const onUpload = vi.fn();
		const onCreateFolder = vi.fn();

		render(
			wrap(
				<ScriptsEmptyState
					isRoot
					onUpload={onUpload}
					onCreateFolder={onCreateFolder}
				/>,
			),
		);

		expect(screen.getByText("No scripts yet")).toBeTruthy();
		expect(screen.getByText(/drop word documents here/i)).toBeTruthy();
		expect(screen.getByRole("button", { name: /new folder/i })).toBeTruthy();
	});

	it("inside a folder shows centered upload and new-folder buttons", () => {
		const onUpload = vi.fn();
		const onCreateFolder = vi.fn();

		render(
			wrap(
				<ScriptsEmptyState
					isRoot={false}
					onUpload={onUpload}
					onCreateFolder={onCreateFolder}
				/>,
			),
		);

		expect(screen.getByText("This folder is empty")).toBeTruthy();
		expect(screen.getByText(/drop word documents here/i)).toBeTruthy();
		expect(screen.getByRole("button", { name: /new folder/i })).toBeTruthy();
		expect(screen.queryByText(/at the top right/i)).toBeNull();
	});
});
