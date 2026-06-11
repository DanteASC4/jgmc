import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import { renderToStaticMarkup } from "react-dom/server";
import {
	buildGalleryPage,
	type SaveablePairs,
} from "../../../tests/helpers.ts";
import { PieChart } from "../src/PieChart.tsx";

const pairs: SaveablePairs = [];

Deno.test(function piechartTests() {
	const tbc0 = renderToStaticMarkup(<PieChart data={[50, 100, 30]} />);
	assertEquals(typeof tbc0, "string");

	pairs.push([tbc0, "Only data"]);
});

afterAll(() => {
	buildGalleryPage("React Pie Chart", pairs);
});
