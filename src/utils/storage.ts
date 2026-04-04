import type { z } from "zod";

export function loadFromStorage<T>(
	key: string,
	fallback: T,
	schema: z.ZodType<T>,
): T {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		if (!raw) return fallback;
		const result = schema.safeParse(JSON.parse(raw));
		return result.success ? result.data : fallback;
	} catch {
		return fallback;
	}
}

export function saveToStorage<T>(key: string, value: T): void {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Ignore storage errors to avoid breaking the UI
	}
}
