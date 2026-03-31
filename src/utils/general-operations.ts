import { roundToTen } from "../math/common.ts";

export const sum2DArrayInPlace = (arr: number[][]) => {
	return arr.slice().map((a) => a.flat().reduce((c, p) => c + p, 0));
};

export const stackedToSummed = (arr: number[][]) => {
	return arr.slice().map((a) => a.reduce((c, p) => c + p, 0));
};

export const autoMaxNumerical = (data: number[]) => {
	const max = Math.max(...data);
	if (max > 0 && max <= 4) return 10;
	return roundToTen(max);
};
export const autoMinNumerical = (data: number[]) => {
	return roundToTen(Math.min(...data));
};

export const autoMaxStacked = (data: number[][]) => {
	const summed = sum2DArrayInPlace(data.slice());
	return roundToTen(Math.max(...summed));
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

export const roundToHalf = (num: number) => {
	return Math.round(num * 2) / 2;
};
