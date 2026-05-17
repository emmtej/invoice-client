import { create } from "zustand";

interface PgliteState {
	status: "initializing" | "ready" | "error";
	setStatus: (status: "initializing" | "ready" | "error") => void;
}

export const usePgliteStore = create<PgliteState>((set) => ({
	status: "initializing",
	setStatus: (status) => set({ status }),
}));
