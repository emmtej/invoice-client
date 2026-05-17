import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BoothSettingsState {
	wordCountPricing: number;
	showCurrentEarnings: boolean;
	showRealizedHourly: boolean;
	trackingMode: "line" | "scene";
}

interface BoothSettingsActions {
	setWordCountPricing: (price: number) => void;
	setShowCurrentEarnings: (show: boolean) => void;
	setShowRealizedHourly: (show: boolean) => void;
	setTrackingMode: (mode: "line" | "scene") => void;
}

export type BoothSettingsStore = BoothSettingsState & BoothSettingsActions;

export const useBoothSettingsStore = create<BoothSettingsStore>()(
	persist(
		(set) => ({
			wordCountPricing: 0.25,
			showCurrentEarnings: true,
			showRealizedHourly: true,
			trackingMode: "line",

			setWordCountPricing: (wordCountPricing) => set({ wordCountPricing }),
			setShowCurrentEarnings: (showCurrentEarnings) =>
				set({ showCurrentEarnings }),
			setShowRealizedHourly: (showRealizedHourly) =>
				set({ showRealizedHourly }),
			setTrackingMode: (trackingMode) => set({ trackingMode }),
		}),
		{
			name: "booth-settings-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
