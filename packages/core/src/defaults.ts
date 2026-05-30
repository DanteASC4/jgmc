import type {
	BarChartNumericalOptions,
	BarChartStackedOptions,
	DonutChartOptions,
	LineChartOptions,
	PieChartOptions,
} from "$types";

export const BarChartDefaults = {
	height: 300,
	width: 300,
	gap: 3,
	placement: "bottom",
	fillColors: "#ffffff",
	labelColors: "#ffffff",
} satisfies {
	[K in keyof BarChartNumericalOptions]?: BarChartNumericalOptions[K];
};

export const BarChartStackedDefaults = {
	height: 300,
	width: 300,
	gap: 3,
	placement: "bottom",
	fillColors: ["#ffffff", "#aaaaaa"],
	labelColors: "#ffffff",
} satisfies { [K in keyof BarChartStackedOptions]?: BarChartStackedOptions[K] };

export const DonutChartDefaults = {
	size: 300,
	padding: 15,
	centerLabelFontSize: 32,
	centerLabelFontWeight: "bold",
	centerLabelFontFamily: "monospace",
	centerLabelColor: "#000000",
	fillColors: "#ffffff",
	labelColors: "#000000",
} satisfies { [K in keyof DonutChartOptions]?: DonutChartOptions[K] };

export const LineChartDefaults = {
	min: 0,
	height: 200,
	width: 300,
	lineType: "straight",
	colors: "#ffffff",
	labelColors: "#ffffff",
	fullWidthLine: false,
	cap: "round",
} satisfies { [K in keyof LineChartOptions]?: LineChartOptions[K] };

export const PieChartDefaults = {
	size: 300,
	padding: 15,
	centerLabelFontSize: 32,
	centerLabelFontWeight: "bold",
	centerLabelFontFamily: "monospace",
	centerLabelColor: "#000000",
	fillColors: "#ffffff",
	labelColors: "#000000", // Labels are on top of slices here
} satisfies { [K in keyof PieChartOptions]?: PieChartOptions[K] };
