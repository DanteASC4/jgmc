import {
	autoBarWidth,
	autoGap,
	autoMaxNumerical,
	BarChartDefaults,
	calcBarCoords,
	calcBarDims,
	calcBarLabelCoords,
	calcDataLabelCoords,
	calcImageLabelOffset,
	getDataLabelText,
	getOnlyItemOrWrap,
	type StringOrNumber,
	sumArray,
} from "@jgmc/core";
import { useId } from "react";
import type { BarChartProps } from "$types";
import { BarChartMask, LinearGradientDefs } from "./creating/Gradients.tsx";
import { ImageLabelView, TextLabel } from "./creating/Labels.tsx";
import { Rect, Svg } from "./creating/Svg.tsx";

export const BarChart = ({
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
}: BarChartProps) => {
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
	const gradientId = useId();
	const maskId = useId();

	if (gradientColors) {
		isGradient = true;
		if (!gradientMode) gradientMode = "individual";
	}

	const subgrouping = imageLabels?.some(
		(item) => item.topText || item.bottomText,
	);
	const sum = sumArray(data);
	const createdBars = [];
	const createdMaskingBars = [];
	const createdLabels = [];
	const createdDataLabels = [];

	for (let i = 0; i < dataPointsAmt; i++) {
		const datap = data[i] ?? 0;
		let color = getOnlyItemOrWrap(fillColors, i);
		if (isGradient) {
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
			<Rect
				x={barX}
				y={barY}
				width={trueBarWidth}
				height={trueBarHeight}
				fill={color}
				key={`bar-${i}`}
				stroke={strokeColor}
				strokeWidth={strokeWidth}
			/>,
		);

		if (gradientMode === "continuous") {
			createdMaskingBars.push(
				<Rect
					x={barX}
					y={barY}
					width={trueBarWidth}
					height={trueBarHeight}
					fill="#ffffff"
					key={`mask-bar-${i}`}
				/>,
			);
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
				const dataLabelText = getDataLabelText(dataLabels, datap, sum);
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
			<title>Bar Chart</title>
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
