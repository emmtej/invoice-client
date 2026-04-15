import { useCallback, useMemo } from "react";
import { useInvoicePresetsStore } from "../store/invoicePresetsStore";
import { type InvoiceSubitemPreset, presetSummary } from "./subitemPresets";

export function useSubitemPresets() {
	const { ratePresets, addRatePreset, deleteRatePreset } =
		useInvoicePresetsStore();

	const addPreset = useCallback(
		(data: Omit<InvoiceSubitemPreset, "id">) => {
			addRatePreset(data);
		},
		[addRatePreset],
	);

	const deletePreset = useCallback(
		(id: string) => {
			deleteRatePreset(id);
		},
		[deleteRatePreset],
	);

	return {
		presets: ratePresets,
		presetOptions: useMemo(
			() =>
				ratePresets.map((p) => ({
					value: p.id,
					label: presetSummary(p),
				})),
			[ratePresets],
		),
		addPreset,
		deletePreset,
		refreshPresets: () => {}, // No-op now as it's reactive
		getPresetById: useCallback(
			(id: string) => ratePresets.find((p) => p.id === id),
			[ratePresets],
		),
	};
}
