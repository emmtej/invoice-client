/** Sort items by display name, then by id for stability when names collide. */
export function sortByName<T extends { name: string; id: string }>(
	items: T[],
	ascending: boolean,
): T[] {
	return [...items].sort((a, b) => {
		const cmp = a.name.localeCompare(b.name, undefined, {
			sensitivity: "base",
		});
		if (cmp !== 0) return ascending ? cmp : -cmp;
		return ascending
			? a.id.localeCompare(b.id)
			: b.id.localeCompare(a.id);
	});
}
