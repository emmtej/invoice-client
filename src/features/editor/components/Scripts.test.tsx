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

// Mock pgliteStore to avoid database issues in jsdom
vi.mock("../store/pgliteStore", () => ({
	pgliteStore: {
		getAllDraftScripts: vi.fn().mockResolvedValue([]),
		getScriptFull: vi.fn().mockResolvedValue(null),
		saveDraftScript: vi.fn().mockResolvedValue(undefined),
		saveDraftScripts: vi.fn().mockResolvedValue(undefined),
		deleteDraftScript: vi.fn().mockResolvedValue(undefined),
		deleteDraftScripts: vi.fn().mockResolvedValue(undefined),
		saveScript: vi.fn().mockResolvedValue(undefined),
		promoteDraftsToScripts: vi.fn().mockResolvedValue(undefined),
		deleteExpiredDrafts: vi.fn().mockResolvedValue(undefined),
	},
}));

import { pgliteStore } from "../store/pgliteStore";
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
	createdAt: new Date(),
	lastAccessedAt: null,
	folderId: null,
});

describe("Scripts", () => {
	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
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
		useScriptStore.setState({
			scripts: [],
			activeScript: null,
			isLoading: false,
			persistenceEnabled: false,
		});
	});

	it("shows Getting Started when there are no scripts", () => {
		render(
			<TestWrapper>
				<Scripts />
			</TestWrapper>,
		);
		expect(screen.getByTestId("getting-started-view")).toBeTruthy();
	});

	it("does not show Getting Started view when at least one script exists", async () => {
		const mockScript = createMockScript("1", "My Script.docx");

		// Ensure loadScript finds the script
		(pgliteStore.getAllDraftScripts as any).mockResolvedValue([mockScript]);

		useScriptStore.setState({
			scripts: [mockScript],
		});

		render(
			<TestWrapper>
				<Scripts />
			</TestWrapper>,
		);

		const scriptElements = await screen.findAllByText("My Script.docx");
		expect(scriptElements.length).toBeGreaterThan(0);

		// Wait for activeScript to be loaded and view to switch
		await waitFor(
			() => {
				expect(screen.queryByTestId("getting-started-view")).toBeNull();
			},
			{ timeout: 2000 },
		);
	});

	it("clears all documents after confirming in the modal", async () => {
		const mockScript = createMockScript("1", "My Script.docx");
		(pgliteStore.getAllDraftScripts as any).mockResolvedValue([mockScript]);

		useScriptStore.setState({
			scripts: [mockScript],
			activeScript: mockScript,
		});

		render(
			<TestWrapper>
				<Scripts />
			</TestWrapper>,
		);

		const trigger = await screen.findByTestId("clear-all-documents-trigger");
		fireEvent.click(trigger);
		const confirm = await screen.findByTestId("clear-all-documents-confirm");
		fireEvent.click(confirm);

		await waitFor(() => {
			expect(useScriptStore.getState().scripts).toEqual([]);
		});
		expect(await screen.findByTestId("getting-started-view")).toBeTruthy();

		await waitFor(() => {
			expect(screen.queryByRole("dialog")).toBeNull();
		});
	});
});
