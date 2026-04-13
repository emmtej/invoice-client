import { useEffect } from "react";
import { useScriptsUiStore } from "../store/useScriptsUiStore";

export function useScriptsEvents(allCurrentIds: string[]) {
	const selectAll = useScriptsUiStore((s) => s.selectAll);
	const clearSelection = useScriptsUiStore((s) => s.clearSelection);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "a") {
				const activeElement = document.activeElement;
				const isInput =
					activeElement instanceof HTMLInputElement ||
					activeElement instanceof HTMLTextAreaElement ||
					(activeElement as HTMLElement)?.isContentEditable;

				if (!isInput) {
					e.preventDefault();
					selectAll(allCurrentIds);
				}
			}
			if (e.key === "Escape") {
				clearSelection();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectAll, clearSelection, allCurrentIds]);
}
