import { useEffect } from "react";
import { useBoothStore } from "../store/useBoothStore";

export function useBoothKeyboard() {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement;
			const isInputFocused =
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.isContentEditable;

			if (isInputFocused) return;

			const state = useBoothStore.getState();
			if (state.status !== "running") return;

			if (e.key === " " || e.key === "Enter") {
				e.preventDefault();
				state.completeLine(state.currentLineIndex);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);
}
