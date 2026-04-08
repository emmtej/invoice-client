import { describe, expect, it } from "vitest";
import { sortByName } from "./sortByName";

describe("sortByName", () => {
	it("sorts ascending by name", () => {
		const items = [
			{ id: "2", name: "Beta" },
			{ id: "1", name: "alpha" },
		];
		expect(sortByName(items, true).map((x) => x.name)).toEqual([
			"alpha",
			"Beta",
		]);
	});

	it("sorts descending by name", () => {
		const items = [
			{ id: "1", name: "alpha" },
			{ id: "2", name: "Beta" },
		];
		expect(sortByName(items, false).map((x) => x.name)).toEqual([
			"Beta",
			"alpha",
		]);
	});

	it("ties break on id", () => {
		const items = [
			{ id: "b", name: "Same" },
			{ id: "a", name: "Same" },
		];
		expect(sortByName(items, true).map((x) => x.id)).toEqual(["a", "b"]);
	});
});
