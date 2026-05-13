import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import {
	buildGalleryPage,
	type SaveablePairs,
} from "../../../tests/helpers.ts";
import { barchartStacked } from "../src/barchartstacked.ts";

const pairs: SaveablePairs = [];

Deno.test(function barchartStackedTests() {
	// Only the data
	const tbc0 = barchartStacked({
		data: [
			[50, 100, 30],
			[30, 100, 50],
			[30, 50, 100],
		],
	});
	assertEquals(typeof tbc0, "string");

	pairs.push([tbc0, "Only data"]);
});

afterAll(() => {
	buildGalleryPage("Bar Chart Stacked Revamped", pairs);
});
