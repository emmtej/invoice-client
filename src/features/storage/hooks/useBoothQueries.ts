import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LineTimingEntry } from "@/features/storage/types";
import {
	type BoothSession,
	boothRepository,
} from "../repository/boothRepository";

export const boothQueryKeys = {
	all: ["booth-sessions"] as const,
	lists: () => [...boothQueryKeys.all, "list"] as const,
	details: () => [...boothQueryKeys.all, "detail"] as const,
	detail: (id: string) => [...boothQueryKeys.details(), id] as const,
};

export function useAllBoothSessions() {
	return useQuery({
		queryKey: boothQueryKeys.lists(),
		queryFn: () => boothRepository.getAllSessions(),
	});
}

export function useCreateBoothSession() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (
			session: Pick<
				BoothSession,
				"id" | "scriptId" | "scriptName" | "totalLines"
			>,
		) => boothRepository.createSession(session),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: boothQueryKeys.all });
		},
	});
}

export function useUpdateBoothSession() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			updates,
		}: {
			id: string;
			updates: {
				completedLines: number;
				elapsedMs: number;
				lineTimings: LineTimingEntry[];
			};
		}) => boothRepository.updateSession(id, updates),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: boothQueryKeys.all });
		},
	});
}

export function useCompleteBoothSession() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			final,
		}: {
			id: string;
			final: {
				completedLines: number;
				elapsedMs: number;
				lineTimings: LineTimingEntry[];
			};
		}) => boothRepository.completeSession(id, final),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: boothQueryKeys.all });
		},
	});
}

export function useAbandonBoothSession() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => boothRepository.abandonSession(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: boothQueryKeys.all });
		},
	});
}

export function useDeleteBoothSession() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => boothRepository.deleteSession(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: boothQueryKeys.all });
		},
	});
}
