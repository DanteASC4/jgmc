import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import { barchartStacked } from "../src/barchartstacked.ts";
import {
	buildGalleryPage,
	getRects,
	getTexts,
	randomStackedDataArray,
	randShortString,
	type SaveablePairs,
} from "./helpers.ts";

const pairs: SaveablePairs = [];

/*
 * rsd = random stacked data
 * tbcs = test bar chart stacked
 */
Deno.test(function barchartStackedTests() {
	const tbcs0 = barchartStacked({
		data: [
			[50, 100, 30],
			[30, 100, 50],
			[30, 50, 100],
		],
	});
	assertEquals(tbcs0.getAttribute("width"), "300");
	assertEquals(tbcs0.getAttribute("height"), "300");
	assertEquals(getRects(tbcs0).length, 9);

	// With labels
	const rsd1 = randomStackedDataArray();
	const tbcs1 = barchartStacked({
		data: rsd1.dataArray,
		labels: new Array(rsd1.dataArray.length).fill(randShortString()),
	});
	assertEquals(tbcs1.getAttribute("width"), "300");
	assertEquals(tbcs1.getAttribute("height"), "300");
	assertEquals(getRects(tbcs1).length, rsd1.totalDatapoints);
	assertEquals(getTexts(tbcs1).length, rsd1.dataArray.length);

	// With labels & placement,
	const rsd2 = randomStackedDataArray();
	const tbcs2 = barchartStacked({
		data: rsd2.dataArray,
		labels: new Array(rsd2.dataArray.length).fill(randShortString()),
		placement: "top",
	});
	assertEquals(tbcs2.getAttribute("width"), "300");
	assertEquals(tbcs2.getAttribute("height"), "300");
	assertEquals(getRects(tbcs2).length, rsd2.totalDatapoints);
	assertEquals(getTexts(tbcs2).length, rsd2.dataArray.length);

	const rsd3 = randomStackedDataArray();
	const tbcs3 = barchartStacked({
		data: rsd3.dataArray,
		labels: new Array(rsd3.dataArray.length).fill(randShortString()),
		placement: "left",
	});
	assertEquals(tbcs3.getAttribute("width"), "300");
	assertEquals(tbcs3.getAttribute("height"), "300");
	assertEquals(getRects(tbcs3).length, rsd3.totalDatapoints);
	assertEquals(getTexts(tbcs3).length, rsd3.dataArray.length);

	const rsd4 = randomStackedDataArray();
	const tbcs4 = barchartStacked({
		data: rsd4.dataArray,
		labels: new Array(rsd4.dataArray.length).fill(randShortString()),
		placement: "right",
	});
	assertEquals(tbcs4.getAttribute("width"), "300");
	assertEquals(tbcs4.getAttribute("height"), "300");
	assertEquals(getRects(tbcs4).length, rsd4.totalDatapoints);
	assertEquals(getTexts(tbcs4).length, rsd4.dataArray.length);

	// Test for data padding
	const tbcs5 = barchartStacked({
		data: [
			[50, 100, 30],
			[30, 100, 50],
		],
		labels: ["a", "b", "c"],
		placement: "top",
	});
	assertEquals(tbcs5.getAttribute("width"), "300");
	assertEquals(tbcs5.getAttribute("height"), "300");
	assertEquals(getRects(tbcs5).length, 6);
	assertEquals(getTexts(tbcs5).length, 3);

	// Test gap
	const rsd6 = randomStackedDataArray();
	const tbcs6 = barchartStacked({
		data: rsd6.dataArray,
		labels: new Array(rsd6.dataArray.length).fill(randShortString()),
		placement: "top",
		gap: 3,
	});
	assertEquals(tbcs6.getAttribute("width"), "300");
	assertEquals(tbcs6.getAttribute("height"), "300");
	assertEquals(getRects(tbcs6).length, rsd6.totalDatapoints);
	assertEquals(getTexts(tbcs6).length, rsd6.dataArray.length);

	// Test gradient + label colors & non-square
	const rsd7 = randomStackedDataArray();
	const tbcs7 = barchartStacked({
		data: rsd7.dataArray,
		labels: new Array(rsd7.dataArray.length).fill(randShortString()),
		placement: "top",
		height: 350,
		width: 500,
		gradientColors: ["#ff00ff", "#00ffff"],
		labelColors: ["#ff00ff", "#00ffff"],
	});
	assertEquals(tbcs7.getAttribute("width"), "500");
	assertEquals(tbcs7.getAttribute("height"), "350");
	assertEquals(getRects(tbcs7).length, rsd7.totalDatapoints);
	assertEquals(getTexts(tbcs7).length, rsd7.dataArray.length);

	// Test gradient continuous, gradientdir, & non-square
	const rsd8 = randomStackedDataArray();
	const tbcs8 = barchartStacked({
		data: rsd8.dataArray,
		labels: new Array(rsd8.dataArray.length).fill(randShortString()),
		placement: "top",
		height: 350,
		width: 500,
		gradientColors: ["#ff00ff", "#00ffff"],
		gradientDirection: "right-to-left",
		gradientMode: "continuous",
	});
	// This has double the rects + 2 due to the masking
	assertEquals(
		tbcs8.querySelectorAll("rect").length,
		rsd8.totalDatapoints * 2 + 2,
	);
	assertEquals(tbcs8.getAttribute("width"), "500");
	assertEquals(tbcs8.getAttribute("height"), "350");
	assertEquals(getRects(tbcs8).length, rsd8.totalDatapoints * 2 + 2);
	assertEquals(getTexts(tbcs8).length, rsd8.dataArray.length);

	// Test all classes & normal coloring
	const rsd9 = randomStackedDataArray();
	const tbcs9 = barchartStacked({
		data: rsd9.dataArray,
		labels: new Array(rsd9.dataArray.length).fill(randShortString()),
		placement: "top",
		fillColors: ["#ff00ff", "#00ffff"],
	});
	assertEquals(tbcs9.getAttribute("width"), "300");
	assertEquals(tbcs9.getAttribute("height"), "300");

	// Bar width & top placement
	const rsd10 = randomStackedDataArray();
	const tbcs10 = barchartStacked({
		data: rsd10.dataArray,
		labels: new Array(rsd10.dataArray.length).fill(randShortString()),
		barWidth: 2,
		placement: "top",
	});
	assertEquals(tbcs10.querySelectorAll("rect").length, rsd10.totalDatapoints);
	assertEquals(tbcs10.getAttribute("width"), "300");
	assertEquals(tbcs10.getAttribute("height"), "300");

	const rsd11 = randomStackedDataArray();
	const tbcs11 = barchartStacked({
		data: rsd11.dataArray,
		labels: new Array(rsd11.dataArray.length).fill(randShortString()),
		barWidth: 2,
		placement: "left",
	});
	assertEquals(tbcs11.querySelectorAll("rect").length, rsd11.totalDatapoints);
	assertEquals(tbcs11.getAttribute("width"), "300");
	assertEquals(tbcs11.getAttribute("height"), "300");

	pairs.push(
		[tbcs0, "basic"],
		[tbcs1, "labels"],
		[tbcs2, "labels on top"],
		[tbcs3, "labels on left"],
		[tbcs4, "labels on right"],
		[tbcs5, "data padding"],
		[tbcs6, "gap"],
		[tbcs7, "gradient rectangle area"],
	);
});

afterAll(() => {
	buildGalleryPage("Bar Chart Stacked", pairs);
});
