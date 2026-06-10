/** @jsxImportSource react */
import {
	autoMaxNumerical,
	autoMinNumerical,
	autoOffset,
	calcSmoothControlPoints,
	genCoordsStraight,
	getDataLabelText,
	getOnlyItemOrWrap,
	LineChartDefaults,
	type LineChartOptions,
	roundUpTo100,
} from "@jgmc/core";
import { useId } from "react";
import { LinearGradientDefs, PathChartMask } from "./creating/Gradients.tsx";
import { ImageLabelView, TextLabel } from "./creating/Labels.tsx";
import { Path, Svg } from "./creating/Svg.tsx";

export const LineChart = ({
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
}: Omit<LineChartOptions, "strokeColors">) => {
	const linesData = data.every((item) => typeof item === "number")
		? [data as number[]]
		: (data as number[][]);
	if (typeof colors === "string") colors = [colors];
	if (typeof thickness === "number") thickness = [thickness];
	if (typeof lineType === "string") lineType = [lineType];
	if (typeof cap === "string") cap = [cap];
	const asNumerical = linesData.flat();
	if (!min) {
		min = asNumerical.some((v) => v < 0) ? autoMinNumerical(asNumerical) : 0;
	}
	if (!max) max = autoMaxNumerical(asNumerical);
	if (!height) height = max + 10;
	if (min < 0) height += min * -1;
	if (!width) width = roundUpTo100(max > height ? max : height) + 100;

	if (!vWidth) vWidth = width;
	if (!vHeight) vHeight = height;

	let isGradient = false;
	const gradientId = useId();
	const maskId = useId();

	if (gradientColors) {
		isGradient = true;
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

	const createdLines = [];
	const createdMaskingLines = [];
	const createdLabels = [];
	const createdDataLabels = [];

	for (let i = 0; i < linesData.length; i++) {
		const lineData = linesData[i];
		const thick = thickness
			? getOnlyItemOrWrap(thickness, i)
			: strokeWidths
				? getOnlyItemOrWrap(strokeWidths, i)
				: 3;
		const dataPointsAmt = lineData.length;
		const offset = autoOffset(width, dataPointsAmt - (fullWidthLine ? 1 : 0));
		let lineColor = getOnlyItemOrWrap(colors, i);
		if (isGradient) {
			if (gradientMode === "continuous") lineColor = "transparent";
			else lineColor = `url('#${gradientId}')`;
		}
		const lineCap = getOnlyItemOrWrap(cap, i);
		const lineTypeForLine = getOnlyItemOrWrap(lineType, i);
		const labelColor = getOnlyItemOrWrap(labelColors, i);
		const coords = genCoordsStraight(lineData, offset, vHeight, min);
		let drawAttr = "";
		if (lineTypeForLine === "straight") {
			drawAttr += `M 0, ${coords[0][1]} L`;
			for (let i = 0; i < coords.length; i++) {
				drawAttr += ` ${coords[i][0]}, ${coords[i][1]}`;
			}
			createdLines.push(
				<Path
					key={`line-path-${i}`}
					d={drawAttr}
					fill="none"
					stroke={lineColor}
					strokeWidth={thick}
					strokeLinecap={lineCap}
				/>,
			);
			if (gradientMode === "continuous") {
				createdMaskingLines.push(
					<Path
						key={`line-path-mask-${i}`}
						d={drawAttr}
						fill="none"
						stroke="#ffffff"
						strokeWidth={thick}
						strokeLinecap={lineCap}
					/>,
				);
			}
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

			createdLines.push(
				<Path
					key={`line-path-${i}`}
					d={drawAttr}
					fill="none"
					stroke={lineColor}
					strokeWidth={thick}
					strokeLinecap={lineCap}
					strokeLinejoin="round"
				/>,
			);
			if (gradientMode === "continuous") {
				createdMaskingLines.push(
					<Path
						key={`line-path-mask-${i}`}
						d={drawAttr}
						fill="none"
						stroke="#ffffff"
						strokeWidth={thick}
						strokeLinecap={lineCap}
						strokeLinejoin="round"
					/>,
				);
			}
		}

		// Only the last point gets labels
		if (hasLabels && i === linesData.length - 1) {
			if (imageLabels?.[i]) {
				const lastCoord = coords[coords.length - 1];
				const imageLabel = imageLabels[i];

				let labelY = lastCoord[1];
				if (labelY <= 20) labelY += (imageLabel.width ?? 50) / 2;
				else if (labelY >= vHeight - 20) labelY -= (imageLabel.width ?? 50) / 2;

				createdLabels.push(
					<ImageLabelView
						key={`line-img-label-${i}`}
						imgLabel={imageLabel}
						x={lastCoord[0] + imageLabelOffset + (subgrouping ? 20 : 0)}
						y={labelY}
						labelColor={labelColor}
						subgrouping={subgrouping}
						width={imageLabel.width}
						height={imageLabel.height}
					/>,
				);
			} else if (labels?.[i]) {
				const lastCoord = coords[coords.length - 1];
				const label = labels[i];
				createdLabels.push(
					<TextLabel
						key={`line-label-${i}`}
						label={label}
						x={lastCoord[0] + labelOffset}
						y={lastCoord[1] - labelOffset}
						labelColor={labelColor}
					/>,
				);
			}

			if (dataLabels) {
				const lastCoord = coords[coords.length - 1];
				const dataLabel = linesData[i][linesData[i].length - 1];
				const dataLabelText = getDataLabelText(dataLabels, dataLabel, sum);
				createdDataLabels.push(
					<TextLabel
						key={`line-data-label-${i}`}
						label={dataLabelText}
						x={lastCoord[0] + labelOffset}
						y={lastCoord[1] - labelOffset}
						labelColor={labelColor}
					/>,
				);
			}
		}
	}

	return (
		<Svg width={width} height={height} vWidth={vWidth} vHeight={vHeight}>
			<title>Line Chart</title>
			{isGradient && gradientColors && gradientMode && gradientDirection && (
				<LinearGradientDefs
					colors={gradientColors}
					gDir={gradientDirection}
					gMode={gradientMode}
					gId={gradientId}
					gMask={
						gradientMode === "continuous" && maskId ? (
							<PathChartMask maskId={maskId}>
								{createdMaskingLines}
							</PathChartMask>
						) : undefined
					}
					gMaskId={gradientMode === "continuous" && maskId ? maskId : undefined}
				/>
			)}
			{createdLines}
			{createdLabels}
			{createdDataLabels}
		</Svg>
	);
};
