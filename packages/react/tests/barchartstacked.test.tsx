import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import { renderToStaticMarkup } from "react-dom/server";
import {
	buildGalleryPage,
	type SaveablePairs,
} from "../../../tests/helpers.ts";
import { BarChartStacked } from "../src/BarChartStacked.tsx";

const pairs: SaveablePairs = [];

Deno.test(function barchartStackedTests() {
	const tbc0 = renderToStaticMarkup(
		<BarChartStacked
			data={[
				[50, 25],
				[100, 30],
				[30, 20],
			]}
		/>,
	);
	assertEquals(typeof tbc0, "string");

	pairs.push([tbc0, "Only data"]);
});

afterAll(() => {
	buildGalleryPage("React Bar Chart Stacked", pairs);
});
