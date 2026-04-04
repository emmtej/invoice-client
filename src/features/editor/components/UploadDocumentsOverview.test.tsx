/**
 * @vitest-environment jsdom
 */
import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock matchMedia for Mantine
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

import { appTheme } from "@/theme";
import { UploadDocumentsOverview } from "./UploadDocumentsOverview";
import type { Script } from "@/types/Script";

// Mock Zustand stores
vi.mock("@/features/invoice/store/invoiceStore", () => ({
	useInvoiceStore: vi.fn((selector) =>
		selector({
			invoice: { items: [], defaultRatePerWord: 0.1 },
			addSubitemsToItem: vi.fn(),
			addSubitemsAsNewItem: vi.fn(),
		}),
	),
}));

vi.mock("@/features/invoice/presets/useSubitemPresets", () => ({
	useSubitemPresets: () => ({
		presetOptions: [],
		addPreset: vi.fn(),
		getPresetById: vi.fn(),
	}),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
	<MantineProvider theme={appTheme}>{children}</MantineProvider>
);

describe("UploadDocumentsOverview", () => {
	const mockScripts: Script[] = [
		{
			id: "1",
			name: "Script 1",
			lines: [],
			overview: { wordCount: 100, totalLines: 10 } as any,
			html: "",
			source: {} as any,
		},
		{
			id: "2",
			name: "Script 2",
			lines: [],
			overview: { wordCount: 200, totalLines: 20 } as any,
			html: "",
			source: {} as any,
		},
	];

	it("should render all scripts in the list", () => {
		render(
			<TestWrapper>
				<UploadDocumentsOverview scripts={mockScripts} />
			</TestWrapper>,
		);
		expect(screen.getAllByText("Script 1").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Script 2").length).toBeGreaterThan(0);
	});

	it("should update internal selection when scripts prop changes", () => {
		const uniqueScripts: Script[] = [
			{
				id: "3",
				name: "Unique Script A",
				lines: [],
				overview: { wordCount: 100, totalLines: 10 } as any,
				html: "",
				source: {} as any,
			},
			{
				id: "4",
				name: "Unique Script B",
				lines: [],
				overview: { wordCount: 200, totalLines: 20 } as any,
				html: "",
				source: {} as any,
			},
		];

		const { rerender } = render(
			<TestWrapper>
				<UploadDocumentsOverview scripts={[uniqueScripts[0]]} />
			</TestWrapper>,
		);

		// Initially only 1 script selected (implied by rendering)
		expect(screen.getAllByText("Unique Script A").length).toBeGreaterThan(0);
		expect(screen.queryByText("Unique Script B")).toBeNull();

		// Rerender with more scripts
		rerender(
			<TestWrapper>
				<UploadDocumentsOverview scripts={uniqueScripts} />
			</TestWrapper>,
		);

		expect(screen.getAllByText("Unique Script A").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Unique Script B").length).toBeGreaterThan(0);
	});
});
