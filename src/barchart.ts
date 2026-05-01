import { createBar } from "./creating/barchart.ts";
import { createSVGElement, makeSVGParent } from "./creating/common.ts";
import {
	createBarChartMask,
	createLinearGradient,
} from "./creating/gradients.ts";
import { createImageLabel, createLabel } from "./creating/labels.ts";
import { calcBarCoords, calcBarDims } from "./math/barchart.ts";
import { autoBarWidth, calcDataLabelCoords } from "./math/barcharts-common.ts";
import { autoGap } from "./math/common.ts";
import { calcLabelCoords } from "./math/labels.ts";
import type { BarChartNumericalOptions } from "./types.ts";
import { ClassNameDefaults } from "./utils/defaults.ts";
import { autoMaxNumerical } from "./utils/general-operations.ts";
import { getSingleOrWrap } from "./utils/get-single-or-wrap.ts";
import { fillZeros } from "./utils/misc.ts";

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

export function barchart({
	data,
	labels,
	labelColors = BarChartDefaults.labelColors,
	dataLabels,
	imageLabels,
	height = BarChartDefaults.height,
	width = BarChartDefaults.width,
	vWidth,
	vHeight,
	gap,
	max,
	placement = BarChartDefaults.placement,
	barWidth,
	fillColors = BarChartDefaults.fillColors,
	strokeColors,
	strokeWidths,
	gradientColors,
	gradientMode,
	gradientDirection,
}: BarChartNumericalOptions) {
	let userMax = false;
	if (max) userMax = true;
	const largest = autoMaxNumerical(data);

	if (!vWidth) vWidth = width;
	if (!vHeight) vHeight = height;

	const padData = labels && data.length < labels.length;
	if (padData) {
		const diff = Math.abs(labels.length - data.length);
		fillZeros(data, diff);
	}
	const dataPointsAmt = data.length;
	const evenWidth =
		placement === "top" || placement === "bottom"
			? autoBarWidth(width, dataPointsAmt)
			: autoBarWidth(height, dataPointsAmt);

	if (!gap) {
		gap =
			placement === "top" || placement === "bottom"
				? autoGap(width, dataPointsAmt)
				: autoGap(height, dataPointsAmt);
	}

	// Ensure nothing is cut off, and use max if given.
	// If the `max` is not manually set, the following will ensure that any given bar is not able to exceed the axis that it stretches across.
	const topOrBot = placement === "top" || placement === "bottom";
	const parent = topOrBot
		? makeSVGParent(
				vWidth,
				userMax && typeof max === "number" ? max : vHeight,
				width,
				height,
			)
		: makeSVGParent(
				userMax && typeof max === "number" ? max : vWidth,
				vHeight,
				width,
				height,
			);

	const exceedsWidth = data.some((v) => v > vWidth);
	const exceedsHeight = data.some((v) => v > vHeight);

	if (topOrBot) {
		if (exceedsHeight) {
			parent.setAttribute(
				"viewBox",
				`0 0 ${vWidth} ${userMax ? max : largest}`,
			);
		} else {
			parent.setAttribute("viewBox", `0 0 ${vWidth} ${vHeight}`);
		}
	} else {
		if (exceedsWidth) {
			parent.setAttribute(
				"viewBox",
				`0 0 ${userMax ? max : largest} ${vHeight}`,
			);
		} else {
			parent.setAttribute("viewBox", `0 0 ${vWidth} ${vHeight}`);
		}
	}
	let isGradient = false;
	let gradientId: string | null = null;
	let gradientDef: SVGElement | null = null;
	let gradientBg: SVGElement | null = null;

	// If we're doing a gradient, build the defs
	// if it's continuous also append the background rect
	// the defs uses a copy of the chart, with the bars filled with #fff and a bg rect of #000
	// (check if we can do <use> ???)
	// then the bars are filled with transparent
	// if it's individual then the bars just get filled with a `url` call

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
	// if (gradientBg) parent.appendChild(gradientBg);

	const barGroup = createSVGElement("g");
	barGroup.classList.add("tmc-bargroup");
	const textGroup = createSVGElement("g");
	const datalabelTextGroup = createSVGElement("g");
	const imageLabelGroup = createSVGElement("g");

	textGroup.classList.add(ClassNameDefaults.labelGroupClass);
	datalabelTextGroup.classList.add(ClassNameDefaults.dataLabelGroupClass);
	imageLabelGroup.classList.add(ClassNameDefaults.imageLabelGroupClass);

	const subgrouping = imageLabels?.some(
		(item) => item.topText || item.bottomText,
	);
	const sum = dataLabels === "percentage" ? data.reduce((a, b) => a + b, 0) : 0;
	const bars = [];

	for (let i = 0; i < data.length; i++) {
		const datap = data[i];

		/*
		 * If we're doing a gradient & we have the `gradientId`
		 *  Then if it's a continuous one, fill is transparent
		 *  Else since it's not transparent, we'll fill with the gradient itself
		 * If we have a colors array
		 *  Grab the color at the current modulated (is that the right word?) index
		 *  Else fill with white
		 *
		 * Future me update:
		 * This now comes from "fillColors" but I'm going to leave the variable name as "color" for now
		 */
		let color: string = getSingleOrWrap(fillColors, i);
		if (isGradient && gradientId) {
			if (gradientMode === "continuous") color = "transparent";
			else color = `url('#${gradientId}')`;
		} else if (fillColors && fillColors.length > 0) {
			color = getSingleOrWrap(fillColors, i);
		}
		const labelColor = getSingleOrWrap(labelColors, i);

		// NOTE: Need to make it clear in docs that labelColors also applies to data labels, since they aren't meant to be used simulateously (labels & datalabels)
		const dataLabelColor = labelColor;

		const strokeColor = strokeColors
			? getSingleOrWrap(strokeColors, i)
			: undefined;

		const strokeWidth = strokeWidths
			? getSingleOrWrap(strokeWidths, i)
			: undefined;

		const [trueBarHeight, trueBarWidth] = calcBarDims(
			placement,
			datap,
			evenWidth,
			barWidth ?? evenWidth,
		);

		const [barX, barY] = calcBarCoords(
			i,
			placement,
			gap,
			width,
			height,
			evenWidth,
			barWidth ?? evenWidth,
			trueBarWidth,
			trueBarHeight,
		);

		const bar = createBar(
			barX,
			barY,
			trueBarWidth,
			trueBarHeight,
			color,
			strokeColor,
			strokeWidth,
		);
		bar.classList.add(ClassNameDefaults.rectClass);
		barGroup.appendChild(bar);

		if (imageLabels?.[i]) {
			const [labelX, labelY] = calcLabelCoords(
				placement,
				barX,
				barY,
				trueBarWidth,
				trueBarHeight,
			);
			const imageLabel = imageLabels?.[i];

			const xOffset =
				placement === "top" || placement === "bottom"
					? 0
					: placement === "left"
						? 15
						: -15;
			const yOffset =
				placement === "left" || placement === "right"
					? 0
					: placement === "top"
						? 15
						: -15;

			const imageLabelElement = createImageLabel(
				imageLabel,
				labelX + xOffset,
				labelY + yOffset,
				labelColor,
				subgrouping,
				imageLabel.width,
				imageLabel.height,
			);
			imageLabelGroup.appendChild(imageLabelElement);
		} else if (labels?.[i]) {
			const currentLabelText = labels[i];
			const [labelX, labelY] = calcLabelCoords(
				placement,
				barX,
				barY,
				trueBarWidth,
				trueBarHeight,
			);
			const label = createLabel(currentLabelText, labelX, labelY, labelColor);
			textGroup.appendChild(label);
		}

		if (dataLabels === "literal") {
			const [dataLabelX, dataLabelY] = calcDataLabelCoords(
				placement,
				barX,
				barY,
				trueBarWidth,
				trueBarHeight,
			);

			const dataLabel = createLabel(
				String(datap),
				dataLabelX,
				dataLabelY,
				dataLabelColor,
			);
			datalabelTextGroup.appendChild(dataLabel);
		} else if (dataLabels === "percentage") {
			const percentage = ((datap / sum) * 100).toFixed(1);
			const [dataLabelX, dataLabelY] = calcDataLabelCoords(
				placement,
				barX,
				barY,
				trueBarWidth,
				trueBarHeight,
			);

			const dataLabel = createLabel(
				`${percentage}%`,
				dataLabelX,
				dataLabelY,
				dataLabelColor,
			);
			datalabelTextGroup.appendChild(dataLabel);
		}

		// const [bar, text] = createBarAndText(
		// 	i,
		// 	placement,
		// 	datap,
		// 	label,
		// 	gap,
		// 	barWidth,
		// 	evenWidth,
		// 	color,
		// 	labelColor,
		// 	{ width: vWidth, height: vHeight },
		// 	{ labelClass, barClass },
		// );
		// barGroup.appendChild(bar);
		// textGroup.appendChild(text);

		// Setup for continuous gradient fill
		if (gradientMode === "continuous" && gradientId) bars.push(bar);

		// if (resultGroup) parent.appendChild(resultGroup);
	}

	if (
		isGradient &&
		gradientDef &&
		gradientBg &&
		gradientMode === "continuous"
	) {
		const [maskId, theMask] = createBarChartMask(bars);
		gradientDef.appendChild(theMask);

		gradientBg.setAttribute("mask", `url('#${maskId}')`);
		parent.appendChild(gradientBg);
	}

	parent.appendChild(barGroup);
	if (imageLabels) parent.appendChild(imageLabelGroup);
	else if (labels && labels.length > 0) parent.appendChild(textGroup);
	if (dataLabels) parent.appendChild(datalabelTextGroup);

	return parent;
}
