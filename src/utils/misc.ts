import { randomIntegerBetween } from "@std/random";

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

export const annotateBounds = (s: string) => {
	const lines: string[] = s.split("\n");
	const header = new Array(lines[0].length).fill(0);
	for (let i = 0; i < lines.length; i++) {
		const digit = String(i + 1).slice(-1);
		lines[i] = `${digit}${lines[i]}${lines[i].length > 0 ? digit : ""}`;
	}
	for (let i = 0; i < lines[0].length; i++) {
		header[i] = String(i + 1).slice(-1);
	}

	lines.unshift(header.join(""));
	lines.push(header.join(""));
	return lines.join("\n");
};
