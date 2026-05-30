import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import {
	buildGalleryPage,
	type SaveablePairs,
} from "../../../tests/helpers.ts";
import { linechart } from "../src/linechart.ts";

const pairs: SaveablePairs = [];

Deno.test(function lineChartBasics() {
	const tlc0 = linechart({
		data: [50, 100, 30],
	});
	assertEquals(typeof tlc0, "string");

	const tlc1 = linechart({
		data: [10, 20, 10, 20, 10, 20, 50, 100],
	});
	assertEquals(typeof tlc1, "string");

	const tlc2 = linechart({
		data: [10, 20, 10, 20, 10, 20, 50, 100],
		fullWidthLine: true,
	});
	assertEquals(typeof tlc2, "string");

	const tlc3 = linechart({
		data: [50, 100, 30],
		colors: "red",
	});
	assertEquals(typeof tlc3, "string");

	const tlc4 = linechart({
		data: [50, 100, 30],
		colors: "red",
		thickness: 5,
	});
	assertEquals(typeof tlc4, "string");

	const tlc5 = linechart({
		data: [50, 100, 30],
		labels: ["50", "100", "30"],
		colors: "red",
		thickness: 5,
	});
	assertEquals(typeof tlc5, "string");

	const tlc6 = linechart({
		data: [50, 100, 30],
		labels: ["50", "100", "30"],
		colors: "red",
		thickness: 5,
		lineType: "smooth",
	});
	assertEquals(typeof tlc6, "string");

	pairs.push(
		[tlc0, "basic"],
		[tlc1, "bunch of points"],
		[tlc2, "fullwidth line"],
		[tlc3, "colored line"],
		[tlc4, "thicker colored line"],
		[tlc5, "with labels"],
		[tlc6, "smooth"],
	);
});

Deno.test(function lineChartExamples() {
	const ex1 = linechart({
		data: [50, 100, 30],
		colors: "red",
		thickness: 10,
	});
	assertEquals(typeof ex1, "string");

	const ex2 = linechart({
		data: [50, 100, 30],
		colors: "red",
		thickness: 10,
		lineType: "smooth",
	});
	assertEquals(typeof ex2, "string");

	const ex3 = linechart({
		data: [50, 100, 30],
		thickness: 10,
		lineType: "smooth",
		gradientColors: ["#ff00ff", "#00ffff"],
	});
	assertEquals(typeof ex3, "string");

	const ex4 = linechart({
		data: [50, 100, 30],
		thickness: 10,
		lineType: "smooth",
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "top-to-bottom",
	});
	assertEquals(typeof ex4, "string");

	const ex5 = linechart({
		data: [
			[50, 100, 30],
			[3, 15, 110],
		],
		thickness: 3,
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "top-to-bottom",
	});
	assertEquals(typeof ex5, "string");

	const ex6 = linechart({
		data: [
			[50, 100, 30],
			[3, 15, 110],
		],
		thickness: [3, 10],
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "top-to-bottom",
	});
	assertEquals(typeof ex6, "string");

	pairs.push([ex1], [ex2], [ex3], [ex4], [ex5], [ex6]);
});

afterAll(() => {
	buildGalleryPage("Vanilla Line Chart", pairs);
});
