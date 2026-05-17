import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { folderRepository } from "../repository/folderRepository";
import { scriptQueryKeys } from "./useScriptQueries";

export const folderQueryKeys = {
	all: ["folders"] as const,
	lists: () => [...folderQueryKeys.all, "list"] as const,
	details: () => [...folderQueryKeys.all, "detail"] as const,
	detail: (id: string) => [...folderQueryKeys.details(), id] as const,
};

export function useAllFolders() {
	return useQuery({
		queryKey: folderQueryKeys.lists(),
		queryFn: () => folderRepository.getAllFolders(),
	});
}

export function useCreateFolder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			name,
			parentId,
		}: {
			id: string;
			name: string;
			parentId: string | null;
		}) => folderRepository.createFolder(id, name, parentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: folderQueryKeys.all });
		},
	});
}

export function useDeleteFolder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => folderRepository.deleteFolder(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: folderQueryKeys.all });
			// Deleting a folder might affect scripts inside it (cascade)
			queryClient.invalidateQueries({ queryKey: scriptQueryKeys.all });
		},
	});
}
