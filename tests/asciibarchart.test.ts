import { assertEquals, assertMatch, assertStringIncludes } from "@std/assert";
import { asciiBarchart } from "../src/asciibarchart.ts";

// biome-ignore lint/suspicious/noControlCharactersInRegex: just used for testing purposes
const stripAnsi = (value: string) => value.replace(/\u001b\[[0-9;]*m/g, "");

const render = (
	options: Parameters<typeof asciiBarchart>[0],
	{ stripColors = true }: { stripColors?: boolean } = {},
) => {
	const output = asciiBarchart(options);
	return stripColors ? stripAnsi(output) : output;
};

Deno.test(function asciiBarChartDefaultTopRendersAxisBarsAndLiteralLabels() {
	const output = render({
		data: [50, 100, 30],
		barWidth: 3,
		height: 12,
		width: 20,
	});

	assertStringIncludes(output, "0");
	assertStringIncludes(output, "100");
	assertMatch(output, /▁+/);
	assertMatch(output, /█+/);
	assertStringIncludes(output, "50");
	assertStringIncludes(output, "30");
});

Deno.test(function asciiBarChartDataLabelsForOtherPlacements() {
	const placements = ["top", "left", "right", "bottom"] as const;

	for (const placement of placements) {
		const output = stripAnsi(
			asciiBarchart({
				data: [41, 67, 23],
				barWidth: 3,
				placement,
				height: 12,
				width: 20,
				dataLabels: "literal",
			}),
		);

		assertEquals(output.includes("41"), true);
		assertEquals(output.includes("23"), true);
	}
});

Deno.test(function asciiBarChartHorizontalDataLabelsSitAgainstBars() {
	const leftOutput = stripAnsi(
		asciiBarchart({
			data: [41, 67, 23],
			barWidth: 3,
			placement: "left",
			height: 12,
			width: 20,
			dataLabels: "literal",
		}),
	);
	const rightOutput = stripAnsi(
		asciiBarchart({
			data: [41, 67, 23],
			barWidth: 3,
			placement: "right",
			height: 12,
			width: 20,
			dataLabels: "literal",
		}),
	);

	assertEquals(/█+41/.test(leftOutput), true);
	assertEquals(/41█+/.test(rightOutput), true);
});

Deno.test(function asciiBarChartPercentageLabelsRender() {
	const output = render({
		data: [1, 3],
		barWidth: 3,
		placement: "bottom",
		height: 12,
		width: 20,
		dataLabels: "percentage",
	});

	assertStringIncludes(output, "25%");
	assertStringIncludes(output, "75%");
});

Deno.test(function asciiBarChartSupportsCustomLabelFunctionAndTruncatesTitle() {
	const output = render({
		data: [12, 24],
		barWidth: 3,
		placement: "top",
		height: 8,
		width: 10,
		title: "A very long title that should truncate",
		dataLabels: (value, index) => `v${index}:${value}`,
	});

	assertStringIncludes(output, "A ver");
	assertStringIncludes(output, "v0");
	assertStringIncludes(output, "v1");
});

Deno.test(function asciiBarChartUsesRequestedCharacterAndAppliesColors() {
	const output = render(
		{
			data: [10, 20],
			barCharacter: "light",
			placement: "left",
			barWidth: 2,
			height: 10,
			width: 20,
			colors: ["red"],
			dataLabels: "literal",
			dataLabelColors: ["blue"],
		},
		{ stripColors: false },
	);

	assertStringIncludes(output, "░");

	// biome-ignore lint/suspicious/noControlCharactersInRegex: just used for testing purposes
	assertMatch(output, /\u001b\[[0-9;]*m/);
});

Deno.test(function asciiBarChartSmallPositiveDatasetsUseTenAsAutoMaxFloor() {
	const output = render({
		data: [1, 3, 4],
		barWidth: 3,
		placement: "top",
		height: 12,
		width: 20,
	});

	assertStringIncludes(output, "10");
	assertStringIncludes(output, "4");
	assertMatch(output, /█+/);
});
