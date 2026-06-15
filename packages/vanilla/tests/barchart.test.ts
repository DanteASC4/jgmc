import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import {
	buildGalleryPage,
	type SaveablePairs,
} from "../../../tests/helpers.ts";
import { barchart } from "../src/barchart.ts";

const pairs: SaveablePairs = [];
const pairsExtras: SaveablePairs = [];

Deno.test(function barchartTests() {
	// Only the data
	const tbc0 = barchart({
		data: [50, 100, 30],
	});
	assertEquals(typeof tbc0, "string");

	// Labels, auto-placed
	const tbc1 = barchart({
		data: [50, 100, 30],
		labels: ["1st", "2nd", "3rd"],
	});
	assertEquals(typeof tbc1, "string");

	// Labels, placed on top
	const tbc2 = barchart({
		data: [50, 100, 30],
		labels: ["1st", "2nd", "3rd"],
		placement: "top",
	});
	assertEquals(typeof tbc2, "string");

	// Labels, placed on right
	const tbc3 = barchart({
		data: [50, 100, 30],
		labels: ["aaa", "bbb", "ccc"],
		placement: "right",
	});
	assertEquals(typeof tbc3, "string");

	// Labels, placed on bottom
	const tbc4 = barchart({
		data: [50, 100, 30],
		labels: ["aaa", "bbb", "ccc"],
		placement: "bottom",
	});
	assertEquals(typeof tbc4, "string");

	// Custom bar width & placement
	const tbc5 = barchart({
		data: [50, 100, 30],
		labels: ["aaa", "bbb", "ccc"],
		placement: "left",
		barWidth: 5,
	});
	assertEquals(typeof tbc5, "string");

	// Non-square with labels
	const tbc6 = barchart({
		data: [50, 100, 30],
		labels: ["aaa", "bbb", "ccc"],
		placement: "top",
		height: 200,
		width: 500,
	});
	assertEquals(typeof tbc6, "string");

	// No labels, non-square, top
	const tbc7 = barchart({
		data: [50, 100, 30],
		placement: "top",
		height: 200,
		width: 500,
	});
	assertEquals(typeof tbc7, "string");

	// Non-square /w custom bar width
	const tbc8 = barchart({
		data: [50, 100, 30],
		labels: ["aaa", "bbb", "ccc"],
		placement: "top",
		height: 200,
		width: 500,
		barWidth: 10,
	});
	assertEquals(typeof tbc8, "string");

	// Data padding, label colors, & group classes
	const tbc9 = barchart({
		data: [50, 100],
		labels: ["a", "b", "c"],
		labelColors: ["#00ffff", "#ff00ff"],
	});
	assertEquals(typeof tbc9, "string");

	pairs.push(
		[tbc0, "simplest possible"],
		[tbc1, "labels"],
		[tbc2, "on top"],
		[tbc3, "on right"],
		[tbc4, "on bottom"],
		[tbc5, "custom bar width"],
		[tbc6, "rectangular area"],
		[tbc7, "rectangular on top"],
		[tbc8, "bar & label class + more"],
		[tbc9, "label colors & data padding"],
	);
});

Deno.test(function docsExamplesSet() {
	const tbc0 = barchart({
		data: [50, 100, 30],
	});
	assertEquals(typeof tbc0, "string");

	const tbc1 = barchart({
		data: [50, 100, 30],
		labels: ["1st", "2nd", "3rd"],
	});
	assertEquals(typeof tbc1, "string");

	const tbc2 = barchart({
		data: [50, 100, 30],
		labels: ["1st", "2nd", "3rd"],
		placement: "top",
	});
	assertEquals(typeof tbc2, "string");

	const tbc3 = barchart({
		data: [50, 1000, 100],
		placement: "left",
	});
	assertEquals(typeof tbc3, "string");

	const tbc4 = barchart({
		data: [50, 1000, 100],
		placement: "top",
	});
	assertEquals(typeof tbc4, "string");

	const tbc5 = barchart({
		data: [100, 50, 100],
		placement: "top",
		fillColors: ["#ff00ff", "#00ffff"],
	});
	assertEquals(typeof tbc5, "string");

	const tbc6 = barchart({
		data: [100, 100, 100],
		placement: "left",
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "left-to-right",
		width: 110,
		height: 110,
	});
	assertEquals(typeof tbc6, "string");

	const tbc7 = barchart({
		data: [100, 50, 100],
		placement: "top",
		gradientColors: [
			"oklch(0.7017 0.3225 328.36)",
			"oklch(0.9054 0.15455 194.769)",
		],
		gradientDirection: "top-to-bottom",
	});
	assertEquals(typeof tbc7, "string");

	const tbc8 = barchart({
		data: [250, 50, 100, 150, 100],
		placement: "top",
		gradientColors: [
			"oklch(0.7017 0.3225 328.36)",
			"oklch(0.9054 0.15455 194.769)",
		],
		gradientDirection: "top-to-bottom",
		gradientMode: "continuous",
	});
	assertEquals(typeof tbc8, "string");

	pairs.push(
		[tbc0, "docs simplest possible"],
		[tbc1, "docs labels"],
		[tbc2, "docs on top"],
		[tbc3, "docs middle value 1000 place left"],
		[tbc4, "docs middle value 1000 place top"],
		[tbc5, "docs colors"],
		[tbc6, "docs gradient left-to-right"],
		[tbc7, "docs gradient oklch"],
		[tbc8, "docs gradient continuous"],
	);
});

Deno.test(function barchartExtras() {
	const tbc0 = barchart({
		data: [50, 1000, 30],
		placement: "top",
		labels: ["1st", "2nd"],
	});
	assertEquals(typeof tbc0, "string");

	const tbc1 = barchart({
		data: [50, 100, 30],
		placement: "right",
		labels: ["1st", "2nd", "3rd"],
	});
	assertEquals(typeof tbc1, "string");

	const tbc2 = barchart({
		data: [50, 1000, 30],
		labels: ["1st", "2nd", "3rd"],
		placement: "bottom",
	});
	assertEquals(typeof tbc2, "string");

	const tbc3 = barchart({
		data: [50, 1000, 30],
		labels: ["1st", "2nd", "3rd"],
		placement: "left",
	});
	assertEquals(typeof tbc3, "string");

	pairsExtras.push(
		[tbc0, "extras 1"],
		[tbc1, "extras 2"],
		[tbc2, "extras 3"],
		[tbc3, "extras 4"],
	);
});

afterAll(() => {
	buildGalleryPage("Vanilla Bar Chart", pairs);
	buildGalleryPage("Vanilla Bar Chart Extras", pairsExtras);
});
