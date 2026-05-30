import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import {
	buildGalleryPage,
	type SaveablePairs,
} from "../../../tests/helpers.ts";
import { piechart } from "../src/piechart.ts";

const pairs: SaveablePairs = [];

Deno.test(function piechartTests() {
	const tpc0 = piechart({
		data: [400, 100, 300, 70, 130],
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "left-to-right",
		gradientMode: "continuous",
	});
	assertEquals(typeof tpc0, "string");

	const tpc1 = piechart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
	});
	assertEquals(typeof tpc1, "string");

	const tpc2 = piechart({
		data: [50, 50],
		fillColors: ["red", "green", "blue"],
	});
	assertEquals(typeof tpc2, "string");

	const tpc3 = piechart({
		data: [5, 5],
		fillColors: ["red", "green", "blue"],
	});
	assertEquals(typeof tpc3, "string");

	const tpc4 = piechart({
		data: [5, 5, 5, 5],
		fillColors: ["red", "green", "blue"],
	});
	assertEquals(typeof tpc4, "string");

	const tpc5 = piechart({
		data: [10, 10, 10, 30],
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "left-to-right",
		gradientMode: "continuous",
		strokeColors: ["black"],
		strokeWidths: [5],
	});
	assertEquals(typeof tpc5, "string");

	const tpc6 = piechart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
		labels: ["Red", "Green", "Blue"],
	});
	assertEquals(typeof tpc6, "string");

	const tpc7 = piechart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
		dataLabels: "literal",
	});
	assertEquals(typeof tpc7, "string");

	const tpc8 = piechart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
		dataLabels: "percentage",
	});
	assertEquals(typeof tpc8, "string");

	const tpcBig = piechart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
		size: 500,
	});
	assertEquals(typeof tpcBig, "string");

	pairs.push(
		[tpc0, "Basic Pie Chart"],
		[tpc1, "Pie Chart Thirds"],
		[tpc2, "Pie Chart Halves"],
		[tpc3, "Pie Chart Halves - Small Values"],
		[tpc4, "Pie Chart Quarters - Small Values"],
		[tpc5, "Pie Chart with Strokes and Gradient"],
		[tpc6, "Pie Chart with Labels"],
		[tpc7, "Pie Chart with Literal Data Labels"],
		[tpc8, "Pie Chart with Percentage Data Labels"],
		[tpcBig, "Larger Pie Chart"],
	);
});

Deno.test(function piechartDocsExamples() {
	const tp = piechart({
		data: [400, 100, 300, 70, 130],
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "left-to-right",
		gradientMode: "continuous",
	});
	assertEquals(typeof tp, "string");

	const tpc0 = piechart({
		data: [30, 30, 30],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00"],
	});
	assertEquals(typeof tpc0, "string");

	const tpc0a = piechart({
		data: [300, 300, 300, 300],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00", "#d4453a"],
	});
	assertEquals(typeof tpc0a, "string");

	const tpc0b = piechart({
		data: [50, 50],
		fillColors: ["#00ffff", "#ff00ff"],
	});
	assertEquals(typeof tpc0b, "string");

	const tpc0c = piechart({
		data: [400, 100, 300, 70, 130],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00", "#d4453a", "#3e9503"],
	});
	assertEquals(typeof tpc0c, "string");

	const tpc1 = piechart({
		data: [30, 30, 30],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00"],
		labels: ["Cyan", "Magenta", "Yellow"],
		labelColors: ["#000000"],
	});
	assertEquals(typeof tpc1, "string");

	const tpc2 = piechart({
		data: [30, 30, 30],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00"],
		dataLabels: "literal",
		labelColors: ["#000000"],
	});
	assertEquals(typeof tpc2, "string");

	const tpc3 = piechart({
		data: [30, 30, 30],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00"],
		dataLabels: "percentage",
		labelColors: ["#000000"],
	});
	assertEquals(typeof tpc3, "string");

	const tpc4 = piechart({
		data: [30, 30, 30],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00"],
		size: 50,
	});
	assertEquals(typeof tpc4, "string");

	const tpc5 = piechart({
		data: [30, 30, 30],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00"],
		padding: 50,
	});
	assertEquals(typeof tpc5, "string");

	const tpc6 = piechart({
		data: [30, 30, 30],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00"],
		strokeColors: ["#ffffff"],
		strokeWidths: [5],
	});
	assertEquals(typeof tpc6, "string");

	const tpc7 = piechart({
		data: [30, 30, 30],
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "left-to-right",
		gradientMode: "continuous",
		strokeColors: ["#ffffff"],
	});
	assertEquals(typeof tpc7, "string");

	const tpc8 = piechart({
		data: [30, 30, 30],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00"],
		centerLabel: "A center label",
	});
	assertEquals(typeof tpc8, "string");

	const tpc9 = piechart({
		data: [30, 30, 30],
		fillColors: ["#00ffff", "#ff00ff", "#ffff00"],
		centerLabel: "sum",
	});
	assertEquals(typeof tpc9, "string");

	pairs.push(
		[tpc0, "basic pie, data & color"],
		[tpc0a, "basic pie, diff data 4"],
		[tpc0b, "basic pie, diff data 2"],
		[tpc0c, "basic pie, diff data 5"],
		[tpc1, "pie, labels"],
		[tpc2, "pie, datalabels literal"],
		[tpc3, "pie, datalabels percentage"],
		[tpc4, "pie, size small"],
		[tpc5, "pie, padding"],
		[tpc6, "pie, stroke"],
		[tpc7, "pie, gradient"],
		[tpc8, "pie, center label"],
		[tpc9, "pie, center label sum"],
	);
});

afterAll(() => {
	buildGalleryPage("Vanilla Pie Chart", pairs);
});
