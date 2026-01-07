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
import type { BarChartStackedOpts } from "./types.ts";
import { BarChartDefaults, ClassNameDefaults } from "./utils/defaults.ts";
import {
	autoMaxNumerical,
	stackedToSummed,
} from "./utils/general-operations.ts";
import { fillEmptyArray, fillStrings } from "./utils/misc.ts";

export function barchartStacked({
	data,
	labels = [],
	labelColors,
	dataLabels,
	imageLabels,
	height = BarChartDefaults.size,
	width = BarChartDefaults.size,
	vWidth,
	vHeight,
	gap,
	max,
	placement,
	barWidth,
	// groupClass,
	// parentClass,
	// barClass,
	// labelClass,
	// dataLabelClass,
	// imageLabelTextClass,
	// imageLabelClass,
	// barGroupClass,
	// labelGroupClass,
	// dataLabelGroupClass,
	// imageLabelSubGroupClass,
	// imageLabelContainerClass,
	fillColors,
	strokeColors,
	strokeWidths,
	// colors,
	// labelColors,
	gradientColors,
	gradientMode,
	gradientDirection,
	classes
}: BarChartStackedOpts) {
	const asNumerical = stackedToSummed(data);
	let userMax = false;
	if (max) userMax = true;
	const largest = autoMaxNumerical(asNumerical);
	// if (!max) max = autoMaxNumerical(asNumerical);
	// if (!min) min = BarChartDefaults.min;
	// if (!height) height = BarChartDefaults.size;
	// if (!width) width = BarChartDefaults.size;
	// if (!gap) gap = BarChartDefaults.gap;
	if (!vWidth) vWidth = width;
	if (!vHeight) vHeight = height;
	if (!placement) placement = BarChartDefaults.placement;

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

	const barGroup = createSVGElement("g");
	const textGroup = createSVGElement("g");
	const datalabelTextGroup = createSVGElement("g");
	const imageLabelGroup = createSVGElement("g");

	if (classes?.groupClass) {
		barGroup.classList.add(classes.groupClass);
		textGroup.classList.add(classes.groupClass);
	}
	if (classes?.barGroupClass) barGroup.classList.add(classes.barGroupClass);
	if (classes?.labelGroupClass) textGroup.classList.add(classes.labelGroupClass);
	if (dataLabels && classes?.dataLabelGroupClass) {
		datalabelTextGroup.classList.add(classes.dataLabelGroupClass);
	}
	if (classes?.imageLabelContainerClass) {
		imageLabelGroup.classList.add(classes.imageLabelContainerClass);
	}

	barGroup.classList.add("tmc-bargroup");
	textGroup.classList.add(ClassNameDefaults.labelGroupClass);
	datalabelTextGroup.classList.add(ClassNameDefaults.dataLabelGroupClass);
	imageLabelGroup.classList.add(ClassNameDefaults.imageLabelGroupClass);

	const subgrouping = imageLabels?.some(
		(item) => item.topText || item.bottomText,
	);
	const sum =
		dataLabels === "percentage" ? asNumerical.reduce((a, b) => a + b, 0) : 0;
	const bars: SVGElement[] = [];

	for (let i = 0; i < data.length; i++) {
		const label = labels[i];
		const datap = data[i];
		const datapNumerical = asNumerical[i];

		let color: string | string[] = ["#ffffff", "#aaaaaa"];

		if (isGradient && gradientId) {
			if (gradientMode === "continuous") color = "transparent";
			else color = `url('#${gradientId}')`;
		} else if (fillColors && fillColors.length > 0) {
			color = fillColors[i % fillColors.length];
			// color = fillColors[i % fillColors.length];
		}

		let stroke: string | undefined;
		if (strokeColors && strokeColors.length > 0) {
			stroke = strokeColors[i % strokeColors.length];
		}

		let strokeWidth: number | undefined;
		if (strokeWidths && strokeWidths.length > 0) {
			strokeWidth = strokeWidths[i % strokeWidths.length];
		}

		const labelColor = labelColors
			? labelColors[i % labelColors.length]
			: "#ffffff";
		const dataLabelColor = "#000000";

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

			if (stroke) seg.setAttribute("stroke", stroke);
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
			if (classes?.barClass) seg.classList.add(classes.barClass);
			barGroup.appendChild(seg);
			if (gradientMode === "continuous" && gradientId) bars.push(seg);
		}

		// Coordinates for label placement derived from shared helper
		const [labelX, labelY] = calcLabelCoords(
			placement,
			barX,
			barY,
			trueBarWidth,
			trueBarHeight,
		);

		if (imageLabels && imageLabels.length > 0) {
			const imageLabel = imageLabels[i % imageLabels.length];

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
				classes?.imageLabelTextClass,
				classes?.imageLabelClass,
				classes?.imageLabelSubGroupClass,
				imageLabel.width,
				imageLabel.height,
			);
			imageLabelGroup.appendChild(imageLabelElement);
		} else if (labels && labels.length > 0) {
			const text = createLabel(label, labelX, labelY, labelColor);
			if (classes?.labelClass) text.classList.add(classes.labelClass);
			textGroup.appendChild(text);
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
				String(datapNumerical),
				dataLabelX,
				dataLabelY,
				dataLabelColor,
			);
			if (classes?.dataLabelClass) dataLabel.classList.add(classes.dataLabelClass);
			datalabelTextGroup.appendChild(dataLabel);
		} else if (dataLabels === "percentage") {
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
			if (classes?.dataLabelClass) dataLabel.classList.add(classes.dataLabelClass);
			datalabelTextGroup.appendChild(dataLabel);
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
	if (imageLabels && imageLabels.length > 0) {
		parent.appendChild(imageLabelGroup);
	} else if (labels && labels.length > 0) parent.appendChild(textGroup);
	if (dataLabels) parent.appendChild(datalabelTextGroup);

	if (classes?.parentClass) parent.classList.add(classes.parentClass);

	return parent;
}
