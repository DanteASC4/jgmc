import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import { barchartStacked } from "../src/barchartstacked.ts";
import { barchart } from "../src/index.ts";
import { linechart } from "../src/linechart.ts";
import { buildGalleryPage, type SaveablePairs } from "./helpers.ts";

const pairs: SaveablePairs = [];

Deno.test(function miscTests() {
  const t0 = barchart({
    data: [50, 100, 30, 10],
    labels: ["bar1", "bar2", "bar3", "bar4"],
    dataLabels: "percentage",
  });
  assertEquals(typeof t0.outerHTML, "string");
  pairs.push([t0]);

  const t1 = linechart({
    data: [301, 100, 30, 10],
  });
  assertEquals(typeof t1.outerHTML, "string");
  pairs.push([t1]);

  const t2 = linechart({
    data: [100, 0, 0, -50, 0, 0, 100],
  });
  assertEquals(typeof t2.outerHTML, "string");
  pairs.push([t2]);

  const _t3 = barchart({
    data: [100, 50, 100],
    placement: "top",
    gradientColors: [
      "oklch(0.7017 0.3225 328.36)",
      "oklch(0.9054 0.15455 194.769)",
    ],
    gradientDirection: "top-to-bottom",
  });

  const t3 = barchart({
    data: [50, 100, 30, 10],
    imageLabels: [
      {
        href: "/out/test.jpg",
        alt: "Skull",
      },
      {
        href: "/out/test.jpg",
        alt: "Skull",
      },
      {
        href: "/out/test.jpg",
        alt: "Skull",
      },
      {
        href: "/out/test.jpg",
        alt: "Skull",
      },
    ],
  });
  assertEquals(typeof t3.outerHTML, "string");
  pairs.push([t3]);

  const t4 = barchartStacked({
    data: [
      [50, 100, 30, 10],
      [80, 20, 10, 5],
      [20, 40, 60, 80],
    ],
    imageLabels: [
      {
        href: "/out/test.jpg",
        alt: "Skull",
      },
      {
        href: "/out/test.jpg",
        alt: "Skull",
      },
      {
        href: "/out/test.jpg",
        alt: "Skull",
      },
      {
        href: "/out/test.jpg",
        alt: "Skull",
      },
    ],
  });
  assertEquals(typeof t4.outerHTML, "string");
  pairs.push([t4]);

  const t5 = barchartStacked({
    data: [
      [50, 100, 30, 10],
      [80, 20, 10, 5],
      [20, 40, 60, 80],
    ],
    dataLabels: "literal",
  });
  assertEquals(typeof t5.outerHTML, "string");
  pairs.push([t5]);

  const t6 = linechart({
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
    classes: {
      parentClass: "test-parent",
    },
  });
  assertEquals(typeof t6.outerHTML, "string");
  pairs.push([t6]);

  const t7 = linechart({
    data: [
      [50, 100, 30, 40],
      [80, 20, 10, 5],
      [20, 40, 60, 80],
    ],
    labels: ["A", "B", "C", "D"],
    dataLabels: "literal",
  });
  assertEquals(typeof t7.outerHTML, "string");
  pairs.push([t7]);

  // pairs.push([t0]);
});

afterAll(() => {
  const tinkerStyles = `.test-parent {
}`;
  buildGalleryPage("Tinker", pairs, tinkerStyles);
});
