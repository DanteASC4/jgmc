import { createSVGElement, makeSVGParent } from "./creating/common.ts";
import { createLinearGradient, createLinesMask } from "./creating/gradients.ts";
import { createImageLabel, createLabel } from "./creating/labels.ts";
import {
	createLineDataLabels,
	drawLineSmooth,
	drawLineStraight,
} from "./creating/linechart.ts";
import { roundUpTo100 } from "./math/common.ts";
import { autoOffset, genCoordsStraight } from "./math/linecharts.ts";
import type { LineChartOptions } from "./types.ts";
import { ClassNameDefaults } from "./utils/defaults.ts";
import {
	autoMaxNumerical,
	autoMinNumerical,
} from "./utils/general-operations.ts";
import { getSingleOrWrap } from "./utils/get-single-or-wrap.ts";

export const LineChartDefaults = {
	min: 0,
	height: 200,
	width: 300,
	lineType: "straight",
} satisfies { [K in keyof LineChartOptions]?: LineChartOptions[K] };

export function linechart({
	data,
	labels = [],
	labelColors,
	dataLabels,
	imageLabels,
	height,
	width,
	vWidth,
	vHeight,
	min = 0,
	max,
	lineType = ["straight"],
	fullWidthLine = false,
	cap = ["round"],
	thickness,
	colors,
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
	if (!min)
		min = asNumerical.some((v) => v < 0) ? autoMinNumerical(asNumerical) : 0;
	if (!max) max = autoMaxNumerical(asNumerical);
	if (!height) height = max + 10;
	if (min < 0) height += min * -1;
	if (!width) width = roundUpTo100(max > height ? max : height) + 100;

	// TODO when making negative numbers work

	if (!vWidth) vWidth = width;
	if (!vHeight) vHeight = height;

	const parent = makeSVGParent(vWidth, vHeight, width, height, 0, min);

	let isGradient = false;
	let gradientId: string | null = null;
	let gradientDef: SVGElement | null = null;
	let gradientBg: SVGElement | null = null;

	if (gradientColors) {
		isGradient = true;
		if (!gradientMode) gradientMode = "individual";

		const [gradDef, gradId, gradBg] = createLinearGradient(
			gradientColors,
			gradientDirection,
			gradientMode,
		);
		gradientId = gradId;
		gradientDef = gradDef;
		gradientBg = gradBg;
	}
	if (gradientDef) parent.appendChild(gradientDef);

	let lineColor: string = "#ffffff";
	if (isGradient && gradientId) {
		if (gradientMode === "continuous") lineColor = "transparent";
		else lineColor = `url('#${gradientId}')`;
	}
	//  else if (color) {
	// 	lineColor = color;
	// }

	const lineGroup = createSVGElement("g");
	const labelGroup = createSVGElement("g");
	const datalabelTextGroup = createSVGElement("g");
	const imageLabelGroup = createSVGElement("g");

	labelGroup.classList.add(ClassNameDefaults.labelGroupClass);
	datalabelTextGroup.classList.add(ClassNameDefaults.dataLabelGroupClass);
	imageLabelGroup.classList.add(ClassNameDefaults.imageLabelGroupClass);

	const subgrouping = imageLabels?.some(
		(item) => item.topText || item.bottomText,
	);
	const sum =
		dataLabels === "percentage"
			? asNumerical.flat().reduce((a, b) => a + b, 0)
			: 0;

	const lines = [];
	const imageLabelOffset = 25;
	const labelOffset = 15;

	for (let i = 0; i < data.length; i++) {
		const lineData = data[i];
		const thick = thickness
			? getSingleOrWrap(thickness, i)
			: strokeWidths
				? getSingleOrWrap(strokeWidths, i)
				: 3;
		// const thick = thickness ? thickness[i % thickness.length] : 3;
		const dataPointsAmt = lineData.length;
		const offset = autoOffset(width, dataPointsAmt - (fullWidthLine ? 1 : 0));
		const nonGradientLineColor =
			colors && !isGradient ? getSingleOrWrap(colors, i) : "#ffffff";
		const lineCap = cap[i % cap.length];

		const coords = genCoordsStraight(lineData, offset, vHeight, min);
		// Future me, ended up not needing any control point calculation here
		// Ended up only needing a first control point thanks to reflection
		// const controls = genControlPoints(coords);
		// const controlPoint = genSingleControlPoint(coords[0], coords[1]);
		const currentLineType = lineType[i % lineType.length];
		let line: SVGPathElement;
		if (currentLineType === "straight") {
			line = drawLineStraight(
				coords,
				isGradient ? lineColor : nonGradientLineColor,
				thick,
				lineCap,
			);
		} else {
			line = drawLineSmooth(
				coords,
				isGradient ? lineColor : nonGradientLineColor,
				thick,
				lineCap,
			);
		}

		const labelColor = labelColors
			? getSingleOrWrap(labelColors, i)
			: "#ffffff";

		// Image labels & normal labels are to be applied only on the last point
		if (imageLabels && imageLabels.length > 0) {
			const lastCoord = coords[coords.length - 1];

			const imageLabel = imageLabels[i % imageLabels.length];
			// Static offsets here because lines don't have placement options

			let adjustedY = lastCoord[1];

			if (adjustedY <= 20) {
				adjustedY += imageLabel.width ?? 50 / 2;
			} else if (adjustedY >= vHeight - 20) {
				adjustedY -= imageLabel.width ?? 50 / 2;
			}

			const imageLabelElement = createImageLabel(
				imageLabel,
				lastCoord[0] + imageLabelOffset + (subgrouping ? 20 : 0),
				adjustedY,
				labelColor,
				subgrouping,
				imageLabel.width,
				imageLabel.height,
			);
			imageLabelGroup.appendChild(imageLabelElement);
		} else if (labels && labels.length > 0) {
			const lastCoord = coords[coords.length - 1];
			const label = labels[i % labels.length];
			const text = createLabel(
				label,
				lastCoord[0] + labelOffset,
				lastCoord[1] - labelOffset,
				labelColor,
			);
			labelGroup.appendChild(text);
		}

		if (dataLabels === "literal") {
			const lineLabelGroup = createLineDataLabels(
				coords,
				lineData.map(String),
				labelColor,
				vHeight,
			);
			datalabelTextGroup.appendChild(lineLabelGroup);
		} else if (dataLabels === "percentage") {
			const percentages = lineData.map((datap) => {
				const percentage = sum === 0 ? "0.0" : ((datap / sum) * 100).toFixed(1);
				return `${percentage}%`;
			});
			const lineLabelGroup = createLineDataLabels(
				coords,
				percentages,
				labelColor,
				vHeight,
			);
			datalabelTextGroup.appendChild(lineLabelGroup);
		}

		line.classList.add(ClassNameDefaults.pathClass);
		lineGroup.appendChild(line);
		lines.push(line);
	}

	if (
		isGradient &&
		gradientDef &&
		gradientBg &&
		gradientMode === "continuous"
	) {
		const [maskId, theMask] = createLinesMask(lines);
		gradientDef.appendChild(theMask);

		gradientBg.setAttribute("mask", `url('#${maskId}')`);
		parent.appendChild(gradientBg);
	}

	// if (hasLabels && labelGroups.length > 0)
	// 	labelGroups.forEach((lg) => parent.appendChild(lg));
	parent.appendChild(lineGroup);

	if (imageLabels && imageLabels.length > 0)
		parent.appendChild(imageLabelGroup);
	else if (labels && labels.length > 0) parent.appendChild(labelGroup);
	if (dataLabels) parent.appendChild(datalabelTextGroup);

	return parent;
}
