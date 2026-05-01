import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreate } = vi.hoisted(() => ({
	mockCreate: vi.fn(),
}));

vi.mock("@electric-sql/pglite", () => ({
	PGlite: { create: mockCreate },
}));

vi.mock("./runMigrations", () => ({
	runMigrations: vi.fn().mockResolvedValue(undefined),
}));

import { getDb, getDrizzleDb, initDb, resetDb } from "./pgliteClient";

describe("pgliteClient", () => {
	beforeEach(() => {
		resetDb();
		vi.clearAllMocks();
	});

	it("initDb returns a PGlite instance", async () => {
		const fakeDb = { query: vi.fn(), exec: vi.fn().mockResolvedValue({}) };
		mockCreate.mockResolvedValue(fakeDb);

		const result = await initDb();

		expect(result).toBe(fakeDb);
		expect(mockCreate).toHaveBeenCalledWith({
			dataDir: "idb://invoice-editor-db",
		});
	});

	it("subsequent initDb calls return the same instance without re-creating", async () => {
		const fakeDb = { query: vi.fn(), exec: vi.fn().mockResolvedValue({}) };
		mockCreate.mockResolvedValue(fakeDb);

		const first = await initDb();
		const second = await initDb();

		expect(first).toBe(second);
		expect(mockCreate).toHaveBeenCalledTimes(1);
	});

	it("concurrent initDb calls share one PGlite.create", async () => {
		const fakeDb = { query: vi.fn(), exec: vi.fn().mockResolvedValue({}) };
		let resolveCreate = (_value: unknown) => {};
		const delayed = new Promise((resolve) => {
			resolveCreate = resolve;
		});
		mockCreate.mockReturnValue(delayed);

		const p1 = initDb();
		const p2 = initDb();
		resolveCreate(fakeDb);

		const [first, second] = await Promise.all([p1, p2]);

		expect(first).toBe(second);
		expect(mockCreate).toHaveBeenCalledTimes(1);
	});

	it("getDb throws before initDb is called", () => {
		expect(() => getDb()).toThrowError(
			"Database not initialized. Call initDb() first.",
		);
	});

	it("getDb returns the instance after initDb", async () => {
		const fakeDb = { query: vi.fn(), exec: vi.fn().mockResolvedValue({}) };
		mockCreate.mockResolvedValue(fakeDb);

		await initDb();

		expect(getDb()).toBe(fakeDb);
	});

	it("resetDb clears the singleton so initDb re-creates", async () => {
		const fakeDb1 = { query: vi.fn(), exec: vi.fn().mockResolvedValue({}) };
		const fakeDb2 = { query: vi.fn(), exec: vi.fn().mockResolvedValue({}) };
		mockCreate.mockResolvedValueOnce(fakeDb1).mockResolvedValueOnce(fakeDb2);

		const first = await initDb();
		resetDb();
		const second = await initDb();

		expect(first).not.toBe(second);
		expect(mockCreate).toHaveBeenCalledTimes(2);
	});

	it("getDrizzleDb returns a drizzle instance", async () => {
		const fakeDb = { query: vi.fn(), exec: vi.fn().mockResolvedValue({}) };
		mockCreate.mockResolvedValue(fakeDb);

		const result = await getDrizzleDb();

		expect(result).toBeDefined();
		expect(mockCreate).toHaveBeenCalledTimes(1);
	});
});
