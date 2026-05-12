import { randomIntegerBetween } from "@std/random";
import { roundToTen } from "../common.ts";

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

export const fillStrings = (arr: string[], amt: number) => {
	let i = amt;
	while (i !== 0) {
		arr.push("");
		i--;
	}
};

export const fillEmptyArray = (arr: number[][], amt: number) => {
	let i = amt;
	while (i !== 0) {
		arr.push([]);
		i--;
	}
};

export const fillZeros = (arr: number[], amt: number) => {
	let i = amt;
	while (i !== 0) {
		arr.push(0);
		i--;
	}
};

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
