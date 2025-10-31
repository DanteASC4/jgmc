import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import { barchart } from "../src/index.ts";
import { buildGalleryPage, type SaveablePairs } from "./helpers.ts";

const pairs: SaveablePairs = [];

Deno.test(function barChartsBiggerData() {
	const tbc0 = barchart({
		data: [50, 1000, 100],
		placement: "left",
	});

	assertEquals(tbc0.getAttribute("width"), "300");
	assertEquals(tbc0.getAttribute("height"), "300");

	const tbc1 = barchart({
		data: [50, 1000, 100],
		placement: "top",
	});

	assertEquals(tbc1.getAttribute("width"), "300");
	assertEquals(tbc1.getAttribute("height"), "300");

	pairs.push(
		[tbc0, "middle value 1000 place left"],
		[tbc1, "middle value 1000 place top"],
	);
});

Deno.test(function barChartsColored() {
	const tbc0 = barchart({
		data: [100, 100, 100],
		placement: "left",
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "left-to-right",
		width: 110,
		height: 110,
	});

	assertEquals(tbc0.getAttribute("width"), "110");
	assertEquals(tbc0.getAttribute("height"), "110");

	const tbc1 = barchart({
		data: [100, 50, 100],
		placement: "top",
		fillColors: ["#ff00ff", "#00ffff"],
	});

	assertEquals(tbc1.getAttribute("width"), "300");
	assertEquals(tbc1.getAttribute("height"), "300");

	const tbc2 = barchart({
		data: [100, 50, 100],
		placement: "top",
		gradientColors: [
			"oklch(0.7017 0.3225 328.36)",
			"oklch(0.9054 0.15455 194.769)",
		],
		gradientDirection: "top-to-bottom",
	});

	assertEquals(tbc2.getAttribute("width"), "300");
	assertEquals(tbc2.getAttribute("height"), "300");

	const tbc3 = barchart({
		data: [250, 50, 100, 150, 100],
		placement: "top",
		gradientColors: [
			"oklch(0.7017 0.3225 328.36)",
			"oklch(0.9054 0.15455 194.769)",
		],
		gradientDirection: "top-to-bottom",
		gradientMode: "continuous",
	});

	assertEquals(tbc3.getAttribute("width"), "300");
	assertEquals(tbc3.getAttribute("height"), "300");

	const tbc4 = barchart({
		data: [100, 97, 110, 116, 101], // There's a secret in here...
		height: 125,
		placement: "top",
		gradientColors: ["#00ffff", "#00ffff", "#dd0547", "#dd0547"],
		gradientDirection: "top-to-bottom",
		gradientMode: "continuous",
	});

	assertEquals(tbc4.getAttribute("width"), "300");
	assertEquals(tbc4.getAttribute("height"), "125");

	const tbc5 = barchart({
		data: [100, 97, 110, 116, 101], // There's a secret in here...
		height: 125,
		placement: "top",
	});

	assertEquals(tbc5.getAttribute("width"), "300");
	assertEquals(tbc5.getAttribute("height"), "125");

	pairs.push(
		[tbc0, "gradient"],
		[tbc1, "fewer colors"],
		[tbc2, "gradient oklch"],
		[tbc3, "gradient continuous"],
		[tbc4, "gradient logobase"],
		[tbc5, "logobase"],
	);
});

Deno.test(function devBarChartTests() {
	const t0 = barchart({
		data: [50, 100, 30, 10],
	});
	assertEquals(typeof t0.outerHTML, "string");

	const t1 = barchart({
		data: [301, 100, 30, 10],
	});
	assertEquals(typeof t1.outerHTML, "string");

	pairs.push([t0], [t1]);
});

afterAll(() => {
	buildGalleryPage("Bar Chart Extras", pairs);
});
