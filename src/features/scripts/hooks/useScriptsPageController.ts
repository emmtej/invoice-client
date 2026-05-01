import { useScriptsUiStore } from "../store/useScriptsUiStore";
import {
	useFolderBreadcrumb,
	useFolderChildItemCounts,
	useFolders,
	useScriptsInfinite,
} from "./useScriptsQuery";

export function useScriptsPageController() {
	const currentFolderId = useScriptsUiStore((s) => s.currentFolderId);
	const setCurrentFolder = useScriptsUiStore((s) => s.setCurrentFolder);

	const { data: folderData, isLoading: isLoadingFolders } =
		useFolders(currentFolderId);
	const {
		data: scriptData,
		isLoading: isLoadingScripts,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	} = useScriptsInfinite(currentFolderId);
	const { data: breadcrumb = [] } = useFolderBreadcrumb(currentFolderId);

	const folders = folderData ?? [];
	const scripts = scriptData?.pages.flatMap((page) => page.scripts) ?? [];

	const { data: folderChildItemCounts = {} } =
		useFolderChildItemCounts(folders);

	const allCurrentIds = [
		...folders.map((f) => f.id),
		...scripts.map((s) => s.id),
	];

	const handleNavigate = (folderId: string | null) => {
		setCurrentFolder(folderId);
	};

	const handleLoadMore = () => {
		fetchNextPage();
	};

	const isRoot = currentFolderId === null;

	const isEmpty =
		!isLoadingFolders &&
		!isLoadingScripts &&
		folders.length === 0 &&
		scripts.length === 0;

	const currentFolderName =
		breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1].name : undefined;

	return {
		folders,
		scripts,
		breadcrumb,
		folderChildItemCounts,
		allCurrentIds,
		isLoading: isLoadingFolders || isLoadingScripts,
		isLoadingMore: isFetchingNextPage,
		hasMoreScripts: hasNextPage,
		isRoot,
		isEmpty,
		currentFolderName,
		handleNavigate,
		handleLoadMore,
	};
}
