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
		const handleVisibilityChange = () => {
			if (document.visibilityState === "hidden") {
				const { sessionId, status: currentStatus } = useBoothStore.getState();
				if (
					sessionId &&
					(currentStatus === "running" || currentStatus === "paused")
				) {
					// Mark as potentially abandoned in localStorage
					localStorage.setItem("booth-abandoned-session", sessionId);
				}
			}
		};

		window.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("pagehide", handleVisibilityChange);

		// On mount, check if there was an abandoned session
		const abandonedId = localStorage.getItem("booth-abandoned-session");
		if (abandonedId) {
			void boothQueries.abandonSession(abandonedId).then(() => {
				localStorage.removeItem("booth-abandoned-session");
				void loadSessions();
			});
		}

		return () => {
			window.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("pagehide", handleVisibilityChange);
		};
	}, [loadSessions]);
}
