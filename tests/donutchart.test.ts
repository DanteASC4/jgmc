import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import { donutchart } from "../src/donutchart.ts";
import { buildGalleryPage, type SaveablePairs } from "./helpers.ts";

const pairs: SaveablePairs = [];
const docPairs: SaveablePairs = [];

Deno.test(function donutchartTests() {
	const tpc0 = donutchart({
		data: [400, 100, 300, 70, 130],
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "left-to-right",
		gradientMode: "continuous",
	});
	assertEquals(tpc0.getAttribute("width"), "300");
	assertEquals(tpc0.getAttribute("height"), "300");

	const tpc1 = donutchart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
	});
	assertEquals(tpc1.getAttribute("width"), "300");
	assertEquals(tpc1.getAttribute("height"), "300");

	const tpc2 = donutchart({
		data: [50, 50],
		fillColors: ["red", "green", "blue"],
	});
	assertEquals(tpc2.getAttribute("width"), "300");
	assertEquals(tpc2.getAttribute("height"), "300");

	const tpc3 = donutchart({
		data: [5, 5],
		fillColors: ["red", "green", "blue"],
	});
	assertEquals(tpc3.getAttribute("width"), "300");
	assertEquals(tpc3.getAttribute("height"), "300");

	const tpc4 = donutchart({
		data: [5, 5, 5, 5],
		fillColors: ["red", "green", "blue"],
	});
	assertEquals(tpc4.getAttribute("width"), "300");
	assertEquals(tpc4.getAttribute("height"), "300");

	const tpc5 = donutchart({
		data: [10, 10, 10, 30],
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "left-to-right",
		gradientMode: "continuous",
		strokeColors: ["black"],
		strokeWidths: [5],
	});
	assertEquals(tpc5.getAttribute("width"), "300");
	assertEquals(tpc5.getAttribute("height"), "300");

	const tpc6 = donutchart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
		labels: ["Red", "Green", "Blue"],
	});
	assertEquals(tpc6.getAttribute("width"), "300");
	assertEquals(tpc6.getAttribute("height"), "300");

	const tpc7 = donutchart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
		dataLabels: "literal",
	});
	assertEquals(tpc7.getAttribute("width"), "300");
	assertEquals(tpc7.getAttribute("height"), "300");

	const tpc8 = donutchart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
		dataLabels: "percentage",
	});
	assertEquals(tpc8.getAttribute("width"), "300");
	assertEquals(tpc8.getAttribute("height"), "300");

	const tpcBig = donutchart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
		size: 500,
	});
	assertEquals(tpcBig.getAttribute("width"), "500");
	assertEquals(tpcBig.getAttribute("height"), "500");

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
	const t1 = donutchart({
		data: [400, 100, 300, 70, 130],
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "left-to-right",
		gradientMode: "continuous",
	});
	assertEquals(t1.getAttribute("width"), "300");
	assertEquals(t1.getAttribute("height"), "300");

	docPairs.push([t1, "Placeholder"]);
});

afterAll(() => {
	buildGalleryPage("Donut Chart", pairs);
	buildGalleryPage("Donut Chart Docs Examples", docPairs);
});
