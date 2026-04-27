export const BarChartDefaults = {
	min: 0,
	size: 300,
	gap: 3,
	placement: "bottom",
} as const;

export const PieChartDefaults = {
	size: 300,
	padding: 15,
} as const;

export const DonutChartDefaults = {
	size: 300,
	padding: 15,
} as const;

export const LineChartDefaults = {
	min: 0,
	height: 200,
	width: 300,
	lineType: "straight",
} as const;

export const ClassNameDefaults = {
	labelGroupClass: "tmc-label-group",
	dataLabelGroupClass: "tmc-data-label-group",
	imageLabelGroupClass: "tmc-image-label-group",
};
