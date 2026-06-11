import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import { renderToStaticMarkup } from "react-dom/server";
import {
	buildGalleryPage,
	type SaveablePairs,
} from "../../../tests/helpers.ts";
import { DonutChart } from "../src/DonutChart.tsx";

const pairs: SaveablePairs = [];

Deno.test(function donutchartTests() {
	const tbc0 = renderToStaticMarkup(<DonutChart data={[50, 100, 30]} />);
	assertEquals(typeof tbc0, "string");

	pairs.push([tbc0, "Only data"]);
});

afterAll(() => {
	buildGalleryPage("React Donut Chart", pairs);
});
