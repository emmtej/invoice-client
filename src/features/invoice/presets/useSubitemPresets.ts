import { useCallback, useEffect, useMemo, useState } from "react";
import {
	getPresets,
	type InvoiceSubitemPreset,
	presetSummary,
	removePreset,
	savePreset,
} from "./subitemPresets";

export function useSubitemPresets() {
	const [presets, setPresets] = useState<InvoiceSubitemPreset[]>(() =>
		getPresets(),
	);

	useEffect(() => {
		setPresets(getPresets());
	}, []);

	const addPreset = useCallback((data: Omit<InvoiceSubitemPreset, "id">) => {
		const created = savePreset(data);
		setPresets(getPresets());
		return created;
	}, []);

	const deletePreset = useCallback((id: string) => {
		removePreset(id);
		setPresets(getPresets());
	}, []);

	const refreshPresets = useCallback(() => {
		setPresets(getPresets());
	}, []);

	return {
		presets,
		presetOptions: useMemo(
			() =>
				presets.map((p) => ({
					value: p.id,
					label: presetSummary(p),
				})),
			[presets],
		),
		addPreset,
		deletePreset,
		refreshPresets,
		getPresetById: useCallback(
			(id: string) => presets.find((p) => p.id === id),
			[presets],
		),
	};
}
