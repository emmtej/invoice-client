import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { folderQueries } from "@/features/storage/folderQueries";
import { initDb } from "@/features/storage/pgliteClient";
import type { Folder } from "@/features/storage/types";
import { scriptsQueries } from "../store/scriptsQueries";

export const scriptKeys = {
	all: ["scripts"] as const,
	lists: () => [...scriptKeys.all, "list"] as const,
	list: (folderId: string | null) =>
		[...scriptKeys.lists(), { folderId }] as const,
	infinite: (folderId: string | null) =>
		[...scriptKeys.list(folderId), "infinite"] as const,
	recent: () => [...scriptKeys.all, "recent"] as const,
	recentInfinite: () => [...scriptKeys.recent(), "infinite"] as const,
	details: () => [...scriptKeys.all, "detail"] as const,
	detail: (id: string) => [...scriptKeys.details(), id] as const,
	folders: {
		all: ["folders"] as const,
		lists: () => [...scriptKeys.folders.all, "list"] as const,
		list: (parentId: string | null) =>
			[...scriptKeys.folders.lists(), { parentId }] as const,
		breadcrumb: (folderId: string) =>
			[...scriptKeys.folders.all, "breadcrumb", folderId] as const,
		counts: (folderIds: string[]) =>
			[...scriptKeys.folders.all, "counts", { folderIds }] as const,
	},
};

const INITIAL_SCRIPT_LIMIT = 5;
const LOAD_MORE_BATCH = 10;

export function useScripts(folderId: string | null) {
	return useQuery({
		queryKey: scriptKeys.list(folderId),
		queryFn: async () => {
			await initDb();
			return scriptsQueries.getScriptsInFolderPaginated(
				folderId,
				INITIAL_SCRIPT_LIMIT,
				0,
			);
		},
	});
}

export function useScriptsInfinite(folderId: string | null) {
	return useInfiniteQuery({
		queryKey: scriptKeys.infinite(folderId),
		queryFn: async ({ pageParam = 0 }) => {
			await initDb();
			const scripts = await scriptsQueries.getScriptsInFolderPaginated(
				folderId,
				pageParam === 0 ? INITIAL_SCRIPT_LIMIT : LOAD_MORE_BATCH,
				pageParam,
			);
			const totalCount = await scriptsQueries.countScriptsInFolder(folderId);
			return {
				scripts,
				nextOffset: pageParam + scripts.length,
				totalCount,
			};
		},
		getNextPageParam: (lastPage) => {
			if (lastPage.nextOffset < lastPage.totalCount) {
				return lastPage.nextOffset;
			}
			return undefined;
		},
		initialPageParam: 0,
	});
}

export function useRecentScriptsInfinite() {
	return useInfiniteQuery({
		queryKey: scriptKeys.recentInfinite(),
		queryFn: async ({ pageParam = 0 }) => {
			await initDb();
			const scripts = await scriptsQueries.getRecentScripts(
				pageParam === 0 ? INITIAL_SCRIPT_LIMIT : LOAD_MORE_BATCH,
				pageParam,
			);
			const totalCount = await scriptsQueries.countAllScripts();
			return {
				scripts,
				nextOffset: pageParam + scripts.length,
				totalCount,
			};
		},
		getNextPageParam: (lastPage) => {
			if (lastPage.nextOffset < lastPage.totalCount) {
				return lastPage.nextOffset;
			}
			return undefined;
		},
		initialPageParam: 0,
	});
}

export function useAllScripts() {
	return useQuery({
		queryKey: [...scriptKeys.all, "all"] as const,
		queryFn: async () => {
			await initDb();
			return scriptsQueries.getAllScripts();
		},
	});
}

export function useAllFolders() {
	return useQuery({
		queryKey: scriptKeys.folders.all,
		queryFn: async () => {
			await initDb();
			return folderQueries.getAllFolders();
		},
	});
}

export function useFolders(parentId: string | null) {
	return useQuery({
		queryKey: scriptKeys.folders.list(parentId),
		queryFn: async () => {
			await initDb();
			return folderQueries.getRecentFolders(parentId, 100); // Using 100 as a reasonable limit for "all" folders at level
		},
	});
}

export function useFolderBreadcrumb(folderId: string | null) {
	return useQuery({
		queryKey: scriptKeys.folders.breadcrumb(folderId || "root"),
		queryFn: async () => {
			if (!folderId) return [];
			await initDb();
			return folderQueries.getFolderBreadcrumb(folderId);
		},
		enabled: !!folderId,
	});
}

export function useFolderChildItemCounts(folders: Folder[]) {
	const folderIds = folders.map((f) => f.id);
	return useQuery({
		queryKey: scriptKeys.folders.counts(folderIds),
		queryFn: async () => {
			if (folderIds.length === 0) return {};
			await initDb();
			return folderQueries.getChildItemCountsForFolders(folderIds);
		},
		enabled: folderIds.length > 0,
	});
}
