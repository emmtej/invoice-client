import { useMemo, useState } from "react";
import { useScriptsDataStore } from "../store/useScriptsDataStore";
import { useScriptsUiStore } from "../store/useScriptsUiStore";

export function useScriptsPageController() {
	const currentFolderId = useScriptsUiStore((s) => s.currentFolderId);
	const setCurrentFolder = useScriptsUiStore((s) => s.setCurrentFolder);
	const fetchFolderData = useScriptsDataStore((s) => s.fetchFolderData);
	const loadMoreScripts = useScriptsDataStore((s) => s.loadMoreScripts);

	const folders = useScriptsDataStore((s) => s.folders);
	const scripts = useScriptsDataStore((s) => s.scripts);
	const breadcrumb = useScriptsDataStore((s) => s.breadcrumb);

	const [isLoadingMore, setIsLoadingMore] = useState(false);

	const allCurrentIds = useMemo(
		() => [...folders.map((f) => f.id), ...scripts.map((s) => s.id)],
		[folders, scripts],
	);

	const handleNavigate = async (folderId: string | null) => {
		setCurrentFolder(folderId);
		await fetchFolderData(folderId);
	};

	const handleLoadMore = async () => {
		setIsLoadingMore(true);
		try {
			await loadMoreScripts(currentFolderId);
		} finally {
			setIsLoadingMore(false);
		}
	};

	const isRoot = useMemo(() => currentFolderId === null, [currentFolderId]);

	const isEmpty = useMemo(
		() => folders.length === 0 && scripts.length === 0,
		[folders.length, scripts.length],
	);

	const currentFolderName = useMemo(
		() =>
			breadcrumb.length > 0
				? breadcrumb[breadcrumb.length - 1].name
				: undefined,
		[breadcrumb],
	);

	return {
		allCurrentIds,
		isLoadingMore,
		isRoot,
		isEmpty,
		currentFolderName,
		handleNavigate,
		handleLoadMore,
	};
}
