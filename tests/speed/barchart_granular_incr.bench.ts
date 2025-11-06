import { barchart } from "../../src/index.ts";
import { randomDataArray } from "../helpers.ts";
import { bold, magenta } from "@std/fmt/colors";

const size3RandomDataArrs: number[][] = [];
const size5RandomDataArrs: number[][] = [];
const size10RandomDataArrs: number[][] = [];
const size20RandomDataArrs: number[][] = [];
const size50RandomDataArrs: number[][] = [];
const size100RandomDataArrs: number[][] = [];

const vMin = 0;
const vMax = 1000;

for (let i = 0; i < 10; i++) {
	size3RandomDataArrs.push(randomDataArray(3, 3, vMin, vMax));
	size5RandomDataArrs.push(randomDataArray(5, 5, vMin, vMax));
	size10RandomDataArrs.push(randomDataArray(10, 10, vMin, vMax));
	size20RandomDataArrs.push(randomDataArray(20, 20, vMin, vMax));
	size50RandomDataArrs.push(randomDataArray(50, 50, vMin, vMax));
	size100RandomDataArrs.push(randomDataArray(100, 100, vMin, vMax));
}

// console.log(magenta(`Starting: ${bold("size = 3")}`));

Deno.bench(function size3RandDatasets() {
	for (const rd of size3RandomDataArrs) {
		barchart({
			data: rd,
		});
	}
});

// console.log(magenta(`Starting: ${bold("size = 5")}`));

Deno.bench(function size5RandDatasets() {
	for (const rd of size5RandomDataArrs) {
		barchart({
			data: rd,
		});
	}
});

// console.log(magenta(`Starting: ${bold("size = 10")}`));

Deno.bench(function size10RandDatasets() {
	for (const rd of size10RandomDataArrs) {
		barchart({
			data: rd,
		});
	}
});

// console.log(magenta(`Starting: ${bold("size = 20")}`));

Deno.bench(function size20RandDatasets() {
	for (const rd of size20RandomDataArrs) {
		barchart({
			data: rd,
		});
	}
});

// console.log(magenta(`Starting: ${bold("size = 50")}`));

Deno.bench(function size50RandDatasets() {
	for (const rd of size50RandomDataArrs) {
		barchart({
			data: rd,
		});
	}
});

// console.log(magenta(`Starting: ${bold("size = 100")}`));

Deno.bench(function size100RandDatasets() {
	for (const rd of size100RandomDataArrs) {
		barchart({
			data: rd,
		});
	}
});
