/**
 * @vitest-environment jsdom
 */
import { MantineProvider } from "@mantine/core";
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { appTheme } from "@/theme";
import type { Script } from "@/types/Script";

// Mock matchMedia for Mantine
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
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

vi.mock("zustand/middleware", () => ({
	persist: (config: unknown) => config,
	createJSONStorage: () => ({}),
}));

vi.mock("../hooks/useFileUpload", () => ({
	useFileUpload: () => ({
		docFiles: [],
		handleFileChange: vi.fn(),
		reset: vi.fn(),
	}),
}));

vi.mock("@/features/invoice/store/invoiceStore", () => ({
	useInvoiceStore: (
		selector: (s: { invoice: { items: unknown[] } }) => unknown,
	) =>
		selector({
			invoice: { items: [] },
		}),
}));

import { useScriptStore } from "../store/scriptEditorStore";
import Scripts from "./Scripts";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
	<MantineProvider theme={appTheme}>{children}</MantineProvider>
);

const createMockScript = (id: string, name: string): Script => ({
	id,
	name,
	lines: [],
	overview: {
		wordCount: 0,
		totalLines: 0,
		validLines: [],
		invalidLines: [],
		actionLines: [],
		scenes: [],
	},
	html: "",
	source: {
		name,
		type: "text/plain",
		size: 1024,
		lastModified: Date.now(),
	} as unknown as Document,
});

describe("Scripts", () => {
	afterEach(() => {
		cleanup();
	});

	beforeEach(() => {
		Object.defineProperty(window, "localStorage", {
			value: {
				getItem: vi.fn(() => null),
				setItem: vi.fn(),
				removeItem: vi.fn(),
				clear: vi.fn(),
			},
			writable: true,
		});
		useScriptStore.setState({ scripts: [] });
	});

	it("shows Getting Started tab in the header when there are no scripts", () => {
		render(
			<TestWrapper>
				<Scripts />
			</TestWrapper>,
		);
		expect(screen.getByTestId("getting-started-tab")).toBeTruthy();
	});

	it("does not show Getting Started tab when at least one script exists", () => {
		useScriptStore.setState({
			scripts: [createMockScript("1", "My Script.docx")],
		});
		render(
			<TestWrapper>
				<Scripts />
			</TestWrapper>,
		);
		expect(screen.queryByTestId("getting-started-tab")).toBeNull();
		expect(screen.getAllByText("My Script.docx").length).toBeGreaterThan(0);
	});

	it("clears all documents after confirming in the modal", async () => {
		useScriptStore.setState({
			scripts: [createMockScript("1", "My Script.docx")],
		});
		render(
			<TestWrapper>
				<Scripts />
			</TestWrapper>,
		);

		const toolbar = screen.getByTestId("scripts-tabs-bar");
		fireEvent.click(within(toolbar).getByTestId("clear-all-documents-trigger"));
		const confirm = await screen.findByTestId("clear-all-documents-confirm");
		fireEvent.click(confirm);

		await waitFor(() => {
			expect(useScriptStore.getState().scripts).toEqual([]);
		});
		expect(screen.getByTestId("getting-started-tab")).toBeTruthy();

		await waitFor(() => {
			expect(screen.queryByRole("dialog")).toBeNull();
		});
	});
});
