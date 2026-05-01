import { useQueryClient } from "@tanstack/react-query";
import {
	pgliteStore,
	processDocuments,
	useFileUpload,
} from "@/features/editor";
import { useScriptsUiStore } from "../store/useScriptsUiStore";
import { scriptKeys } from "./useScriptsQuery";

export function useScriptsUpload() {
	const currentFolderId = useScriptsUiStore((s) => s.currentFolderId);
	const queryClient = useQueryClient();

	const {
		isLoading: isUploading,
		processedCount,
		totalCount,
		errors: uploadErrors,
		handleFileChange,
		reset: resetUpload,
	} = useFileUpload({
		onSuccess: async (docFiles) => {
			const processed = await processDocuments(docFiles);
			const newScripts = processed.map((s) => ({
				...s,
				folderId: currentFolderId,
			}));
			await pgliteStore.saveScripts(newScripts);
			await queryClient.invalidateQueries({ queryKey: scriptKeys.all });
			resetUpload();
		},
	});

	return {
		isUploading,
		processedCount,
		totalCount,
		uploadErrors,
		handleFileChange,
		resetUpload,
	};
}
