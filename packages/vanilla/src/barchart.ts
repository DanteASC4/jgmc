import {
	autoBarWidth,
	autoGap,
	autoMaxNumerical,
	BarChartDefaults,
	type BarChartNumericalOptions,
	calcBarCoords,
	calcBarDims,
	calcBarLabelCoords,
	calcDataLabelCoords,
	calcImageLabelOffset,
	getDataLabelText,
	getOnlyItemOrWrap,
	randId,
	type StringOrNumber,
} from "@jgmc/core";
import {
	createBarChartMask,
	createLinearGradient,
} from "./creating/gradients.ts";
import { createImageLabel, createTextLabel } from "./creating/labels.ts";
import { createRect, createSvg } from "./creating/svg.ts";

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
	const largest = autoMaxNumerical(data);

	if (!vWidth) vWidth = width;
	if (!vHeight) vHeight = height;

	const hasNormalLabels = labels && labels.length > 0;
	const hasImageLabels = imageLabels && imageLabels.length > 0;
	const hasLabels = hasNormalLabels || dataLabels || hasImageLabels;

	const dataPointsAmt = hasLabels
		? Math.max(
				data.length,
				labels ? labels.length : imageLabels ? imageLabels.length : 0,
			)
		: data.length;

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
	const topOrBot = placement === "top" || placement === "bottom";
	const exceedsWidth = data.some((v) => v > vWidth);
	const exceedsHeight = data.some((v) => v > vHeight);

	let trueVWidth: StringOrNumber = vWidth;
	let trueVHeight: StringOrNumber = vHeight;

	if (topOrBot) {
		if (exceedsHeight) {
			trueVHeight = max ? max : largest;
		}
	} else {
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

	const subgrouping = imageLabels?.some(
		(item) => item.topText || item.bottomText,
	);
	const sum = dataLabels === "percentage" ? data.reduce((a, b) => a + b, 0) : 0;
	const createdBars = [];
	const createdMaskingBars = [];
	const createdLabels = [];
	const createdDataLabels = [];

	for (let i = 0; i < dataPointsAmt; i++) {
		const datap = data[i] ?? 0;
		let color = getOnlyItemOrWrap(fillColors, i);
		if (isGradient && gradientId) {
			if (gradientMode === "continuous") color = "transparent";
			else color = `url('#${gradientId}')`;
		}

		const labelColor = getOnlyItemOrWrap(labelColors, i);
		const dataLabelColor = labelColor; // for now, we use the same color for both, but we could easily allow separate colors for data labels and normal labels in the future
		const strokeColor = strokeColors
			? getOnlyItemOrWrap(strokeColors, i)
			: undefined;
		const strokeWidth = strokeWidths
			? getOnlyItemOrWrap(strokeWidths, i)
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
			trueVWidth,
			trueVHeight,
			evenWidth,
			barWidth ?? evenWidth,
			trueBarWidth,
			trueBarHeight,
		);

		createdBars.push(
			createRect(
				barX,
				barY,
				trueBarWidth,
				trueBarHeight,
				color,
				strokeColor,
				strokeWidth,
			),
		);

		if (gradientMode === "continuous" && gradientId)
			createdMaskingBars.push(
				createRect(
					barX,
					barY,
					trueBarWidth,
					trueBarHeight,
					"#ffffff",
					strokeColor,
					strokeWidth,
				),
			);

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
				const [xOffset, yOffset] = calcImageLabelOffset(placement);

				createdLabels.push(
					createImageLabel(
						imageLabel,
						labelX + xOffset,
						labelY + yOffset,
						labelColor,
						subgrouping,
						imageLabel.width,
						imageLabel.height,
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
				const dataLabelText = getDataLabelText(dataLabels, datap, sum);

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
