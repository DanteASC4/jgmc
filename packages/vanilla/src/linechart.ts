import {
	asPercent,
	autoMaxNumerical,
	autoMinNumerical,
	autoOffset,
	calcSmoothControlPoints,
	genCoordsStraight,
	getOnlyItemOrWrap,
	type LineChartOptions,
	randId,
	roundUpTo100,
} from "@jgmc/core";
import {
	createLinearGradient,
	createPathChartMask,
} from "./creating/gradients.ts";
import { createImageLabel, createTextLabel } from "./creating/labels.ts";
import { createPath, createSvg } from "./creating/svg.ts";

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

export function linechart({
	data,
	labels,
	labelColors = LineChartDefaults.labelColors,
	dataLabels,
	imageLabels,
	height,
	width,
	vWidth,
	vHeight,
	min = LineChartDefaults.min,
	max,
	lineType = LineChartDefaults.lineType,
	fullWidthLine = LineChartDefaults.fullWidthLine,
	cap = [LineChartDefaults.cap],
	thickness,
	colors = LineChartDefaults.colors,
	strokeWidths,
	gradientColors,
	gradientMode,
	gradientDirection,
}: Omit<LineChartOptions, "strokeColors">) {
	// Arrays, arrays everywhere!
	if (data.every((item) => typeof item === "number")) data = [data];
	// if (labels.every((l) => typeof l === "string")) labels = [labels];
	if (typeof colors === "string") colors = [colors];
	// if (typeof labelColors === "string") labelColors = [labelColors];
	if (typeof thickness === "number") thickness = [thickness];
	if (typeof lineType === "string") lineType = [lineType];
	if (typeof cap === "string") cap = [cap];
	const asNumerical = data.flat();
	if (!min) {
		min = asNumerical.some((v) => v < 0) ? autoMinNumerical(asNumerical) : 0;
	}
	if (!max) max = autoMaxNumerical(asNumerical);
	if (!height) height = max + 10;
	if (min < 0) height += min * -1;
	if (!width) width = roundUpTo100(max > height ? max : height) + 100;

	// TODO when making negative numbers work

	if (!vWidth) vWidth = width;
	if (!vHeight) vHeight = height;

	let isGradient = false;
	let gradientId: string | null = null;
	let gradientDef: string | null = null;
	let gradientBg: string | null = null;

	if (gradientColors) {
		isGradient = true;
		gradientId = randId();
		if (!gradientMode) gradientMode = "individual";
	}
	const hasNormalLabels = labels && labels.length > 0;
	const hasImageLabels = imageLabels && imageLabels.length > 0;
	const hasLabels = hasNormalLabels || dataLabels || hasImageLabels;

	const subgrouping = imageLabels?.some(
		(item) => item.topText || item.bottomText,
	);
	const sum =
		dataLabels === "percentage" ? asNumerical.reduce((a, b) => a + b, 0) : 0;
	const imageLabelOffset = 25;
	const labelOffset = 15;

	const createdLines: string[] = [];
	const createdMaskingLines: string[] = [];
	const createdLabels: string[] = [];
	const createdDataLabels: string[] = [];

	for (let i = 0; i < data.length; i++) {
		const lineData = data[i];
		const thick = thickness
			? getOnlyItemOrWrap(thickness, i)
			: strokeWidths
				? getOnlyItemOrWrap(strokeWidths, i)
				: 3;
		const dataPointsAmt = lineData.length;
		const offset = autoOffset(width, dataPointsAmt - (fullWidthLine ? 1 : 0));
		const lineColor = getOnlyItemOrWrap(colors, i);
		const lineCap = getOnlyItemOrWrap(cap, i);
		const lineTypeForLine = getOnlyItemOrWrap(lineType, i);
		const labelColor = getOnlyItemOrWrap(labelColors, i);
		const coords = genCoordsStraight(lineData, offset, vHeight, min);
		let theLine = "";
		let drawAttr = "";
		if (lineTypeForLine === "straight") {
			drawAttr += `M 0, ${coords[0][1]} L`;
			for (let i = 0; i < coords.length; i++) {
				drawAttr += ` ${coords[i][0]}, ${coords[i][1]}`;
			}
			// theLine += createPath(drawAttr, lineColor, thick, lineCap);
			theLine += createPath(drawAttr, {
				stroke: lineColor,
				strokeWidth: thick,
				linecap: lineCap,
			});
			createdLines.push(theLine);
		} else {
			drawAttr += `M ${coords[0][0]},${coords[0][1]} `;
			for (let i = 0; i < coords.length - 1; i++) {
				const fromC = coords[i];
				const toC = coords[i + 1];

				const controls = calcSmoothControlPoints(fromC, toC);

				if (i === 0) {
					drawAttr += `C ${controls[0]},${controls[1]} ${controls[2]},${
						controls[3]
					} ${toC[0]},${toC[1]} `;
				} else {
					drawAttr += ` ${controls[0]},${controls[1]} ${controls[2]},${
						controls[3]
					} ${toC[0]},${toC[1]} `;
				}
			}

			theLine += createPath(
				drawAttr,
				{
					linecap: lineCap,
					stroke: lineColor,
					strokeWidth: thick,
				},
				[["stroke-linejoin", "round"]],
			);
			createdLines.push(theLine);
		}

		// Only the last point gets labels
		if (hasLabels && i === data.length - 1) {
			if (imageLabels?.[i]) {
				const lastCoord = coords[coords.length - 1];
				const imageLabel = imageLabels[i];

				let labelY = lastCoord[1];
				if (labelY <= 20) labelY += (imageLabel.width ?? 50) / 2;
				else if (labelY >= vHeight - 20) labelY -= (imageLabel.width ?? 50) / 2;

				createdLabels.push(
					createImageLabel(
						imageLabel,
						lastCoord[0] + imageLabelOffset + (subgrouping ? 20 : 0),
						labelY,
						labelColor,
						subgrouping,
						imageLabel.width,
						imageLabel.height,
					),
				);
			} else if (labels?.[i]) {
				const lastCoord = coords[coords.length - 1];
				const label = labels[i];
				createdLabels.push(
					createTextLabel(
						label,
						lastCoord[0] + labelOffset,
						lastCoord[1] - labelOffset,
						labelColor,
					),
				);
			}

			if (dataLabels === "literal") {
				const lastCoord = coords[coords.length - 1];
				const dataLabel = data[i][data[i].length - 1];
				createdDataLabels.push(
					createTextLabel(
						`${dataLabel}`,
						lastCoord[0] + labelOffset,
						lastCoord[1] - labelOffset,
						labelColor,
					),
				);
			} else if (dataLabels === "percentage") {
				const lastCoord = coords[coords.length - 1];
				const dataLabel = asPercent(data[i][data[i].length - 1], sum).toFixed(
					1,
				);
				createdDataLabels.push(
					createTextLabel(
						`${dataLabel}%`,
						lastCoord[0] + labelOffset,
						lastCoord[1] - labelOffset,
						labelColor,
					),
				);
			}
		}
	}

	if (isGradient && gradientColors && gradientMode && gradientId) {
		if (gradientMode === "individual") {
			const [gradDef, gradBg] = createLinearGradient(
				gradientColors,
				gradientDirection,
				gradientMode,
				gradientId,
			);
			gradientDef = gradDef;
			gradientBg = gradBg;
		} else if (gradientMode === "continuous") {
			const [maskId, theMask] = createPathChartMask(createdMaskingLines);
			const [gradDef, gradBg] = createLinearGradient(
				gradientColors,
				gradientDirection,
				gradientMode,
				gradientId,
				theMask,
				maskId,
			);
			gradientDef = gradDef;
			gradientBg = gradBg;
		}
	}

	let svgBody = "";

	if (gradientDef) svgBody += gradientDef;
	if (gradientBg) svgBody += gradientBg;
	svgBody += createdLines.join("");
	if (hasLabels) svgBody += createdLabels.join("");
	if (dataLabels) svgBody += createdDataLabels.join("");

	const svg = createSvg(vWidth, vHeight, width, height, svgBody);

	return svg;
}
