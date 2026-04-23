import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import { piechart } from "../src/piechart.ts";
import { buildGalleryPage, type SaveablePairs } from "./helpers.ts";

const pairs: SaveablePairs = [];
const docPairs: SaveablePairs = [];

Deno.test(function piechartTests() {
	const tpc0 = piechart({
		data: [400, 100, 300, 70, 130],
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "left-to-right",
		gradientMode: "continuous",
	});
	assertEquals(tpc0.getAttribute("width"), "300");
	assertEquals(tpc0.getAttribute("height"), "300");

	const tpc1 = piechart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
	});
	assertEquals(tpc1.getAttribute("width"), "300");
	assertEquals(tpc1.getAttribute("height"), "300");

	const tpc2 = piechart({
		data: [50, 50],
		fillColors: ["red", "green", "blue"],
	});
	assertEquals(tpc2.getAttribute("width"), "300");
	assertEquals(tpc2.getAttribute("height"), "300");

	const tpc3 = piechart({
		data: [5, 5],
		fillColors: ["red", "green", "blue"],
	});
	assertEquals(tpc3.getAttribute("width"), "300");
	assertEquals(tpc3.getAttribute("height"), "300");

	const tpc4 = piechart({
		data: [5, 5, 5, 5],
		fillColors: ["red", "green", "blue"],
	});
	assertEquals(tpc4.getAttribute("width"), "300");
	assertEquals(tpc4.getAttribute("height"), "300");

	const tpc5 = piechart({
		data: [10, 10, 10, 30],
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "left-to-right",
		gradientMode: "continuous",
		strokeColors: ["black"],
		strokeWidths: [5],
	});
	assertEquals(tpc5.getAttribute("width"), "300");
	assertEquals(tpc5.getAttribute("height"), "300");

	const tpc6 = piechart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
		labels: ["Red", "Green", "Blue"],
	});
	assertEquals(tpc6.getAttribute("width"), "300");
	assertEquals(tpc6.getAttribute("height"), "300");

	const tpc7 = piechart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
		dataLabels: "literal",
	});
	assertEquals(tpc7.getAttribute("width"), "300");
	assertEquals(tpc7.getAttribute("height"), "300");

	const tpc8 = piechart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
		dataLabels: "percentage",
	});
	assertEquals(tpc8.getAttribute("width"), "300");
	assertEquals(tpc8.getAttribute("height"), "300");

	const tpcBig = piechart({
		data: [30, 30, 30],
		fillColors: ["red", "green", "blue"],
		size: 500,
	});
	assertEquals(tpcBig.getAttribute("width"), "500");
	assertEquals(tpcBig.getAttribute("height"), "500");

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
	const t1 = piechart({
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
	buildGalleryPage("Pie Chart", pairs);
	buildGalleryPage("Pie Chart Docs Examples", docPairs);
});
