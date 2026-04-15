import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { generateId } from "@/utils/id";

export const DEFAULT_RATE_PER_WORD = 0.1;
export const DEFAULT_WORDS_PER_UNIT = 1;

export interface InvoiceSubitem {
	id: string;
	/** User-defined label for this subitem (e.g. "Episode 1 Dialogue"). When set, used for display instead of scriptName. */
	label?: string;
	scriptIds: string[];
	scriptName: string;
	wordCount: number;
	ratePerWord: number;
	ratePerWords: number;
	amount: number;
}

export interface InvoiceItem {
	id: string;
	name: string;
	subitems: InvoiceSubitem[];
}

export interface Invoice {
	id: string;
	defaultRatePerWord: number;
	items: InvoiceItem[];
}

export interface ScriptForInvoice {
	id: string;
	name: string;
	overview: { wordCount: number };
}

interface InvoiceStoreState {
	invoice: Invoice;
}

interface InvoiceStoreActions {
	addEmptyItem: (name: string) => void;
	addSubitemsToItem: (
		scriptIds: string[],
		itemId: string,
		scripts: ScriptForInvoice[],
		subitemLabel: string,
		ratePerWord?: number,
		ratePerWords?: number,
	) => void;
	addSubitemsAsNewItem: (
		scriptIds: string[],
		itemName: string,
		scripts: ScriptForInvoice[],
		subitemLabel: string,
		ratePerWord?: number,
		ratePerWords?: number,
	) => void;
	updateItemName: (itemId: string, name: string) => void;
	updateSubitemRate: (itemId: string, subitemId: string, rate: number) => void;
	updateSubitemUnit: (itemId: string, subitemId: string, unit: number) => void;
	updateSubitemLabel: (
		itemId: string,
		subitemId: string,
		label: string,
	) => void;
	removeSubitem: (itemId: string, subitemId: string) => void;
	removeItem: (itemId: string) => void;
	resetInvoice: () => void;
}

type InvoiceStore = InvoiceStoreState & InvoiceStoreActions;

function calculateSubitemAmount(
	wordCount: number,
	ratePerWord: number,
	ratePerWords: number = DEFAULT_WORDS_PER_UNIT,
): number {
	const unit = Math.max(1, ratePerWords || DEFAULT_WORDS_PER_UNIT);
	return (wordCount / unit) * ratePerWord;
}

function createOneSubitem(
	scriptIds: string[],
	scripts: ScriptForInvoice[],
	subitemLabel: string,
	ratePerWord: number,
	ratePerWords: number = DEFAULT_WORDS_PER_UNIT,
): InvoiceSubitem | null {
	const scriptMap = new Map(scripts.map((s) => [s.id, s]));
	const matched = scriptIds.filter((id) => scriptMap.has(id));
	if (matched.length === 0) return null;
	const totalWordCount = matched.reduce(
		(sum, id) => sum + (scriptMap.get(id)?.overview.wordCount ?? 0),
		0,
	);
	const amount = calculateSubitemAmount(
		totalWordCount,
		ratePerWord,
		ratePerWords,
	);

	const allNames = matched.map(
		(id) => scriptMap.get(id)?.name || "Unknown Script",
	);
	let scriptNames = "";
	if (allNames.length >= 4) {
		const firstThree = allNames.slice(0, 3).join(", ");
		const remainingCount = allNames.length - 3;
		scriptNames = `${firstThree}, +${remainingCount} more`;
	} else {
		scriptNames = allNames.join(", ");
	}

	return {
		id: generateId(),
		label: subitemLabel,
		scriptIds: matched,
		scriptName: scriptNames,
		wordCount: totalWordCount,
		ratePerWord,
		ratePerWords,
		amount,
	};
}

