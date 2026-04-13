import { useEffect } from "react";
import {
	pgliteStore,
	processDocuments,
	useFileUpload,
} from "@/features/editor";
import { useScriptsDataStore } from "../store/useScriptsDataStore";
import { useScriptsUiStore } from "../store/useScriptsUiStore";

export function useScriptsUpload() {
	const currentFolderId = useScriptsUiStore((s) => s.currentFolderId);
	const refresh = useScriptsDataStore((s) => s.refresh);

	const {
		docFiles,
		isLoading: isUploading,
		errors: uploadErrors,
		handleFileChange,
		reset: resetUpload,
	} = useFileUpload();

	useEffect(() => {
		if (docFiles.length === 0) return;
		let cancelled = false;

		(async () => {
			const newScripts = processDocuments(docFiles).map((s) => ({
				...s,
				folderId: currentFolderId,
			}));
			await pgliteStore.saveScripts(newScripts);
			if (cancelled) return;
			await refresh(currentFolderId);
			resetUpload();
		})();

		return () => {
			cancelled = true;
		};
	}, [docFiles, currentFolderId, refresh, resetUpload]);

	return {
		isUploading,
		uploadErrors,
		handleFileChange,
		resetUpload,
	};
}
