import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import { barchartStacked } from "../src/barchartstacked.ts";
import { buildGalleryPage, type SaveablePairs } from "./helpers.ts";

const pairs: SaveablePairs = [];

/*
 * Mostly just for examples & tinkering
 */
Deno.test(function barchartStackedExtraTests() {
	const tbcs0 = barchartStacked({
		data: [
			[50, 100, 30],
			[10, 10, 10],
			[100, 150, 50],
		],
	});
	assertEquals(tbcs0.getAttribute("width"), "300");
	assertEquals(tbcs0.getAttribute("height"), "300");

	const tbcs1 = barchartStacked({
		data: [[50, 100, 30], [100], [100, 150, 50]],
	});
	assertEquals(tbcs1.getAttribute("width"), "300");
	assertEquals(tbcs1.getAttribute("height"), "300");

	const tbcs2 = barchartStacked({
		data: [
			[50, 100, 30],
			[100, 15, 30],
			[100, 50, 50],
		],
		labels: ["foo", "bar", "baz"],
	});
	assertEquals(tbcs2.getAttribute("width"), "300");
	assertEquals(tbcs2.getAttribute("height"), "300");

	const tbcs3 = barchartStacked({
		data: [
			[50, 100, 30],
			[100, 15, 30],
			[100, 50, 50],
		],
		fillColors: ["#ff00ff", "#00ffff", "#dd0547"],
	});
	assertEquals(tbcs3.getAttribute("width"), "300");
	assertEquals(tbcs3.getAttribute("height"), "300");

	const tbcs4 = barchartStacked({
		data: [
			[50, 100, 130],
			[100, 100, 50],
			[100, 50, 100],
		],
		gradientColors: ["#ff00ff", "#00ffff", "#dd0547"],
		gradientDirection: "top-to-bottom",
	});
	assertEquals(tbcs4.getAttribute("width"), "300");
	assertEquals(tbcs4.getAttribute("height"), "300");

	const tbcs5 = barchartStacked({
		data: [
			[50, 100, 130],
			[100, 100, 50],
			[100, 50, 100],
		],
		gradientColors: ["#ff00ff", "#00ffff", "#dd0547"],
		gradientDirection: "top-to-bottom",
		gradientMode: "continuous",
		barClass: "mybars",
	});
	assertEquals(tbcs5.getAttribute("width"), "300");
	assertEquals(tbcs5.getAttribute("height"), "300");

	pairs.push(
		[tbcs0, "basic"],
		[tbcs1, "with labels"],
		[tbcs2, "colored"],
		[tbcs3, "gradient"],
		[tbcs4, "gradient top to bottom"],
		[tbcs5, "gradient continuous"],
	);
});

afterAll(() => {
	buildGalleryPage("Bar Chart Stacked Extras", pairs);
});
