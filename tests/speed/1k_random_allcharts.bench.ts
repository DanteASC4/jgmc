import { barchartStacked } from "../../src/barchartstacked.ts";
import { barchart } from "../../src/index.ts";
import { linechart } from "../../src/linechart.ts";
import { randomDataArray, randomStackedDataArray } from "../helpers.ts";

const rdA1: number[][] = [];
const rdA2: number[][][] = [];
const rdA3: number[][] = [];
const rdA4: number[][] = [];

for (let i = 0; i < 1000; i++) {
	rdA1.push(randomDataArray());
	rdA2.push(randomStackedDataArray().dataArray);
	rdA3.push(randomDataArray());
	rdA4.push(randomDataArray());
}

Deno.bench(function test1kRandomBarCharts() {
	// for (let i = 0; i < 1_000; i++) {
	// 	const rd = randomDataArray();
	// 	barchart({
	// 		data: rd,
	// 	});
	// }
	for (const rd of rdA1) {
		barchart({
			data: rd,
		});
	}
});

Deno.bench(function test1kRandomStackedBarCharts() {
	for (const rd of rdA2) {
		barchartStacked({
			data: rd,
		});
	}
});

Deno.bench(function test1kRandomSingleLineCharts() {
	for (const rd of rdA3) {
		linechart({
			data: rd,
		});
	}
});

Deno.bench(function test1kRandomMultiLineCharts() {
	for (const rd of rdA4) {
		linechart({
			data: rd,
		});
	}
});
