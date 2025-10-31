import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import { barchartStacked } from "../src/barchartstacked.ts";
import { barchart } from "../src/index.ts";
import { linechart } from "../src/linechart.ts";
import { buildGalleryPage, type SaveablePairs } from "./helpers.ts";

const pairs: SaveablePairs = [];

Deno.test(function miscTests() {
	const t0 = barchart({
		data: [50, 100, 30],
		labels: ["1st", "2nd", "3rd"],
	});
	assertEquals(typeof t0.outerHTML, "string");
	pairs.push([t0]);

	const t1 = linechart({
		data: [
			[50, 100, 40],
			[10, 20, 5],
			[90, 80, 70],
		],
		labels: ["1st", "2nd", "3rd"], // [!code highlight]
	});
	assertEquals(typeof t1.outerHTML, "string");
	pairs.push([t1]);

	const t2 = barchartStacked({
		data: [
			[50, 100, 30],
			[20, 40, 10],
			[10, 20, 5],
		],
		labels: ["1st", "2nd", "3rd"], // [!code highlight]
	});
	assertEquals(typeof t2.outerHTML, "string");
	pairs.push([t2]);

	const t3 = barchart({
		data: [50, 100, 30],
		labels: ["1st", "2nd", "3rd"],
		labelClass: "my-bar-labels", // [!code ++]
	});
	assertEquals(typeof t3.outerHTML, "string");
	pairs.push([t3]);

	const t4 = barchart({
		data: [50, 100, 30],
		dataLabels: "literal", // [!code highlight]
	});
	assertEquals(typeof t4.outerHTML, "string");
	pairs.push([t4]);

	const t5 = barchart({
		data: [50, 100, 30],
		dataLabels: "percentage", // [!code highlight]
	});
	assertEquals(typeof t5.outerHTML, "string");
	pairs.push([t5]);

	const t6 = barchart({
		data: [50, 100, 30],
		dataLabels: "percentage", // [!code highlight]
		labels: ["A", "B", "C"],
	});
	assertEquals(typeof t6.outerHTML, "string");
	pairs.push([t6]);

	const t7 = barchart({
		data: [50, 100, 30],
		imageLabels: [
			{
				href: "/out/test.jpg",
				alt: "Skull",
				height: 25,
				width: 25,
			},
			{
				href: "/out/test.jpg",
				alt: "Skull",
				height: 25,
				width: 25,
			},
			{
				href: "/out/test.jpg",
				alt: "Skull",
				height: 25,
				width: 25,
			},
		],
	});

	assertEquals(typeof t7.outerHTML, "string");
	pairs.push([t7]);
	const t8 = linechart({
		data: [
			[50, 50, 50, 40],
			[80, 20, 10, 105],
			[220, 240, 260, 280],
		],
		imageLabels: [
			{
				href: "/out/test.jpg",
				alt: "Skull",
				height: 25,
				width: 25,
				topText: "Top",
			},
			{
				href: "/out/test.jpg",
				alt: "Skull",
				height: 25,
				width: 25,
				bottomText: "Bottom",
			},
			{
				href: "/out/test.jpg",
				alt: "Skull",
				height: 25,
				width: 25,
				topText: "Top",
				bottomText: "Bottom",
			},
		],
		dataLabels: "percentage",
		parentClass: "test-parent",
	});
	assertEquals(typeof t8.outerHTML, "string");
	pairs.push([t8]);

	// const t3 = barchart({
	//   data: [50, 100, 30, 10],
	//   imageLabels: [
	//     {
	//       href: "/out/test.jpg",
	//       alt: "Skull",
	//     },
	//     {
	//       href: "/out/test.jpg",
	//       alt: "Skull",
	//     },
	//     {
	//       href: "/out/test.jpg",
	//       alt: "Skull",
	//     },
	//     {
	//       href: "/out/test.jpg",
	//       alt: "Skull",
	//     },
	//   ],
	// });
	// assertEquals(typeof t3.outerHTML, "string");
	// pairs.push([t3]);

	// const t4 = barchartStacked({
	//   data: [
	//     [50, 100, 30, 10],
	//     [80, 20, 10, 5],
	//     [20, 40, 60, 80],
	//   ],
	//   imageLabels: [
	//     {
	//       href: "/out/test.jpg",
	//       alt: "Skull",
	//     },
	//     {
	//       href: "/out/test.jpg",
	//       alt: "Skull",
	//     },
	//     {
	//       href: "/out/test.jpg",
	//       alt: "Skull",
	//     },
	//     {
	//       href: "/out/test.jpg",
	//       alt: "Skull",
	//     },
	//   ],
	// });
	// assertEquals(typeof t4.outerHTML, "string");
	// pairs.push([t4]);

	// const t5 = barchartStacked({
	//   data: [
	//     [50, 100, 30, 10],
	//     [80, 20, 10, 5],
	//     [20, 40, 60, 80],
	//   ],
	//   dataLabels: "literal",
	// });
	// assertEquals(typeof t5.outerHTML, "string");
	// pairs.push([t5]);

	// const t6 = linechart({
	//   data: [
	//     [50, 50, 50, 40],
	//     [80, 20, 10, 105],
	//     [220, 240, 260, 280],
	//   ],
	//   imageLabels: [
	//     {
	//       href: "/out/test.jpg",
	//       alt: "Skull",
	//       height: 25,
	//       width: 25,
	//       topText: "Top",
	//     },
	//     {
	//       href: "/out/test.jpg",
	//       alt: "Skull",
	//       height: 25,
	//       width: 25,
	//       bottomText: "Bottom",
	//     },
	//     {
	//       href: "/out/test.jpg",
	//       alt: "Skull",
	//       height: 25,
	//       width: 25,
	//       topText: "Top",
	//       bottomText: "Bottom",
	//     },
	//   ],
	//   dataLabels: "percentage",
	//   parentClass: "test-parent",
	// });
	// assertEquals(typeof t6.outerHTML, "string");
	// pairs.push([t6]);

	// const t7 = linechart({
	//   data: [
	//     [50, 100, 30, 40],
	//     [80, 20, 10, 5],
	//     [20, 40, 60, 80],
	//   ],
	//   labels: ["A", "B", "C", "D"],
	//   dataLabels: "literal",
	// });
	// assertEquals(typeof t7.outerHTML, "string");
	// pairs.push([t7]);
});

afterAll(() => {
	const labelDocsStyles = `.my-bar-labels {
  fill: red;
}`;
	buildGalleryPage("Labels Docs Examples", pairs, labelDocsStyles);
});
