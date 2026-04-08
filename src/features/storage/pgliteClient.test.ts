import { beforeEach, describe, expect, it, vi } from "vitest";

const mockCreate = vi.fn();

vi.mock("@electric-sql/pglite", () => ({
	PGlite: { create: mockCreate },
}));

import { getDb, initDb, resetDb } from "./pgliteClient";

describe("pgliteClient", () => {
	beforeEach(() => {
		resetDb();
		vi.clearAllMocks();
	});

	it("initDb returns a PGlite instance", async () => {
		const fakeDb = { query: vi.fn() };
		mockCreate.mockResolvedValue(fakeDb);

		const result = await initDb();

		expect(result).toBe(fakeDb);
		expect(mockCreate).toHaveBeenCalledWith({
			dataDir: "idb://invoice-editor-db",
		});
	});

	it("subsequent initDb calls return the same instance without re-creating", async () => {
		const fakeDb = { query: vi.fn() };
		mockCreate.mockResolvedValue(fakeDb);

		const first = await initDb();
		const second = await initDb();

		expect(first).toBe(second);
		expect(mockCreate).toHaveBeenCalledTimes(1);
	});

	it("getDb throws before initDb is called", () => {
		expect(() => getDb()).toThrowError(
			"Database not initialized. Call initDb() first.",
		);
	});

	it("getDb returns the instance after initDb", async () => {
		const fakeDb = { query: vi.fn() };
		mockCreate.mockResolvedValue(fakeDb);

		await initDb();

		expect(getDb()).toBe(fakeDb);
	});

	it("resetDb clears the singleton so initDb re-creates", async () => {
		const fakeDb1 = { query: vi.fn() };
		const fakeDb2 = { query: vi.fn() };
		mockCreate.mockResolvedValueOnce(fakeDb1).mockResolvedValueOnce(fakeDb2);

		const first = await initDb();
		resetDb();
		const second = await initDb();

		expect(first).not.toBe(second);
		expect(mockCreate).toHaveBeenCalledTimes(2);
	});
});
