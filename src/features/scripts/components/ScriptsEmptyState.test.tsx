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
	it("at root shows root-specific empty state message", () => {
		render(wrap(<ScriptsEmptyState isRoot />));

		expect(screen.getByText("No scripts yet")).toBeTruthy();
		expect(
			screen.getByText(
				/Upload scripts or create a folder using the actions in the top right/i,
			),
		).toBeTruthy();
	});

	it("inside a folder shows folder-specific empty state message", () => {
		render(wrap(<ScriptsEmptyState isRoot={false} />));

		expect(screen.getByText("This folder is empty")).toBeTruthy();
		expect(
			screen.getByText(
				/Upload scripts into this folder, or create a subfolder/i,
			),
		).toBeTruthy();
	});
});
