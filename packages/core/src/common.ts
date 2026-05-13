/**
 * Utility function to calculate an automatic gap size between items based on the length of the surface and the number of items.
 * @param surfaceLength - length of the surface the items are being placed on (e.g. width of a bar chart)
 * @param numItems - number of items being placed on the surface (e.g. number of bars in a bar chart)
 * @returns calculated gap size between items, which is 1/4 of the average space allocated for each item on the surface
 */
export const autoGap = (surfaceLength: number, numItems: number) => {
	return surfaceLength / numItems / 4;
};

/**
 * Utility function to calculate the percentage of a number relative to another number.
 * @param num - decimal number
 * @param ofnum - number to calculate the percentage of
 * @returns percentage value
 */
export const asPercent = (num: number, ofnum: number) => {
	return (num * 100) / ofnum;
};

/**
 * Utility function to round a number to the nearest target, with optional direction to round up or down.
 * @param n - number to be rounded
 * @param t - target to round to
 * @param upDown - direction to round ("up" or "down")
 * @returns rounded number
 */
export const roundTo = (n: number, t = 10, upDown?: "up" | "down") => {
	if (upDown === "up") return Math.ceil(n / t) * t;
	if (upDown === "down") return Math.floor(n / t) * t;
	return Math.round(n / t) * t;
};

/**
 * Utility function to round a number to the nearest 10th, **up or down**
 * @param n - number to round to nearest 10
 * @returns number rounded to nearest 10
 */
export const roundToTen = (n: number) => roundTo(n);

/**
 * Utility function to round a number **up** to the nearest 10th
 * @param n - number to round up
 * @returns number rounded up to nearest 10th
 */
export const roundUpToTen = (n: number) => roundTo(n, 10, "up");

/**
 * Utility function to round a number **up** to the nearest 100th
 * @param n - number to round up
 * @returns number rounded up to nearest 100th
 */
export const roundUpTo100 = (n: number) => roundTo(n, 100, "up");

/**
 * Simple distance formula implementation
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns resulting distance between two given points
 */
export const distTwoPoint = (
	x1: number,
	y1: number,
	x2: number,
	y2: number,
): number => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

/**
 * Simple midpoint formula implementation
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns midpoint coordinates between two given points
 */
export const midpoint = (
	x1: number,
	y1: number,
	x2: number,
	y2: number,
): [number, number] => [(x1 + x2) / 2, (y1 + y2) / 2];

/**
 * A utility function to get a single item from an array or just return the item if it's not an array. If it's an array, it wraps around using the index and modulo.
 *
 * This is useful for options that are meant to wrap around, but for users can also just be a single value, allowing for easy supporting of alternating values & single values.
 *
 * Example:
 * ```ts
 * getOnlyItemOrWrap("red", 0) // "red"
 * getOnlyItemOrWrap(["red", "blue"], 0) // "red"
 * getOnlyItemOrWrap(["red", "blue"], 1) // "blue"
 * getOnlyItemOrWrap(["red", "blue"], 2) // "red"
 * ```
 *
 * ---
 *
 * @param v - Arraylike or single item value
 * @param i - Index being grabbed from the value (if arraylike)
 * @returns - A single item, either from the array wrapping around or if it's just one thing then that's given back
 */
export const getOnlyItemOrWrap = <T>(v: T | T[], i: number): T => {
	if (Array.isArray(v)) return v[i % v.length];
	return v;
};

/**
 * This utility function is currently used by both pie & donut charts. It sums the previous angle radians for a given index, used in the calculations for slice centroids.
 */
export const sumPrevAngleRads = (
	i: number,
	asCoords: [number, number, number][],
	asPercentages: number[],
	totalLength: number,
	radius: number,
): number =>
	asCoords
		.slice(0, i)
		.map((_, idx) => (totalLength * asPercentages[idx]) / radius)
		.reduce((curr, prev) => prev + curr, 0);
