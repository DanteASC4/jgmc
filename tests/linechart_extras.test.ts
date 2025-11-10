import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import { linechart } from "../src/linechart.ts";
import { buildGalleryPage, type SaveablePairs } from "./helpers.ts";

const pairs: SaveablePairs = [];

Deno.test(function lineChartExtras() {
  const tlc0 = linechart({
    data: [50, 100, 30],
    labels: ["1", "2", "3"],
    gradientColors: ["#ff00ff", "#00ffff"],
    classes: {
      labelClass: "da-labels",
    },
  });
  assertEquals(tlc0.getAttribute("width"), "300");
  assertEquals(tlc0.getAttribute("height"), "110");

  const tlc1 = linechart({
    data: [50, 100, 30],
    gradientColors: ["#ff00ff:30%", "#00ffff"],
  });
  assertEquals(tlc1.getAttribute("width"), "300");
  assertEquals(tlc1.getAttribute("height"), "110");

  const tlc2 = linechart({
    data: [50, 100, 30],
    gradientColors: ["#ff00ff:30%", "#00ffff"],
    gradientDirection: "bottom-to-top",
  });
  assertEquals(tlc2.getAttribute("width"), "300");
  assertEquals(tlc2.getAttribute("height"), "110");

  const tlc3 = linechart({
    data: [50, 100, 30],
    gradientColors: ["#ff00ff", "#00ffff"],
    gradientDirection: "bottom-to-top",
    gradientMode: "continuous",
  });
  assertEquals(tlc3.getAttribute("width"), "300");
  assertEquals(tlc3.getAttribute("height"), "110");

  const tlc4 = linechart({
    data: [50, 100, 30],
    gradientColors: ["#ff00ff", "#00ffff"],
    gradientDirection: "145",
    gradientMode: "continuous",
  });
  assertEquals(tlc4.getAttribute("width"), "300");
  assertEquals(tlc4.getAttribute("height"), "110");

  const tlc5a = linechart({
    data: [10, 20, 10, 20, 10, 20, 50, 100],
  });
  assertEquals(tlc5a.getAttribute("width"), "300");
  assertEquals(tlc5a.getAttribute("height"), "110");

  const tlc5 = linechart({
    data: [10, 20, 10, 20, 10, 20, 50, 100],
    lineType: "smooth",
  });
  assertEquals(tlc5.getAttribute("width"), "300");
  assertEquals(tlc5.getAttribute("height"), "110");

  const tlc6 = linechart({
    data: [50, 100, 30],
    lineType: "smooth",
  });
  assertEquals(tlc6.getAttribute("width"), "300");
  assertEquals(tlc6.getAttribute("height"), "110");

  const tlc7 = linechart({
    data: [10, 50, 10],
    lineType: "smooth",
  });
  // assertEquals(tlc6.getAttribute("width"), "300");
  // assertEquals(tlc6.getAttribute("height"), "110");

  const tlc8 = linechart({
    data: [10, 50, 10],
  });

  pairs.push(
    [tlc0, "basic gradient"],
    [tlc1, "gradient with stops"],
    [tlc2, "bottom to top gradient"],
    [tlc3, "continuous gradient"],
    [tlc4, "gradient custom angle"],
    [tlc5a, "much data straight"],
    [tlc5, "much data smooth"],
    [tlc6, "smol smooth"],
    [tlc7, "smooth test"],
    [tlc8],
  );
});

Deno.test(function linechartCoverageTests() {
  // Coverage!
  const tlc0 = linechart({
    data: [50, 100, 30],
    labels: ["1", "2", "3"],
    labelColors: ["red"],
  });
  assertEquals(tlc0.getAttribute("width"), "300");
  assertEquals(tlc0.getAttribute("height"), "110");

  const tlc1 = linechart({
    data: [50, 500, 30],
    labels: ["1", "2", "3"],
    labelColors: ["red"],
    cap: "butt",
    height: 300,
    // lineType: "smooth",
    gradientColors: ["#ff00ff", "#00ffff"],
    classes: {
      parentClass: "lineparent",
      lineGroupClass: "linegroup",
      lineClass: "line",
      labelGroupClass: "labels",
    },
  });
  assertEquals(tlc1.getAttribute("width"), "600");
  assertEquals(tlc1.getAttribute("height"), "300");
});

afterAll(() => {
  buildGalleryPage("Line Chart Extras", pairs);
});
