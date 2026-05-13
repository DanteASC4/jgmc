import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import {
	buildGalleryPage,
	type SaveablePairs,
} from "../../../tests/helpers.ts";
import { donutchart } from "../src/donutchart.ts";

const pairs: SaveablePairs = [];

Deno.test(function barchartTests() {
	// Only the data
	const tbc0 = donutchart({
		data: [50, 100, 30],
	});
	assertEquals(typeof tbc0, "string");

	pairs.push([tbc0, "Only data"]);
});

afterAll(() => {
	buildGalleryPage("Donut Chart Revamped", pairs);
});
