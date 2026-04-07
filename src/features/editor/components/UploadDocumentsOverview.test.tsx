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
import type { Script } from "@/types/Script";
import { UploadDocumentsOverview } from "./UploadDocumentsOverview";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
	<MantineProvider theme={appTheme}>{children}</MantineProvider>
);

const createMockScript = (
	id: string,
	name: string,
	wordCount: number,
	totalLines: number,
): Script => ({
	id,
	name,
	lines: [],
	overview: {
		wordCount,
		totalLines,
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

describe("UploadDocumentsOverview", () => {
	const mockScripts: Script[] = [
		createMockScript("1", "Script 1", 100, 10),
		createMockScript("2", "Script 2", 200, 20),
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
			createMockScript("3", "Unique Script A", 100, 10),
			createMockScript("4", "Unique Script B", 200, 20),
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
