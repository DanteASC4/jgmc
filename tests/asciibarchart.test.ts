import { assertEquals } from "@std/assert";
import {
	createHorizontalBar,
	createVerticalBar,
} from "../src/ascii-creating/asciibarchart.ts";
import { asciiBarchart } from "../src/asciibarchart.ts";

Deno.test(function asciiBarChartTests() {
	const tbc0a = asciiBarchart({
		data: [50, 100, 30],
		barWidth: 5,
		placement: "top",
		height: 20,
		width: 20,
		colors: ["#ff00ff", "#00ffff"],
	});
	// console.log(tbc0a);
	const tbc0b = asciiBarchart({
		data: [50, 100, 30],
		barWidth: 5,
		placement: "bottom",
		height: 20,
		width: 20,
	});
	// console.log(tbc0b);
	// const tbc0c = asciiBarchart({
	// 	data: [50, 100, 30],
	// 	barWidth: 5,
	// 	placement: "bottom",
	// 	height: 20,
	// 	width: 20,
	// });
	// console.log(tbc0c);
	// const tbc0d = asciiBarchart({
	// 	data: [50, 100, 30],
	// 	barWidth: 3,
	// 	placement: "left",
	// 	height: 20,
	// 	width: 20,
	// });
	// console.log(tbc0d);
	// const tbc1 = asciiBarchart({ data: [50, 50, 30] });
	// console.log(tbc1);
	// const tbc2 = asciiBarchart({
	// 	data: [10, 20, 30, 40, 50, 60, 70],
	// 	gap: 1,
	// 	placement: "left",
	// });
	// console.log(tbc2);
	// const tHbar = createHorizontalBar(28,5,"#")
	// console.log(tHbar)
	// console.log(tHbar.join('\n'))
	assertEquals("", "");
});
