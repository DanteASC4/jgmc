import {
	asPercent,
	autoBarWidth,
	autoGap,
	autoMaxNumerical,
	type BarChartStackedOptions,
	calcBarCoords,
	calcBarDims,
	calcBarLabelCoords,
	calcDataLabelCoords,
	fillEmptyArray,
	fillStrings,
	getOnlyItemOrWrap,
	randId,
	type StringOrNumber,
	stackedToSummed,
} from "@jgmc/core";
import {
	createBarChartMask,
	createLinearGradient,
} from "./creating/gradients.ts";
import { createImageLabel, createTextLabel } from "./creating/labels.ts";
import { createRect, createSvg } from "./creating/svg.ts";

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
	const exceedsWidth = asNumerical.some((v) => v > vWidth);
	const exceedsHeight = asNumerical.some((v) => v > vHeight);

	let trueVWidth: StringOrNumber = vWidth;
	let trueVHeight: StringOrNumber = vHeight;

	if (topOrBot) {
		if (exceedsHeight) {
			trueVHeight = max ? max : largest;
		}
		if (exceedsWidth) {
			trueVWidth = max ? max : largest;
		}
	}

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
	const createdBars = [];
	const createdMaskingBars = [];
	const createdLabels = [];
	const createdDataLabels = [];

	for (let i = 0; i < data.length; i++) {
		const datap = data[i];
		const datapNum = asNumerical[i];

		let color: string | string[] = ["#ffffff", "#aaaaaa"];

		if (isGradient && gradientId) {
			if (gradientMode === "continuous") color = "transparent";
			else color = `url('#${gradientId}')`;
		} else if (fillColors && fillColors.length > 0) {
			color = fillColors[i % fillColors.length];
		}

		const labelColor = getOnlyItemOrWrap(labelColors, i);

		const strokeColor = getOnlyItemOrWrap(strokeColors, i);

		const strokeWidth = strokeWidths
			? getOnlyItemOrWrap(strokeWidths, i)
			: undefined;

		const dataLabelColor = labelColor;

		const [trueBarHeight, trueBarWidth] = calcBarDims(
			placement,
			datapNum,
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

		for (let si = 0; si < datap.length; si++) {
			const subDatap = datap[si];
			const offset = datap.slice(0, si).reduce((c, p) => c + p, 0);
			const segColor =
				typeof color === "string" ? color : color[si % color.length];

			let barSeg = "";
			if (topOrBot) {
				barSeg = createRect(
					barX,
					barY + offset,
					trueBarWidth,
					subDatap,
					segColor,
					strokeColor,
					strokeWidth,
				);
				if (gradientMode === "continuous" && gradientId) {
					createdMaskingBars.push(
						createRect(
							barX,
							barY + offset,
							trueBarWidth,
							subDatap,
							"#ffffff",
							strokeColor,
							strokeWidth,
						),
					);
				}
			} else {
				barSeg = createRect(
					barX + offset,
					barY,
					subDatap,
					trueBarHeight,
					segColor,
					strokeColor,
					strokeWidth,
				);
				if (gradientMode === "continuous" && gradientId) {
					createdMaskingBars.push(
						createRect(
							barX + offset,
							barY,
							subDatap,
							trueBarHeight,
							"#ffffff",
							strokeColor,
							strokeWidth,
						),
					);
				}
			}
			createdBars.push(barSeg);
		}

		if (hasLabels) {
			if (imageLabels?.[i]) {
				const [labelX, labelY] = calcBarLabelCoords(
					placement,
					barX,
					barY,
					trueBarWidth,
					trueBarHeight,
				);
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

				createdLabels.push(
					createImageLabel(
						imageLabel,
						labelX + xOffset,
						labelY + yOffset,
						labelColor,
						subgrouping,
					),
				);
			} else if (hasNormalLabels && labels?.[i]) {
				const label = labels[i];
				const [labelX, labelY] = calcBarLabelCoords(
					placement,
					barX,
					barY,
					trueBarWidth,
					trueBarHeight,
				);
				createdLabels.push(createTextLabel(label, labelX, labelY, labelColor));
			}

			if (dataLabels) {
				const [dataLabelX, dataLabelY] = calcDataLabelCoords(
					placement,
					barX,
					barY,
					trueBarWidth,
					trueBarHeight,
				);
				const dataLabelText =
					dataLabels === "literal"
						? `${datap}`
						: `${asPercent(datapNum, sum).toFixed(1)}%`;
				const dataLabel = createTextLabel(
					dataLabelText,
					dataLabelX,
					dataLabelY,
					dataLabelColor,
				);
				createdDataLabels.push(dataLabel);
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
			const [maskId, theMask] = createBarChartMask(createdMaskingBars);
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
	svgBody += createdBars.join("");
	if (hasLabels) svgBody += createdLabels.join("");
	if (dataLabels) svgBody += createdDataLabels.join("");

	const svg = createSvg(trueVWidth, trueVHeight, width, height, svgBody);

	return svg;
}
