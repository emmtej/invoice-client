import { z } from "zod";
import { generateId } from "@/utils/id";
import { loadFromStorage, saveToStorage } from "@/utils/storage";

export interface InvoiceSubitemPreset {
	id: string;
	subitemLabel: string;
	rateAmount: number;
	ratePerWords: number;
}

const STORAGE_KEY = "invoice-subitem-presets";

const presetSchema = z.array(
	z.object({
		id: z.string(),
		subitemLabel: z.string(),
		rateAmount: z.number(),
		ratePerWords: z.number(),
	}),
);

function loadPresets(): InvoiceSubitemPreset[] {
	return loadFromStorage(STORAGE_KEY, [], presetSchema);
}

export function getPresets(): InvoiceSubitemPreset[] {
	return loadPresets();
}

export function savePreset(
	preset: Omit<InvoiceSubitemPreset, "id">,
): InvoiceSubitemPreset {
	const presets = loadPresets();
	const withId: InvoiceSubitemPreset = {
		...preset,
		id: generateId(),
	};
	presets.push(withId);
	saveToStorage(STORAGE_KEY, presets);
	return withId;
}

export function removePreset(id: string): void {
	const presets = loadPresets().filter((p) => p.id !== id);
	saveToStorage(STORAGE_KEY, presets);
}

export function presetSummary(preset: InvoiceSubitemPreset): string {
	return `${preset.subitemLabel} — ${preset.rateAmount} per ${preset.ratePerWords} words`;
}
