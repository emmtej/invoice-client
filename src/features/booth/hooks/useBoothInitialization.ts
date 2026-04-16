import { useEffect } from "react";
import { boothQueries } from "../store/boothQueries";
import { useBoothStore } from "../store/useBoothStore";
import { useBoothKeyboard } from "./useBoothKeyboard";
import { useTimer } from "./useTimer";

export function useBoothInitialization() {
	const loadSessions = useBoothStore((s) => s.loadSessions);

	// Initialize timer and keyboard shortcuts
	useTimer();
	useBoothKeyboard();

	// Load initial sessions
	useEffect(() => {
		loadSessions();
	}, [loadSessions]);

	// Handle browser close/refresh for active sessions
	useEffect(() => {
		const handleBeforeUnload = () => {
			const { sessionId, status: currentStatus } = useBoothStore.getState();
			if (
				sessionId &&
				(currentStatus === "running" || currentStatus === "paused")
			) {
				boothQueries.abandonSession(sessionId);
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, []);
}
