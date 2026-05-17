import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Script } from "@/types/Script";
import { scriptRepository } from "../repository/scriptRepository";

export const scriptQueryKeys = {
	all: ["scripts"] as const,
	lists: () => [...scriptQueryKeys.all, "list"] as const,
	list: (folderId: string | null) =>
		[...scriptQueryKeys.lists(), folderId] as const,
	details: () => [...scriptQueryKeys.all, "detail"] as const,
	detail: (id: string) => [...scriptQueryKeys.details(), id] as const,
	drafts: () => [...scriptQueryKeys.all, "drafts"] as const,
};

export function useAllScripts() {
	return useQuery({
		queryKey: scriptQueryKeys.lists(),
		queryFn: () => scriptRepository.getAllScripts(),
	});
}

export function useScriptsInFolder(folderId: string | null) {
	return useQuery({
		queryKey: scriptQueryKeys.list(folderId),
		queryFn: () => scriptRepository.getScriptsInFolder(folderId),
	});
}

export function useScript(id: string | undefined) {
	return useQuery({
		queryKey: id ? scriptQueryKeys.detail(id) : scriptQueryKeys.all,
		queryFn: () => (id ? scriptRepository.getScriptById(id) : null),
		enabled: !!id,
	});
}

export function useDraftScripts() {
	return useQuery({
		queryKey: scriptQueryKeys.drafts(),
		queryFn: () => scriptRepository.getAllDrafts(),
	});
}

export function useSaveScript() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (script: Script) => scriptRepository.saveScript(script),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: scriptQueryKeys.all });
		},
	});
}

export function useDeleteScripts() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: string[]) => scriptRepository.deleteScripts(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: scriptQueryKeys.all });
		},
	});
}

export function useSaveDraft() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (script: Script) => scriptRepository.saveDraft(script),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: scriptQueryKeys.drafts() });
		},
	});
}

export function usePromoteDrafts() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			ids,
			folderId,
		}: {
			ids: string[];
			folderId: string | null;
		}) => scriptRepository.promoteDrafts(ids, folderId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: scriptQueryKeys.all });
		},
	});
}
