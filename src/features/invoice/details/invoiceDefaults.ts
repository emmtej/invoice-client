import { z } from "zod";
import { loadFromStorage, saveToStorage } from "@/utils/storage";
import { getTodayDateString } from "../profile";

export type InvoiceDefaults = {
	invoiceTitle: string;
	invoiceDate: string;
};

const STORAGE_KEY = "invoice-defaults";

const invoiceDefaultsSchema = z.object({
	invoiceTitle: z.string().trim().min(1).default("Invoice"),
	invoiceDate: z.string().trim().min(1).default(""),
});

function getFallbackDefaults(): InvoiceDefaults {
	return {
		invoiceTitle: "Invoice",
		invoiceDate: getTodayDateString(),
	};
}

export function loadInvoiceDefaults(): InvoiceDefaults {
	const result = loadFromStorage(
		STORAGE_KEY,
		getFallbackDefaults(),
		invoiceDefaultsSchema,
	);
	if (!result.invoiceDate) {
		result.invoiceDate = getTodayDateString();
	}
	return result;
}

export function saveInvoiceDefaults(defaults: InvoiceDefaults): void {
	saveToStorage(STORAGE_KEY, defaults);
}
