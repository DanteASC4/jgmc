/** @jsxRuntime automatic */
/** @jsxImportSource react */
import {
	calcDonutSliceCentroidCoords,
	DonutChartDefaults,
	type DonutChartOptions,
	decimalPercentsToStarts,
	getCoordsForCircularCharts,
	getDataLabelText,
	getOnlyItemOrWrap,
	midpoint,
	sumArray,
	sumPrevAngleRads,
} from "@jgmc/core";
import { useId } from "react";
import { LinearGradientDefs, PathChartMask } from "./creating/Gradients.tsx";
import { ImageLabelView, TextLabel } from "./creating/Labels.tsx";
import { Path, Svg } from "./creating/Svg.tsx";

export const DonutChart = ({
	data,
	size = DonutChartDefaults.size,
	padding = DonutChartDefaults.padding,
	labels,
	labelColors = DonutChartDefaults.labelColors,
	dataLabels,
	imageLabels,
	centerLabel,
	centerLabelColor = DonutChartDefaults.centerLabelColor,
	centerLabelFontSize = DonutChartDefaults.centerLabelFontSize,
	centerLabelFontWeight = DonutChartDefaults.centerLabelFontWeight,
	centerLabelFontFamily = DonutChartDefaults.centerLabelFontFamily,
	vWidth,
	vHeight,
	fillColors = DonutChartDefaults.fillColors,
	strokeColors,
	strokeWidths,
	gradientColors,
	gradientMode,
	gradientDirection,
}: DonutChartOptions) => {
	const sum = sumArray(data);
	const asDecimalPercentages = data.map((n) => n / sum);

	if (!vWidth) vWidth = size;
	if (!vHeight) vHeight = size;

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
	const quarterTurnAngle = 0.25 * (Math.PI * 2);
	const radius = size / 2;
	const totalLength = 2 * Math.PI * radius;
	const halfLength = totalLength * 0.5;
	const center: [number, number] = [radius + padding, radius + padding];

	asDecimalPercentages.unshift(0);

	const asStarts = decimalPercentsToStarts(asDecimalPercentages);
	const asDists = asStarts.map((d) => d * totalLength);

	// [x,y,v]
	const asCoords: [number, number, number][] = getCoordsForCircularCharts(
		asDists,
		asDecimalPercentages,
		radius,
		quarterTurnAngle,
		center,
	);
	asDecimalPercentages.shift();
	asCoords.pop();

	// const centroids: [number, number][] = [];
	const createdSlices = [];
	const createdMaskingSlices = [];
	const createdLabels = [];
	const createdDataLabels = [];

	for (let i = 0; i < asCoords.length; i++) {
		const coord = asCoords[i];
		const coordTo = i === asCoords.length - 1 ? asCoords[0] : asCoords[i + 1];
		const largeArcFlag = coord[2] >= halfLength ? "1" : "0";

		let color = getOnlyItemOrWrap(fillColors, i);
		if (isGradient) {
			if (gradientMode === "continuous") color = "transparent";
			else color = `url('#${gradientId}')`;
		}

		const strokeColor = strokeColors
			? getOnlyItemOrWrap(strokeColors, i)
			: undefined;
		const strokeWidth = strokeWidths
			? getOnlyItemOrWrap(strokeWidths, i)
			: undefined;

		const midpointStart = midpoint(coord[0], coord[1], center[0], center[1]);
		const midpointEnd = midpoint(coordTo[0], coordTo[1], center[0], center[1]);

		const drawAttr = `M ${coord[0]} ${
			coord[1]
		} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${coordTo[0]} ${coordTo[1]} L ${midpointEnd[0]} ${midpointEnd[1]} A ${radius * 0.5} ${radius * 0.5} 0 ${largeArcFlag} 0 ${midpointStart[0]} ${midpointStart[1]} L ${coord[0]} ${coord[1]} Z`;

		createdSlices.push(
			<Path
				key={`path-${i}`}
				d={drawAttr}
				fill={color}
				stroke={strokeColor}
				strokeWidth={strokeWidth}
			/>,
		);

		if (gradientMode === "continuous") {
			createdMaskingSlices.push(
				<Path key={`path-mask-${i}`} d={drawAttr} fill="#ffffff" />,
			);
		}

		if (hasLabels) {
			const labelColor = getOnlyItemOrWrap(labelColors, i);
			const arcLength = coord[2];
			const prevAngleRads = sumPrevAngleRads(
				i,
				asCoords,
				asDecimalPercentages,
				totalLength,
				radius,
			);

			const centroidCoords = calcDonutSliceCentroidCoords(
				arcLength,
				prevAngleRads,
				radius,
				center,
				quarterTurnAngle,
			);

			if (imageLabels?.[i]) {
				const imgLabel = imageLabels[i];
				createdLabels.push(
					<ImageLabelView
						key={`donut-img-label-${i}`}
						imgLabel={imgLabel}
						x={centroidCoords[0]}
						y={centroidCoords[1]}
						labelColor={labelColor}
						subgrouping={subgrouping}
						width={imgLabel.width}
						height={imgLabel.height}
					/>,
				);
			} else if (dataLabels) {
				const dataLabelText = getDataLabelText(dataLabels, data[i], sum);

				createdDataLabels.push(
					<TextLabel
						key={`donut-data-label-${i}`}
						label={dataLabelText}
						x={centroidCoords[0]}
						y={centroidCoords[1]}
						labelColor={labelColor}
					/>,
				);
			} else if (labels?.[i]) {
				const labelText = labels[i];
				createdLabels.push(
					<TextLabel
						key={`donut-label-${i}`}
						label={labelText}
						x={centroidCoords[0]}
						y={centroidCoords[1]}
						labelColor={labelColor}
					/>,
				);
			}
		}
	}

	if (centerLabel) {
		const centerLabelText = centerLabel === "sum" ? `${sum}` : centerLabel;
		createdLabels.push(
			<TextLabel
				key={`donut-center-label`}
				label={centerLabelText}
				x={center[0]}
				y={center[1]}
				labelColor={centerLabelColor}
				fontSize={centerLabelFontSize}
				fontFamily={centerLabelFontFamily}
				fontWeight={centerLabelFontWeight}
			/>,
		);
	}

	return (
		<Svg
			width={size}
			height={size}
			vWidth={vWidth + padding * 2}
			vHeight={vHeight + padding * 2}
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
							<PathChartMask maskId={maskId}>
								{createdMaskingSlices}
							</PathChartMask>
						) : undefined
					}
					gMaskId={gradientMode === "continuous" && maskId ? maskId : undefined}
				/>
			)}
			{createdSlices}
			{createdLabels}
			{createdDataLabels}
		</Svg>
	);
};
