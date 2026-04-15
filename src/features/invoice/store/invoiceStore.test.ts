import { describe, expect, it } from "vitest";
import { useInvoiceStore } from "./invoiceStore";

describe("invoiceStore calculation", () => {
	it("should calculate amount based on custom ratePerWords unit", () => {
		const { addSubitemsAsNewItem, resetInvoice } = useInvoiceStore.getState();
		resetInvoice();

		const scripts = [
			{ id: "1", name: "Script 1", overview: { wordCount: 2000 } },
		];

		// 2000 words @ $50 per 1000 words = $100
		addSubitemsAsNewItem(["1"], "Item 1", scripts, "Translation", 50, 1000);

		const item = useInvoiceStore.getState().invoice.items[0];
		expect(item.subitems[0].amount).toBe(100);
		expect(item.subitems[0].scriptIds).toEqual(["1"]);
		expect(item.subitems[0].ratePerWords).toBe(1000);
	});

	it("should join multiple script names for display", () => {
		const { addSubitemsAsNewItem, resetInvoice } = useInvoiceStore.getState();
		resetInvoice();

		const scripts = [
			{ id: "1", name: "S1", overview: { wordCount: 100 } },
			{ id: "2", name: "S2", overview: { wordCount: 200 } },
		];

		addSubitemsAsNewItem(["1", "2"], "Item 1", scripts, "Recording", 0.1, 1);

		const item = useInvoiceStore.getState().invoice.items[0];
		expect(item.subitems[0].scriptName).toBe("S1, S2");
		expect(item.subitems[0].wordCount).toBe(300);
	});

	it("should truncate long script name lists", () => {
		const { addSubitemsAsNewItem, resetInvoice } = useInvoiceStore.getState();
		resetInvoice();

		const scripts = [
			{ id: "1", name: "S1", overview: { wordCount: 10 } },
			{ id: "2", name: "S2", overview: { wordCount: 10 } },
			{ id: "3", name: "S3", overview: { wordCount: 10 } },
			{ id: "4", name: "S4", overview: { wordCount: 10 } },
		];

		addSubitemsAsNewItem(
			["1", "2", "3", "4"],
			"Item 1",
			scripts,
			"Batch",
			1,
			1,
		);

		const item = useInvoiceStore.getState().invoice.items[0];
		expect(item.subitems[0].scriptName).toBe("S1, S2, S3, +1 more");
	});
});
