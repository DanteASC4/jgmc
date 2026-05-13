import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import {
	buildGalleryPage,
	type SaveablePairs,
} from "../../../tests/helpers.ts";
import { barchart } from "../src/barchart.ts";

const pairs: SaveablePairs = [];

Deno.test(function barchartTests() {
	// Only the data
	const tbc0 = barchart({
		data: [50, 100, 30],
	});
	assertEquals(typeof tbc0, "string");

	pairs.push([tbc0, "Only data"]);
});

afterAll(() => {
	buildGalleryPage("Bar Chart Revamped", pairs);
});
