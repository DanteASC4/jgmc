import { randomIntegerBetween } from "@std/random";
import { roundToTen } from "../common.ts";

/**
 * Sums an array of numbers and returns the result. Does not mutate the original array.
 *
 * Example:
 * ```
 * const arr = [1, 2, 3];
 * const result = sumArray(arr);
 *
 * console.log(result); // 6
 * console.log(arr); // [1, 2, 3]
 * ```
 * @param arr Array of numbers to sum
 * @returns Sum of the numbers in the array
 */
export const sumArray = (arr: number[]) => arr.reduce((c, p) => c + p, 0);

/**
 *  @deprecated use `stackedToSummed` instead. This will be removed soon most likely
 */
export const sum2DArrayInPlace = (arr: number[][]) => {
	return arr.slice().map((a) => a.flat().reduce((c, p) => c + p, 0));
};

/**
 * Sums each sub array of a 2D array and returns an array of the summed values. Does not mutate the original array.
 *
 * Example:
 * ```
 * const arr = [
 *   [1, 2, 3],
 *   [4, 5, 6],
 * ]
 *
 * const result = stackedToSummed(arr);
 * console.log(result); // [6, 15]
 * console.log(arr); // [[1, 2, 3], [4, 5, 6]]
 * ```
 * @param arr 2D array of numbers to have each sub array summed
 * @returns Array of summed numbers
 */
export const stackedToSummed = (arr: number[][]) => {
	return arr.slice().map((a) => sumArray(a));
};

/**
 * Finds the maximum value in an array of numbers and rounds it to the nearest ten for auto maxing purposes. If the max is between 0 and 4, it will return 10 instead to avoid having a max of 0 which would break the chart.
 *
 * Example:
 * ```
 * const data = [12, 25, 7, 3];
 * const result = autoMaxNumerical(data);
 *
 * console.log(result); // 30
 * ```
 *
 * Example with max between 0 and 4:
 * ```
 * const data = [0, 1, 2, 3];
 * const result = autoMaxNumerical(data);
 *
 * console.log(result); // 10
 * ```
 * @param data Array of numbers to find the max of and round to the nearest ten for auto maxing purposes. If the max is between 0 and 4, it will return 10 instead to avoid having a max of 0 which would break the chart.
 * @returns Rounded maximum value
 */
export const autoMaxNumerical = (data: number[]) => {
	const max = Math.max(...data);
	if (max > 0 && max <= 4) return 10;
	return roundToTen(max);
};

/**
 * Finds the minimum value in an array of numbers and rounds it to the nearest ten.
 *
 * Example:
 * ```
 * const data = [12, 25, 7, 3];
 * const result = autoMinNumerical(data);
 *
 * console.log(result); // 0
 * ```
 * @param data Array of numbers to find the minimum from & round to 10
 * @returns Rounded minimum value
 */
export const autoMinNumerical = (data: number[]) => {
	return roundToTen(Math.min(...data));
};

/**
 * Finds the maximum value in a 2D array of numbers and rounds it to the nearest ten for auto maxing purposes. If the max is between 0 and 4, it will return 10 instead to avoid having a max of 0 which would break the chart.
 *
 * Example:
 * ```
 * const data = [
 *   [1, 2, 3],
 *   [4, 5, 6],
 * ]
 *
 * const result = autoMaxStacked(data);
 * console.log(result); // 20
 * ```
 *
 * Example with max between 0 and 4:
 * ```
 * const data = [
 *   [0, 1],
 *   [2, 3],
 * ]
 *
 * const result = autoMaxStacked(data);
 * console.log(result); // 10
 * ```
 * @param data 2D array of numbers to find the maximum from & round to 10
 * @returns Rounded maximum value
 */
export const autoMaxStacked = (data: number[][]) => {
	const summed = stackedToSummed(data.slice());
	return roundToTen(Math.max(...summed));
};

/**
 * @deprecated - no longer in use
 * Fills an array of strings with empty strings until it reaches the desired amount. **Mutates the original array.**
 *
 * Example:
 * ```
 * const arr = ["a", "b"];
 * fillStrings(arr, 3);
 *
 * console.log(arr); // ["a", "b", "", "", ""]
 * ```
 * @param arr Array of strings to fill
 * @param amt Number of empty strings to add
 */
export const fillStrings = (arr: string[], amt: number) => {
	let i = amt;
	while (i !== 0) {
		arr.push("");
		i--;
	}
};

/**
 * @deprecated - no longer in use
 * Fills an array of arrays with empty arrays until it reaches the desired amount. **Mutates the original array.**
 *
 * Example:
 * ```
 * const arr = [[1, 2], [3, 4]];
 * fillEmptyArray(arr, 2);
 *
 * console.log(arr); // [[1, 2], [3, 4], [], []]
 * ```
 * @param arr Array of arrays to fill
 * @param amt Number of empty arrays to add
 */
export const fillEmptyArray = (arr: number[][], amt: number) => {
	let i = amt;
	while (i !== 0) {
		arr.push([]);
		i--;
	}
};

/**
 * @deprecated - no longer in use
 * Formats a number in ms to a string in ms, us, or ns depending on the value. If the value is less than 1, it will be formatted in us. If the value is less than 0.001, it will be formatted in ns.
 *
 * Example:
 * ```
 * const arr1 = [1,2,3];
 * fillZeros(arr1, 2);
 *
 * console.log(arr1); // [1, 2, 3, 0, 0]
 * ```
 * @param arr Array of numbers to fill
 * @param amt Number of zeros to add
 */
export const fillZeros = (arr: number[], amt: number) => {
	let i = amt;
	while (i !== 0) {
		arr.push(0);
		i--;
	}
};

/**
 * Generates a random string of the specified length consisting of uppercase letters, lowercase letters, and numbers. Default length is 8.
 *
 * Example:
 * ```
 * const id = randId(10);
 * console.log(id); // "aB3dE5fG1h" (example output, will be different each time)
 * ```
 * @param len Desired length of the random ID string. Default is 8.
 * @returns Random string of the specified length consisting of uppercase letters, lowercase letters, and numbers.
 */
export const randId = (len = 8) => {
	const alphabet =
		"abdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let id = "";
	for (let i = 0; i < len; i++) {
		id += alphabet[randomIntegerBetween(0, alphabet.length - 1)];
	}

	return id;
};

export const lgDistTest = (colorsAmt: number) => {
	const result: number[] = [];

	const dist = 1 / (colorsAmt - 1);
	for (let i = 0; i < colorsAmt; i++) {
		const p = i * dist * 100;
		result.push(p);
	}

	return result;
};
