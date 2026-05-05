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
import type { BarChartStackedOptions } from "./types.ts";
import { ClassNameDefaults } from "./utils/defaults.ts";
import {
	autoMaxNumerical,
	stackedToSummed,
} from "./utils/general-operations.ts";
import { getSingleOrWrap } from "./utils/get-single-or-wrap.ts";
import { fillEmptyArray, fillStrings } from "./utils/misc.ts";

export const BarChartStackedDefaults = {
	height: 300,
	width: 300,
	gap: 3,
	placement: "bottom",
	fillColors: ["#ffffff", "#aaaaaa"],
	labelColors: "#ffffff",
} satisfies { [K in keyof BarChartStackedOptions]?: BarChartStackedOptions[K] };

export function barchartStacked({
	data,
	labels = [],
	labelColors = BarChartStackedDefaults.labelColors,
	dataLabels,
	imageLabels,
	height = BarChartStackedDefaults.height,
	width = BarChartStackedDefaults.width,
	vWidth,
	vHeight,
	gap,
	max,
	placement = BarChartStackedDefaults.placement,
	barWidth,
	fillColors,
	strokeColors,
	strokeWidths,
	gradientColors,
	gradientMode,
	gradientDirection,
}: BarChartStackedOptions) {
	const asNumerical = stackedToSummed(data);
	let userMax = false;
	if (max) userMax = true;
	const largest = autoMaxNumerical(asNumerical);
	if (!vWidth) vWidth = width;
	if (!vHeight) vHeight = height;

	const padLabels = labels.length < data.length;
	if (padLabels) {
		const diff = Math.abs(labels.length - data.length);
		fillStrings(labels, diff);
	}
	// this might need to be adjusted, as the logic behind this for stacked feels a bit different
	const padData = data.length < labels.length;
	if (padData) {
		const diff = Math.abs(labels.length - data.length);
		fillEmptyArray(data, diff);
	}

	const dataPointsAmt = asNumerical.length;
	const evenWidth =
		placement === "top" || placement === "bottom"
			? autoBarWidth(width, dataPointsAmt)
			: autoBarWidth(height, dataPointsAmt);

	if (!barWidth) {
		barWidth = evenWidth;
	}

	if (!gap) {
		gap =
			placement === "top" || placement === "bottom"
				? autoGap(width, dataPointsAmt)
				: autoGap(height, dataPointsAmt);
	}

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

	const exceedsWidth = asNumerical.some((v) => v > vWidth);
	const exceedsHeight = asNumerical.some((v) => v > vHeight);

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

	const hasNormalLabels = labels && labels.length > 0;
	const hasImageLabels = imageLabels && imageLabels.length > 0;
	const hasLabels = hasNormalLabels || dataLabels || hasImageLabels;

	const barGroup = createSVGElement("g");
	const textGroup = hasNormalLabels ? createSVGElement("g") : null;
	const datalabelTextGroup = dataLabels ? createSVGElement("g") : null;
	const imageLabelGroup = hasImageLabels ? createSVGElement("g") : null;

	barGroup.classList.add("tmc-bargroup");
	if (textGroup) textGroup.classList.add(ClassNameDefaults.labelGroupClass);
	if (datalabelTextGroup)
		datalabelTextGroup.classList.add(ClassNameDefaults.dataLabelGroupClass);
	if (imageLabelGroup)
		imageLabelGroup.classList.add(ClassNameDefaults.imageLabelGroupClass);

	const subgrouping = imageLabels?.some(
		(item) => item.topText || item.bottomText,
	);
	const sum =
		dataLabels === "percentage" ? asNumerical.reduce((a, b) => a + b, 0) : 0;
	const bars: SVGElement[] = [];

	for (let i = 0; i < data.length; i++) {
		const datap = data[i];
		const datapNumerical = asNumerical[i];

		// Because this function also accepts a 2d array of colors typescript gets angry when I try to use defautls, leaving as-is for now
		let color: string | string[] = ["#ffffff", "#aaaaaa"];
		if (isGradient && gradientId) {
			if (gradientMode === "continuous") color = "transparent";
			else color = `url('#${gradientId}')`;
		} else if (fillColors && fillColors.length > 0) {
			color = fillColors[i % fillColors.length];
			// color = fillColors[i % fillColors.length];
		}

		const labelColor = getSingleOrWrap(labelColors, i);

		const strokeColor = getSingleOrWrap(strokeColors, i);

		const strokeWidth = strokeWidths
			? getSingleOrWrap(strokeWidths, i)
			: undefined;

		const dataLabelColor = labelColor;

		const [trueBarHeight, trueBarWidth] = calcBarDims(
			placement,
			datapNumerical,
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

		// Draw each stacked segment relative to the base bar
		for (let si = 0; si < datap.length; si++) {
			const current = datap[si];
			const offset = datap.slice(0, si).reduce((c, p) => c + p, 0);
			const seg = createSVGElement("rect");
			if (typeof color === "string") seg.setAttribute("fill", color);
			else seg.setAttribute("fill", color[si % color.length]);

			if (strokeColor) seg.setAttribute("stroke", strokeColor);
			if (strokeWidth) seg.setAttribute("stroke-width", String(strokeWidth));

			const topOrBot = placement === "top" || placement === "bottom";
			if (topOrBot) {
				seg.setAttribute("x", String(barX));
				seg.setAttribute("y", String(barY + offset));
				seg.setAttribute("width", String(trueBarWidth));
				seg.setAttribute("height", String(current));
			} else {
				seg.setAttribute("x", String(barX + offset));
				seg.setAttribute("y", String(barY));
				seg.setAttribute("width", String(current));
				seg.setAttribute("height", String(trueBarHeight));
			}
			seg.classList.add(ClassNameDefaults.rectClass);
			barGroup.appendChild(seg);
			if (gradientMode === "continuous" && gradientId) bars.push(seg);
		}

		if (hasLabels) {
			// Coordinates for label placement derived from shared helper
			const [labelX, labelY] = calcLabelCoords(
				placement,
				barX,
				barY,
				trueBarWidth,
				trueBarHeight,
			);

			if (imageLabelGroup && imageLabels?.[i]) {
				const imageLabel = imageLabels[i];

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
			} else if (textGroup && labels?.[i]) {
				const label = labels[i];
				const text = createLabel(label, labelX, labelY, labelColor);
				textGroup.appendChild(text);
			}

			if (datalabelTextGroup && dataLabels === "literal") {
				const [dataLabelX, dataLabelY] = calcDataLabelCoords(
					placement,
					barX,
					barY,
					trueBarWidth,
					trueBarHeight,
				);
				const dataLabel = createLabel(
					String(datapNumerical),
					dataLabelX,
					dataLabelY,
					dataLabelColor,
				);
				datalabelTextGroup.appendChild(dataLabel);
			} else if (datalabelTextGroup && dataLabels === "percentage") {
				const percentage =
					sum === 0 ? "0.0" : ((datapNumerical / sum) * 100).toFixed(1);
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
		}
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
	if (imageLabelGroup && hasImageLabels) {
		parent.appendChild(imageLabelGroup);
	} else if (textGroup && hasNormalLabels) parent.appendChild(textGroup);
	
	if (datalabelTextGroup && dataLabels) parent.appendChild(datalabelTextGroup);

	return parent;
}
