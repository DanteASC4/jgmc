import { assertStringIncludes } from "@std/assert";
import { asciiBarchart } from "../src/asciibarchart.ts";

Deno.test(function asciiMiscTinkeringTests() {
	const output = asciiBarchart({
		data: [50, 100, 30],
		barWidth: 4,
		placement: "bottom",
		barCharacter: "light",
	});

	assertStringIncludes(output, "0");
});
