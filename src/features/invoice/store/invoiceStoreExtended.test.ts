import { beforeEach, describe, expect, it } from "vitest";
import { useInvoiceStore } from "./invoiceStore";

describe("invoiceStore actions", () => {
	beforeEach(() => {
		useInvoiceStore.getState().resetInvoice();
	});

	it("should add an empty item", () => {
		const { addEmptyItem } = useInvoiceStore.getState();
		addEmptyItem("Category A");

		const state = useInvoiceStore.getState();
		expect(state.invoice.items).toHaveLength(1);
		expect(state.invoice.items[0].name).toBe("Category A");
	});

	it("should remove an item", () => {
		const { addEmptyItem, removeItem } = useInvoiceStore.getState();
		addEmptyItem("To Remove");
		const id = useInvoiceStore.getState().invoice.items[0].id;

		removeItem(id);
		expect(useInvoiceStore.getState().invoice.items).toHaveLength(0);
	});

	it("should add subitems to an existing item", () => {
		const { addEmptyItem, addSubitemsToItem } = useInvoiceStore.getState();
		addEmptyItem("Category B");
		const itemId = useInvoiceStore.getState().invoice.items[0].id;

		const scripts = [
			{ id: "s1", name: "Script 1", overview: { wordCount: 500 } },
		];

		addSubitemsToItem(["s1"], itemId, scripts, "Sublabel", 0.5);

		const item = useInvoiceStore.getState().invoice.items[0];
		expect(item.subitems).toHaveLength(1);
		expect(item.subitems[0].label).toBe("Sublabel");
		expect(item.subitems[0].amount).toBe(250);
	});

	it("should update subitem rate and recalculate amount", () => {
		const { addSubitemsAsNewItem, updateSubitemRate } =
			useInvoiceStore.getState();
		const scripts = [
			{ id: "s1", name: "Script 1", overview: { wordCount: 100 } },
		];

		addSubitemsAsNewItem(["s1"], "Item", scripts, "Task", 1.0);
		const item = useInvoiceStore.getState().invoice.items[0];
		const subId = item.subitems[0].id;

		updateSubitemRate(item.id, subId, 2.5);

		const updatedItem = useInvoiceStore.getState().invoice.items[0];
		expect(updatedItem.subitems[0].ratePerWord).toBe(2.5);
		expect(updatedItem.subitems[0].amount).toBe(250);
	});

	it("should remove a subitem", () => {
		const { addSubitemsAsNewItem, removeSubitem } = useInvoiceStore.getState();
		const scripts = [{ id: "s1", name: "S1", overview: { wordCount: 10 } }];

		addSubitemsAsNewItem(["s1"], "Item", scripts, "Task");
		const item = useInvoiceStore.getState().invoice.items[0];
		const subId = item.subitems[0].id;

		removeSubitem(item.id, subId);
		expect(useInvoiceStore.getState().invoice.items[0].subitems).toHaveLength(
			0,
		);
	});
});
