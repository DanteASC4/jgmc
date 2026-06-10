import {
	autoBarWidth,
	autoGap,
	autoMaxNumerical,
	BarChartStackedDefaults,
	calcBarCoords,
	calcBarDims,
	calcBarLabelCoords,
	calcDataLabelCoords,
	calcImageLabelOffset,
	getDataLabelText,
	getOnlyItemOrWrap,
	type StringOrNumber,
	stackedToSummed,
	sumArray,
} from "@jgmc/core";
import React, { useId } from "react";
import type { BarChartStackedProps } from "$types";
import { BarChartMask, LinearGradientDefs } from "./creating/Gradients.tsx";
import { ImageLabelView, TextLabel } from "./creating/Labels.tsx";
import { Rect, Svg } from "./creating/Svg.tsx";

export const BarChartStacked = ({
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
}: BarChartStackedProps) => {
	const hasNormalLabels = labels && labels.length > 0;
	const hasImageLabels = imageLabels && imageLabels.length > 0;
	const hasLabels = hasNormalLabels || dataLabels || hasImageLabels;

	const dataPointsAmt = hasLabels
		? Math.max(
				data.length,
				labels ? labels.length : imageLabels ? imageLabels.length : 0,
			)
		: data.length;

	const paddedData = [...data];
	if (paddedData.length < dataPointsAmt) {
		const diff = dataPointsAmt - paddedData.length;
		for (let i = 0; i < diff; i++) {
			paddedData.push([]);
		}
	}

	const paddedLabels = labels ? [...labels] : [];
	if (labels && paddedLabels.length < dataPointsAmt) {
		const diff = dataPointsAmt - paddedLabels.length;
		for (let i = 0; i < diff; i++) {
			paddedLabels.push("");
		}
	}

	const asNumerical = stackedToSummed(paddedData);
	const largest = autoMaxNumerical(asNumerical);
	if (!vWidth) vWidth = width;
	if (!vHeight) vHeight = height;

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
	} else {
		if (exceedsWidth) {
			trueVWidth = max ? max : largest;
		}
	}

	let isGradient = false;
	const gradientId = useId();
	const maskId = useId();

	if (gradientColors) {
		isGradient = true;
		if (!gradientMode) gradientMode = "individual";
	}

	const subgrouping = imageLabels?.some(
		(item) => item.topText || item.bottomText,
	);
	const sum = sumArray(asNumerical);
	const createdBars = [];
	const createdMaskingBars = [];
	const createdLabels = [];
	const createdDataLabels = [];

	for (let i = 0; i < dataPointsAmt; i++) {
		const datap = paddedData[i];
		const datapNum = asNumerical[i];

		let color: string | string[] = ["#ffffff", "#aaaaaa"];
		if (isGradient) {
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
			trueVWidth,
			trueVHeight,
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

			if (topOrBot) {
				createdBars.push(
					<Rect
						key={`bar-${si}`}
						x={barX}
						y={barY + offset}
						width={trueBarWidth}
						height={subDatap}
						fill={segColor}
						stroke={strokeColor}
						strokeWidth={strokeWidth}
					/>,
				);
				if (gradientMode === "continuous") {
					createdMaskingBars.push(
						<Rect
							key={`mask-${si}`}
							x={barX}
							y={barY + offset}
							width={trueBarWidth}
							height={subDatap}
							fill="#ffffff"
							stroke={strokeColor}
							strokeWidth={strokeWidth}
						/>,
					);
				}
			} else {
				createdBars.push(
					<Rect
						key={`bar-${si}`}
						x={barX + offset}
						y={barY}
						width={subDatap}
						height={trueBarHeight}
						fill={segColor}
						stroke={strokeColor}
						strokeWidth={strokeWidth}
					/>,
				);
				if (gradientMode === "continuous") {
					createdMaskingBars.push(
						<Rect
							key={`mask-${si}`}
							x={barX + offset}
							y={barY}
							width={subDatap}
							height={trueBarHeight}
							fill="#ffffff"
							stroke={strokeColor}
							strokeWidth={strokeWidth}
						/>,
					);
				}
			}
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
				const [xOffset, yOffset] = calcImageLabelOffset(placement);

				createdLabels.push(
					<ImageLabelView
						imgLabel={imageLabel}
						x={labelX + xOffset}
						y={labelY + yOffset}
						labelColor={labelColor}
						subgrouping={subgrouping}
						key={`image-label-${i}`}
					/>,
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
				createdLabels.push(
					<TextLabel
						label={label}
						x={labelX}
						y={labelY}
						labelColor={labelColor}
						key={`label-${i}`}
					/>,
				);
			}

			if (dataLabels) {
				const [dataLabelX, dataLabelY] = calcDataLabelCoords(
					placement,
					barX,
					barY,
					trueBarWidth,
					trueBarHeight,
				);
				const dataLabelText = getDataLabelText(dataLabels, datapNum, sum);
				createdDataLabels.push(
					<TextLabel
						label={dataLabelText}
						x={dataLabelX}
						y={dataLabelY}
						labelColor={dataLabelColor}
						key={`data-label-${i}`}
					/>,
				);
			}
		}
	}

	return (
		<Svg
			width={width}
			height={height}
			vWidth={trueVWidth}
			vHeight={trueVHeight}
		>
			<title>Stacked Bar Chart</title>
			{isGradient && gradientColors && gradientMode && gradientDirection && (
				<LinearGradientDefs
					colors={gradientColors}
					gDir={gradientDirection}
					gMode={gradientMode}
					gId={gradientId}
					gMask={
						gradientMode === "continuous" && maskId ? (
							<BarChartMask maskId={maskId}>{createdMaskingBars}</BarChartMask>
						) : undefined
					}
					gMaskId={gradientMode === "continuous" && maskId ? maskId : undefined}
				/>
			)}
			{createdBars}
			{createdLabels}
			{createdDataLabels}
		</Svg>
	);
};
