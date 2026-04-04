import { create } from "zustand";
import { generateId } from "@/utils/id";

export interface InvoiceSubitem {
	id: string;
	/** User-defined label for this subitem (e.g. "Episode 1 Dialogue"). When set, used for display instead of scriptName. */
	label?: string;
	scriptId: string;
	scriptName: string;
	wordCount: number;
	ratePerWord: number;
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
	) => void;
	addSubitemsAsNewItem: (
		scriptIds: string[],
		itemName: string,
		scripts: ScriptForInvoice[],
		subitemLabel: string,
		ratePerWord?: number,
	) => void;
	updateItemName: (itemId: string, name: string) => void;
	updateSubitemRate: (itemId: string, subitemId: string, rate: number) => void;
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

function createOneSubitem(
	scriptIds: string[],
	scripts: ScriptForInvoice[],
	subitemLabel: string,
	ratePerWord: number,
): InvoiceSubitem | null {
	const scriptMap = new Map(scripts.map((s) => [s.id, s]));
	const matched = scriptIds.filter((id) => scriptMap.has(id));
	if (matched.length === 0) return null;
	const totalWordCount = matched.reduce(
		(sum, id) => sum + (scriptMap.get(id)?.overview.wordCount ?? 0),
		0,
	);
	const amount = totalWordCount * ratePerWord;
	const firstScriptId = matched[0];
	const scriptNames = matched.map((id) => scriptMap.get(id)?.name).join(", ");
	return {
		id: generateId(),
		label: subitemLabel,
		scriptId: firstScriptId,
		scriptName: scriptNames,
		wordCount: totalWordCount,
		ratePerWord,
		amount,
	};
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
	invoice: {
		id: generateId(),
		defaultRatePerWord: 0.1,
		items: [],
	},

	addSubitemsToItem: (scriptIds, itemId, scripts, subitemLabel, ratePerWord) =>
		set((state) => {
			const rate = ratePerWord ?? state.invoice.defaultRatePerWord;
			const newSubitem = createOneSubitem(
				scriptIds,
				scripts,
				subitemLabel,
				rate,
			);
			if (!newSubitem) return state;
			const itemExists = state.invoice.items.some((item) => item.id === itemId);
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
	) =>
		set((state) => {
			const rate = ratePerWord ?? state.invoice.defaultRatePerWord;
			const subitem = createOneSubitem(scriptIds, scripts, subitemLabel, rate);
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
								subitems: item.subitems.map((sub) =>
									sub.id === subitemId
										? {
												...sub,
												ratePerWord: rate,
												amount: sub.wordCount * rate,
											}
										: sub,
								),
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
				const subitems = item.subitems.filter((sub) => sub.id !== subitemId);
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
}));
