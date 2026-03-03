/**
 * Preset for subitem label + rate (e.g. "Translation" at 6 per 1000 words).
 * Stored in localStorage for now; can be replaced with API fetch later.
 */
export interface InvoiceSubitemPreset {
	id: string;
	subitemLabel: string;
	rateAmount: number;
	ratePerWords: number;
}

const STORAGE_KEY = "invoice-subitem-presets";

function loadFromStorage(): InvoiceSubitemPreset[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as unknown;
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(
			(p): p is InvoiceSubitemPreset =>
				typeof p === "object" &&
				p !== null &&
				typeof (p as InvoiceSubitemPreset).id === "string" &&
				typeof (p as InvoiceSubitemPreset).subitemLabel === "string" &&
				typeof (p as InvoiceSubitemPreset).rateAmount === "number" &&
				typeof (p as InvoiceSubitemPreset).ratePerWords === "number"
		);
	} catch {
		return [];
	}
}

function saveToStorage(presets: InvoiceSubitemPreset[]): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

/** Get all presets. Use API later: return fetchPresetsFromApi() ?? loadFromStorage(). */
export function getPresets(): InvoiceSubitemPreset[] {
	return loadFromStorage();
}

/** Save a new preset. Use API later: await savePresetToApi(preset) then invalidate local cache. */
export function savePreset(preset: Omit<InvoiceSubitemPreset, "id">): InvoiceSubitemPreset {
	const presets = loadFromStorage();
	const withId: InvoiceSubitemPreset = {
		...preset,
		id: crypto.randomUUID(),
	};
	presets.push(withId);
	saveToStorage(presets);
	return withId;
}

/** Remove a preset by id. Use API later when presets come from API. */
export function removePreset(id: string): void {
	const presets = loadFromStorage().filter((p) => p.id !== id);
	saveToStorage(presets);
}

/** User-readable summary for dropdown (e.g. "Translation — 6 per 1000 words"). */
export function presetSummary(preset: InvoiceSubitemPreset): string {
	return `${preset.subitemLabel} — ${preset.rateAmount} per ${preset.ratePerWords} words`;
}
