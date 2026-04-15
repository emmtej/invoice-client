import { useCallback, useEffect, useRef } from "react";
import { useBoothStore } from "../store/useBoothStore";

const TICK_INTERVAL_MS = 100;

export function useTimer() {
	const status = useBoothStore((s) => s.status);
	const elapsedMs = useBoothStore((s) => s.elapsedMs);
	const setElapsed = useBoothStore((s) => s.tick);

	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const accumulatedRef = useRef(0);
	const lastTickRef = useRef(0);

	const clearTimer = useCallback(() => {
		if (intervalRef.current !== null) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	useEffect(() => {
		if (status === "running") {
			lastTickRef.current = Date.now();
			intervalRef.current = setInterval(() => {
				const now = Date.now();
				const delta = now - lastTickRef.current;
				lastTickRef.current = now;
				accumulatedRef.current += delta;
				setElapsed(accumulatedRef.current);
			}, TICK_INTERVAL_MS);
		} else if (status === "paused") {
			clearTimer();
			accumulatedRef.current = elapsedMs;
		} else if (status === "idle" || status === "selecting") {
			clearTimer();
			accumulatedRef.current = 0;
		} else if (status === "completed") {
			clearTimer();
			accumulatedRef.current = elapsedMs;
		}

		return clearTimer;
	}, [status, elapsedMs, setElapsed, clearTimer]);

	const reset = useCallback(() => {
		clearTimer();
		accumulatedRef.current = 0;
	}, [clearTimer]);

	return { reset };
}

export function formatTime(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	if (hours > 0) {
		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	}
	return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
