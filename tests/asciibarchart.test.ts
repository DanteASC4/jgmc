import { assertEquals } from "@std/assert";
import { asciiBarchart } from "../src/asciibarchart.ts";

Deno.test(function asciiBarChartTests() {
	const tbc0 = asciiBarchart({
		data: [50, 100, 30],
		barWidth: 10,
		placement: "bottom",
	});
	console.log(tbc0);
	const tbc1 = asciiBarchart({ data: [50, 50, 30] });
	console.log(tbc1);
	const tbc2 = asciiBarchart({
		data: [10, 20, 30, 40, 50, 60, 70],
		gap: 1,
		placement: "bottom",
	});
	console.log(tbc2);
	assertEquals("", "");
});
