import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import {
	buildGalleryPage,
	type SaveablePairs,
} from "../../../tests/helpers.ts";
import { donutchart } from "../src/donutchart.ts";

const pairs: SaveablePairs = [];

Deno.test(function donutchartTests() {
	const tpc0 = donutchart({
		data: [400, 100, 300, 70, 130],
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "left-to-right",
		gradientMode: "continuous",
	});
	assertEquals(typeof tpc0, "string");

	const tpc1 = donutchart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
	});
	assertEquals(typeof tpc1, "string");

	const tpc2 = donutchart({
		data: [50, 50],
		fillColors: ["red", "green", "blue"],
	});
	assertEquals(typeof tpc2, "string");

	const tpc3 = donutchart({
		data: [5, 5],
		fillColors: ["red", "green", "blue"],
	});
	assertEquals(typeof tpc3, "string");

	const tpc4 = donutchart({
		data: [5, 5, 5, 5],
		fillColors: ["red", "green", "blue"],
	});
	assertEquals(typeof tpc4, "string");

	const tpc5 = donutchart({
		data: [10, 10, 10, 30],
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "left-to-right",
		gradientMode: "continuous",
		strokeColors: ["black"],
		strokeWidths: [5],
	});
	assertEquals(typeof tpc5, "string");

	const tpc6 = donutchart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
		labels: ["Red", "Green", "Blue"],
	});
	assertEquals(typeof tpc6, "string");

	const tpc7 = donutchart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
		dataLabels: "literal",
	});
	assertEquals(typeof tpc7, "string");

	const tpc8 = donutchart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
		dataLabels: "percentage",
	});
	assertEquals(typeof tpc8, "string");

	const tpcBig = donutchart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
		size: 500,
	});
	assertEquals(typeof tpcBig, "string");

	pairs.push(
		[tpc0, "Basic Donut Chart"],
		[tpc1, "Donut Chart Thirds"],
		[tpc2, "Donut Chart Halves"],
		[tpc3, "Donut Chart Halves - Small Values"],
		[tpc4, "Donut Chart Quarters - Small Values"],
		[tpc5, "Donut Chart with Strokes and Gradient"],
		[tpc6, "Donut Chart with Labels"],
		[tpc7, "Donut Chart with Literal Data Labels"],
		[tpc8, "Donut Chart with Percentage Data Labels"],
		[tpcBig, "Larger Donut Chart"],
	);
});

Deno.test(function donutchartDocsExamples() {
	const tp = donutchart({
		data: [400, 100, 300, 70, 130],
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "left-to-right",
		gradientMode: "continuous",
	});
	assertEquals(typeof tp, "string");

	const tpc0 = donutchart({
		data: [30, 30, 30],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00"],
	});
	assertEquals(typeof tpc0, "string");

	const tpc0a = donutchart({
		data: [300, 300, 300, 300],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00", "#d4453a"],
	});
	assertEquals(typeof tpc0a, "string");

	const tpc0b = donutchart({
		data: [50, 50],
		fillColors: ["#00ffff", "#ff00ff"],
	});
	assertEquals(typeof tpc0b, "string");

	const tpc0c = donutchart({
		data: [400, 100, 300, 70, 130],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00", "#d4453a", "#3e9503"],
	});
	assertEquals(typeof tpc0c, "string");

	const tpc1 = donutchart({
		data: [30, 30, 30],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00"],
		labels: ["Cyan", "Magenta", "Yellow"],
		labelColors: ["#000000"],
	});
	assertEquals(typeof tpc1, "string");

	const tpc2 = donutchart({
		data: [30, 30, 30],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00"],
		dataLabels: "literal",
		labelColors: ["#000000"],
	});
	assertEquals(typeof tpc2, "string");

	const tpc3 = donutchart({
		data: [30, 30, 30],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00"],
		dataLabels: "percentage",
		labelColors: ["#000000"],
	});
	assertEquals(typeof tpc3, "string");

	const tpc4 = donutchart({
		data: [30, 30, 30],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00"],
		size: 50,
	});
	assertEquals(typeof tpc4, "string");

	const tpc5 = donutchart({
		data: [30, 30, 30],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00"],
		padding: 50,
	});
	assertEquals(typeof tpc5, "string");

	const tpc6 = donutchart({
		data: [30, 30, 30],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00"],
		strokeColors: ["#ffffff"],
		strokeWidths: [5],
	});
	assertEquals(typeof tpc6, "string");

	const tpc7 = donutchart({
		data: [30, 30, 30],
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "left-to-right",
		gradientMode: "continuous",
		strokeColors: ["#ffffff"],
	});
	assertEquals(typeof tpc7, "string");

	const tpc8 = donutchart({
		data: [30, 30, 30],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00"],
		centerLabel: "A center label",
		centerLabelColor: "#7c7c7c",
	});
	assertEquals(typeof tpc8, "string");

	const tpc9 = donutchart({
		data: [30, 30, 30],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00"],
		centerLabel: "sum",
		centerLabelColor: "#7c7c7c",
	});
	assertEquals(typeof tpc9, "string");

	pairs.push(
		[tpc0, "basic donut, data & color"],
		[tpc0a, "basic donut, diff data 4"],
		[tpc0b, "basic donut, diff data 2"],
		[tpc0c, "basic donut, diff data 5"],
		[tpc1, "donut, labels"],
		[tpc2, "donut, datalabels literal"],
		[tpc3, "donut, datalabels percentage"],
		[tpc4, "donut, size small"],
		[tpc5, "donut, padding"],
		[tpc6, "donut, stroke"],
		[tpc7, "donut, gradient"],
		[tpc8, "donut, center label"],
		[tpc9, "donut, center label sum"],
	);
});

afterAll(() => {
	buildGalleryPage("Vanilla Donut Chart", pairs);
	// buildGalleryPage("Vanilla Donut Chart Docs Examples", docPairs);
});
