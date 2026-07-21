import { expect, test } from "vitest";
import { render } from "vitest-browser-svelte";
import BarChart from "../../../packages/svelte/src/lib/BarChart.svelte";

test("renders one bar for each data point", async () => {
	const screen = await render(BarChart, {
		data: [50, 100, 30],
	});

	const svg = screen.baseElement.querySelector("svg");
	const bars = Array.from(screen.baseElement.querySelectorAll(".jgmc-rect"));

	expect(svg).not.toBeNull();
	expect(svg?.getAttribute("width")).toBe("300");
	expect(svg?.getAttribute("height")).toBe("300");
	expect(svg?.getAttribute("viewBox")).toBe("0 0 300 300");
	expect(bars).toHaveLength(3);
	expect(bars.map((bar) => bar.getAttribute("height"))).toEqual([
		"50",
		"100",
		"30",
	]);
});

test("renders labels and data labels", async () => {
	const screen = await render(BarChart, {
		data: [50, 100, 30],
		labels: ["A", "B", "C"],
		dataLabels: "literal",
	});

	const text = Array.from(screen.baseElement.querySelectorAll(".jgmc-text"));

	expect(text).toHaveLength(6);
	expect(text.map((element) => element.textContent?.trim())).toEqual([
		"A",
		"50",
		"B",
		"100",
		"C",
		"30",
	]);
});