export const useInvoiceStore = create<InvoiceStore>()(
	persist(
		(set) => ({
			invoice: {
				id: generateId(),
				defaultRatePerWord: DEFAULT_RATE_PER_WORD,
				items: [],
			},

			addSubitemsToItem: (
				scriptIds,
				itemId,
				scripts,
				subitemLabel,
				ratePerWord,
				ratePerWords,
			) =>
				set((state) => {
					const rate = ratePerWord ?? state.invoice.defaultRatePerWord;
					const newSubitem = createOneSubitem(
						scriptIds,
						scripts,
						subitemLabel,
						rate,
						ratePerWords,
					);
					if (!newSubitem) return state;
					const itemExists = state.invoice.items.some(
						(item) => item.id === itemId,
					);
					if (!itemExists) return state;
					return {
						invoice: {
							...state.invoice,
							items: state.invoice.items.map((item) =>
								item.id === itemId
									? { ...item, subitems: [...item.subitems, newSubitem] }
									: item,
							),
						},
					};
				}),

			addSubitemsAsNewItem: (
				scriptIds,
				itemName,
				scripts,
				subitemLabel,
				ratePerWord,
				ratePerWords,
			) =>
				set((state) => {
					const rate = ratePerWord ?? state.invoice.defaultRatePerWord;
					const subitem = createOneSubitem(
						scriptIds,
						scripts,
						subitemLabel,
						rate,
						ratePerWords,
					);
					if (!subitem) return state;
					const newItem: InvoiceItem = {
						id: generateId(),
						name: itemName,
						subitems: [subitem],
					};
					return {
						invoice: {
							...state.invoice,
							items: [...state.invoice.items, newItem],
						},
					};
				}),

			updateItemName: (itemId, name) =>
				set((state) => ({
					invoice: {
						...state.invoice,
						items: state.invoice.items.map((item) =>
							item.id === itemId
								? { ...item, name: name.trim() === "" ? item.name : name }
								: item,
						),
					},
				})),

			updateSubitemRate: (itemId, subitemId, rate) =>
				set((state) => ({
					invoice: {
						...state.invoice,
						items: state.invoice.items.map((item) =>
							item.id === itemId
								? {
										...item,
										subitems: item.subitems.map((sub) => {
											if (sub.id !== subitemId) return sub;
											return {
												...sub,
												ratePerWord: rate,
												amount: calculateSubitemAmount(
													sub.wordCount,
													rate,
													sub.ratePerWords,
												),
											};
										}),
									}
								: item,
						),
					},
				})),

			updateSubitemUnit: (itemId, subitemId, unit) =>
				set((state) => ({
					invoice: {
						...state.invoice,
						items: state.invoice.items.map((item) =>
							item.id === itemId
								? {
										...item,
										subitems: item.subitems.map((sub) => {
											if (sub.id !== subitemId) return sub;
											return {
												...sub,
												ratePerWords: unit,
												amount: calculateSubitemAmount(
													sub.wordCount,
													sub.ratePerWord,
													unit,
												),
											};
										}),
									}
								: item,
						),
					},
				})),

			updateSubitemLabel: (itemId, subitemId, label) =>
				set((state) => ({
					invoice: {
						...state.invoice,
						items: state.invoice.items.map((item) =>
							item.id === itemId
								? {
										...item,
										subitems: item.subitems.map((sub) =>
											sub.id === subitemId ? { ...sub, label } : sub,
										),
									}
								: item,
						),
					},
				})),

			removeSubitem: (itemId, subitemId) =>
				set((state) => {
					const items = state.invoice.items.map((item) => {
						if (item.id !== itemId) return item;
						const subitems = item.subitems.filter(
							(sub) => sub.id !== subitemId,
						);
						return { ...item, subitems };
					});
					return {
						invoice: { ...state.invoice, items },
					};
				}),

			removeItem: (itemId) =>
				set((state) => ({
					invoice: {
						...state.invoice,
						items: state.invoice.items.filter((item) => item.id !== itemId),
					},
				})),

			resetInvoice: () =>
				set((state) => ({
					invoice: {
						...state.invoice,
						items: [],
					},
				})),

			addEmptyItem: (name) =>
				set((state) => {
					const newItem: InvoiceItem = {
						id: generateId(),
						name: name.trim() || "New item",
						subitems: [],
					};
					return {
						invoice: {
							...state.invoice,
							items: [...state.invoice.items, newItem],
						},
					};
				}),
		}),
		{
			name: "invoice-store",
			storage: createJSONStorage(() => {
				if (window?.localStorage) return window.localStorage;
				return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
			}),
		},
	),
);
