import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
	buildGalleryPage,
	type SaveablePairs,
} from "../../../tests/helpers.ts";
import { BarChart } from "../src/BarChart.tsx";

const pairs: SaveablePairs = [];

Deno.test(function barchartTests() {
	// Only the data
	const tbc0 = renderToStaticMarkup(<BarChart data={[50, 100, 30]} />);
	assertEquals(typeof tbc0, "string");
	console.log(tbc0);

	pairs.push([tbc0, "Only data"]);
});

afterAll(() => {
	buildGalleryPage("React Bar Chart", pairs);
});
