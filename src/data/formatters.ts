export function formatYearsSince(since: number, currentYear = new Date().getFullYear()): string {
	const years = Math.max(currentYear - since, 0);
	return `${years} yrs`;
}
