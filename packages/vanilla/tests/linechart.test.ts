import { assertEquals } from "@std/assert";
import { afterAll } from "@std/testing/bdd";
import {
  buildGalleryPage,
  type SaveablePairs,
} from "../../../tests/helpers.ts";
import { linechart } from "../src/linechart.ts";

const pairs: SaveablePairs = [];

Deno.test(function linechartTests() {
  // Only the data
  const tbc0 = linechart({
    data: [50, 100, 30],
  });
  assertEquals(typeof tbc0, "string");

  pairs.push([tbc0, "Only data"]);
});

afterAll(() => {
  buildGalleryPage("Line Chart Revamped", pairs);
});
