import { assert, assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import {
	autoMaxNumerical,
	autoMaxStacked,
	autoMinNumerical,
	fillEmptyArray,
	fillStrings,
	fillZeros,
	lgDistTest,
	randId,
	stackedToSummed,
	sumArray,
} from "../src/utils/general-operations.ts";

describe("general array operations", () => {
	it("sums a flat array", () => {
		const arr = [1, 2, 3, 4];
		const result = sumArray(arr);
		assertEquals(result, 10);
		assertEquals(arr, [1, 2, 3, 4]);
	});

	it("sums stacked arrays in place", () => {
		const arr = [
			[1, 2, 3],
			[4, 5, 6],
		];
		const result = stackedToSummed(arr);
		assertEquals(result, [6, 15]);
		assertEquals(arr, [
			[1, 2, 3],
			[4, 5, 6],
		]);
	});

	describe("autoMaxNumerical", () => {
		it("finds the max of the given array, rounded up to the nearest 10", () => {
			const data = [12, 25, 7, 3];
			const result = autoMaxNumerical(data);
			assertEquals(result, 30);
		});

		it("returns 10 if the max is between 0 and 4 to avoid having a max of 0 which would break the chart", () => {
			const data = [0, 1, 2, 3];
			const result = autoMaxNumerical(data);
			assertEquals(result, 10);
		});
	});

	describe("autoMinNumerical", () => {
		it("finds the min of the given array, rounded down to the nearest 10", () => {
			const data = [12, 25, 7, 3];
			const result = autoMinNumerical(data);
			assertEquals(result, 0);
		});
	});

	describe("autoMaxStacked", () => {
		it("finds the max from summed stacked arrays and rounds to nearest 10", () => {
			const data = [
				[1, 2, 3],
				[4, 5, 6],
			];
			const result = autoMaxStacked(data);
			assertEquals(result, 20);
		});
	});

	describe("fillStrings", () => {
		it("fills the array with empty strings", () => {
			const arr = ["a", "b"];
			fillStrings(arr, 3);
			assertEquals(arr, ["a", "b", "", "", ""]);
		});
	});

	describe("fillEmptyArray", () => {
		it("fills the array with empty arrays", () => {
			const arr = [
				[1, 2],
				[3, 4],
			];
			fillEmptyArray(arr, 2);
			assertEquals(arr, [[1, 2], [3, 4], [], []]);
		});
	});

	describe("fillZeros", () => {
		it("fills the array with zeros", () => {
			const arr = [1, 2, 3];
			fillZeros(arr, 2);
			assertEquals(arr, [1, 2, 3, 0, 0]);
		});
	});

	describe("randId", () => {
		it("creates an 8-char id by default using only allowed characters", () => {
			const id = randId();
			assertEquals(id.length, 8);
			assert(/^[a-zA-Z0-9]+$/.test(id));
		});

		it("creates an id with the requested length", () => {
			const id = randId(12);
			assertEquals(id.length, 12);
			assert(/^[a-zA-Z0-9]+$/.test(id));
		});
	});

	describe("lgDistTest", () => {
		it("returns evenly distributed percentages", () => {
			const result = lgDistTest(3);
			assertEquals(result, [0, 50, 100]);
		});
	});
});
