import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import {
	buildGalleryPage,
	type SaveablePairs,
} from "../../../tests/helpers.ts";
import { barchartStacked } from "../src/barchartstacked.ts";

const pairs: SaveablePairs = [];

Deno.test(function barchartStackedTests() {
	// Basic stacked
	const tbc0 = barchartStacked({
		data: [
			[50, 100, 30],
			[30, 100, 50],
			[30, 50, 100],
		],
	});
	assertEquals(typeof tbc0, "string");

	// With labels
	const rsd1 = {
		dataArray: [
			[10, 20, 30],
			[5, 15, 25],
		],
		totalDatapoints: 6,
	};
	const tbc1 = barchartStacked({
		data: rsd1.dataArray,
		labels: new Array(rsd1.dataArray.length).fill("lbl"),
	});
	assertEquals(typeof tbc1, "string");

	// With placement variations
	const tbc2 = barchartStacked({
		data: rsd1.dataArray,
		labels: new Array(rsd1.dataArray.length).fill("lbl"),
		placement: "top",
	});
	assertEquals(typeof tbc2, "string");

	const tbc3 = barchartStacked({
		data: rsd1.dataArray,
		labels: new Array(rsd1.dataArray.length).fill("lbl"),
		placement: "left",
	});
	assertEquals(typeof tbc3, "string");

	const tbc4 = barchartStacked({
		data: rsd1.dataArray,
		labels: new Array(rsd1.dataArray.length).fill("lbl"),
		placement: "right",
	});
	assertEquals(typeof tbc4, "string");

	// Data padding
	const tbc5 = barchartStacked({
		data: [
			[50, 100, 30],
			[30, 100, 50],
		],
		labels: ["a", "b", "c"],
		placement: "top",
	});
	assertEquals(typeof tbc5, "string");

	// Gap
	const tbc6 = barchartStacked({
		data: rsd1.dataArray,
		labels: new Array(rsd1.dataArray.length).fill("lbl"),
		placement: "top",
		gap: 3,
	});
	assertEquals(typeof tbc6, "string");

	// Gradient + label colors + non-square
	const rsd7 = rsd1;
	const tbc7 = barchartStacked({
		data: rsd7.dataArray,
		labels: new Array(rsd7.dataArray.length).fill("lbl"),
		placement: "top",
		height: 350,
		width: 500,
		gradientColors: ["#ff00ff", "#00ffff"],
		labelColors: ["#ff00ff", "#00ffff"],
	});
	assertEquals(typeof tbc7, "string");

	// Gradient continuous
	const rsd8 = rsd1;
	const tbc8 = barchartStacked({
		data: rsd8.dataArray,
		labels: new Array(rsd8.dataArray.length).fill("lbl"),
		placement: "top",
		height: 350,
		width: 500,
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "right-to-left",
		gradientMode: "continuous",
	});
	assertEquals(typeof tbc8, "string");

	// Fill colors
	const rsd9 = rsd1;
	const tbc9 = barchartStacked({
		data: rsd9.dataArray,
		labels: new Array(rsd9.dataArray.length).fill("lbl"),
		placement: "top",
		fillColors: ["#ff00ff", "#00ffff"],
	});
	assertEquals(typeof tbc9, "string");

	// Bar width variations
	const rsd10 = rsd1;
	const tbc10 = barchartStacked({
		data: rsd10.dataArray,
		labels: new Array(rsd10.dataArray.length).fill("lbl"),
		barWidth: 2,
		placement: "top",
	});
	assertEquals(typeof tbc10, "string");

	const tbc11 = barchartStacked({
		data: rsd10.dataArray,
		labels: new Array(rsd10.dataArray.length).fill("lbl"),
		barWidth: 2,
		placement: "left",
	});
	assertEquals(typeof tbc11, "string");

	pairs.push(
		[tbc0, "basic"],
		[tbc1, "labels"],
		[tbc2, "labels on top"],
		[tbc3, "labels on left"],
		[tbc4, "labels on right"],
		[tbc5, "data padding"],
		[tbc6, "gap"],
		[tbc7, "gradient rectangle area"],
	);
});

afterAll(() => {
	buildGalleryPage("Vanilla Bar Chart Stacked", pairs);
});
