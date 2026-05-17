import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { processDocuments } from "@/features/editor/documentParser";
import { useFileUpload } from "@/features/editor/hooks/useFileUpload";
import { scriptRepository } from "@/features/storage/scriptRepository";
import { useScriptsUiStore } from "../useScriptsUiStore";
import { useScriptsUpload } from "./useScriptsUpload";

vi.mock("@/features/editor", () => ({
	useFileUpload: vi.fn(),
	processDocuments: vi.fn(),
}));

vi.mock("@/features/storage/scriptRepository", () => ({
	scriptRepository: {
		saveScripts: vi.fn().mockResolvedValue(undefined),
	},
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useScriptsUpload", () => {
	it("processes and saves scripts on successful upload", async () => {
		const mockHandleFileChange = vi.fn();
		const mockReset = vi.fn();
		let onSuccessCallback: (files: File[]) => Promise<void> = async () => {};

		(useFileUpload as any).mockImplementation(({ onSuccess }: any) => {
			onSuccessCallback = onSuccess;
			return {
				isLoading: false,
				processedCount: 0,
				totalCount: 0,
				errors: [],
				handleFileChange: mockHandleFileChange,
				reset: mockReset,
			};
		});

		const mockProcessedScripts = [{ id: "1", name: "Script 1" }];
		(processDocuments as any).mockResolvedValue(mockProcessedScripts);

		useScriptsUiStore.getState().setCurrentFolder("folder-123");

		renderHook(() => useScriptsUpload(), { wrapper });

		// Simulate file selection
		const files = [new File([""], "test.docx")];
		await onSuccessCallback(files);

		expect(processDocuments).toHaveBeenCalledWith(files);
		expect(scriptRepository.saveScripts).toHaveBeenCalledWith([
			{ ...mockProcessedScripts[0], folderId: "folder-123" },
		]);
		expect(mockReset).toHaveBeenCalled();
	});
});
