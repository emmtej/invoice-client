import { getTodayDateString } from "../profile";

export type InvoiceDefaults = {
	invoiceTitle: string;
	invoiceDate: string;
};

const INVOICE_DEFAULTS_STORAGE_KEY = "invoice_defaults";

function getFallbackDefaults(): InvoiceDefaults {
	return {
		invoiceTitle: "Invoice",
		invoiceDate: getTodayDateString(),
	};
}

export function loadInvoiceDefaults(): InvoiceDefaults {
	if (typeof window === "undefined") {
		return getFallbackDefaults();
	}
	try {
		const raw = window.localStorage.getItem(INVOICE_DEFAULTS_STORAGE_KEY);
		if (!raw) return getFallbackDefaults();
		const parsed = JSON.parse(raw) as Partial<InvoiceDefaults> | null;
		if (!parsed || typeof parsed !== "object") return getFallbackDefaults();
		return {
			invoiceTitle:
				typeof parsed.invoiceTitle === "string" && parsed.invoiceTitle.trim()
					? parsed.invoiceTitle.trim()
					: "Invoice",
			invoiceDate:
				typeof parsed.invoiceDate === "string" && parsed.invoiceDate.trim()
					? parsed.invoiceDate.trim()
					: getTodayDateString(),
		};
	} catch {
		return getFallbackDefaults();
	}
}

export function saveInvoiceDefaults(defaults: InvoiceDefaults): void {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(
			INVOICE_DEFAULTS_STORAGE_KEY,
			JSON.stringify(defaults),
		);
	} catch {
		// Ignore storage errors
	}
}
