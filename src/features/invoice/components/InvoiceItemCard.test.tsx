/**
 * @vitest-environment jsdom
 */

import { MantineProvider } from "@mantine/core";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { appTheme } from "@/theme";
import type { InvoiceItem } from "../store/invoiceStore";
import { InvoiceItemCard } from "./InvoiceItemCard";

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

describe("InvoiceItemCard", () => {
	const mockItem: InvoiceItem = {
		id: "item-1",
		name: "Test Item",
		subitems: [
			{
				id: "sub-1",
				label: "Subitem Label",
				scriptIds: ["s1"],
				scriptName: "Script 1",
				wordCount: 1000,
				ratePerWord: 0.1,
				ratePerWords: 1,
				amount: 100,
			},
		],
	};

	it("renders item name and sub-items correctly", () => {
		render(wrap(<InvoiceItemCard item={mockItem} />));

		expect(screen.getByText("Test Item")).toBeTruthy();
		expect(screen.getByText("Subitem Label")).toBeTruthy();
		expect(screen.getByText("Script 1")).toBeTruthy();
		expect(screen.getByText("1,000")).toBeTruthy();
		// The amount is formatted as $100.00
		expect(screen.getByText("$100.00")).toBeTruthy();
	});

	it("renders 'No sub-items added yet.' when subitems array is empty", () => {
		const emptyItem: InvoiceItem = { ...mockItem, subitems: [] };
		render(wrap(<InvoiceItemCard item={emptyItem} />));

		expect(screen.getByText("No sub-items added yet.")).toBeTruthy();
	});
});
