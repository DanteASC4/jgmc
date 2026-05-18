import {
	asPercent,
	calcPieSliceCentroidCoords,
	getOnlyItemOrWrap,
	type PieChartOptions,
	randId,
	sumPrevAngleRads,
} from "@jgmc/core";
import type { TextAttrs, TextAttrsArr } from "$types";
import {
	createLinearGradient,
	createPathChartMask,
} from "./creating/gradients.ts";
import { createImageLabel, createTextLabel } from "./creating/labels.ts";
import { createPath, createSvg } from "./creating/svg.ts";

export const PieChartDefaults = {
	size: 300,
	padding: 15,
	centerLabelFontSize: 32,
	centerLabelFontWeight: "bold",
	centerLabelFontFamily: "monospace",
	centerLabelColor: "#000000",
	fillColors: "#ffffff",
	labelColors: "#000000", // Labels are on top of slices here
} satisfies { [K in keyof PieChartOptions]?: PieChartOptions[K] };

export function piechart({
	data,
	size = PieChartDefaults.size,
	padding = PieChartDefaults.padding,
	labels,
	labelColors = PieChartDefaults.labelColors,
	dataLabels,
	imageLabels,
	centerLabel,
	centerLabelColor = PieChartDefaults.centerLabelColor,
	centerLabelFontSize = PieChartDefaults.centerLabelFontSize,
	centerLabelFontWeight = PieChartDefaults.centerLabelFontWeight,
	centerLabelFontFamily = PieChartDefaults.centerLabelFontFamily,
	vWidth,
	vHeight,
	fillColors = PieChartDefaults.fillColors,
	strokeColors,
	strokeWidths,
	gradientColors,
	gradientMode,
	gradientDirection,
}: PieChartOptions) {
	const sum = data.reduce((v, p) => v + p, 0);
	const asDecimalPercentages = data.map((n) => n / sum);

	if (!vWidth) vWidth = size;
	if (!vHeight) vHeight = size;

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
	const quarterTurnAngle = 0.25 * (Math.PI * 2);
	const radius = size / 2;
	const center: [number, number] = [radius + padding, radius + padding];
	const totalLength = 2 * Math.PI * radius;
	const halfLength = totalLength * 0.5;

	asDecimalPercentages.unshift(0);

	const asStarts = asDecimalPercentages.map((p, i) => {
		const v = p + asDecimalPercentages.slice(0, i).reduce((v, c) => v + c, 0);
		const b = v < 0 ? 1 + v : v;
		return b;
	});
	const asDists = asStarts.map((d) => d * totalLength);

	// [x,y,v]
	const asCoords: [number, number, number][] = asDists.map((d, i) => {
		const angle = d / radius - quarterTurnAngle;
		return [
			center[0] + radius * Math.cos(angle),
			center[1] + radius * Math.sin(angle),
			asDecimalPercentages[(i + 1) % asDecimalPercentages.length] * totalLength,
		];
	});
	asDecimalPercentages.shift();
	asCoords.pop();

	// const centroids: [number, number][] = [];
	const createdSlices: string[] = [];
	const createdMaskingSlices: string[] = [];
	const createdLabels: string[] = [];
	const createdDataLabels: string[] = [];

	for (let i = 0; i < asCoords.length; i++) {
		const coord = asCoords[i];
		const coordTo = i === asCoords.length - 1 ? asCoords[0] : asCoords[i + 1];
		const largeArcFlag = coord[2] >= halfLength ? "1" : "0";

		let color = getOnlyItemOrWrap(fillColors, i);
		if (isGradient && gradientId) {
			if (gradientMode === "continuous") color = "transparent";
			else color = `url('#${gradientId}')`;
		}
		const strokeColor = strokeColors
			? getOnlyItemOrWrap(strokeColors, i)
			: undefined;
		const strokeWidth = strokeWidths
			? getOnlyItemOrWrap(strokeWidths, i)
			: undefined;

		const drawAttr = `M ${coord[0]} ${
			coord[1]
		} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${coordTo[0]} ${coordTo[1]} L ${
			center[0]
		} ${center[1]} Z`;

		createdSlices.push(
			createPath(drawAttr, {
				fill: color,
				stroke: strokeColor,
				strokeWidth: strokeWidth,
			}),
		);

		if (gradientMode === "continuous" && gradientId) {
			createdMaskingSlices.push(
				createPath(drawAttr, {
					fill: "#ffffff",
					stroke: undefined,
					strokeWidth: undefined,
				}),
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

			const centroidCoords = calcPieSliceCentroidCoords(
				arcLength,
				prevAngleRads,
				radius,
				center,
				quarterTurnAngle,
			);
			if (imageLabels?.[i]) {
				const imageLabel = imageLabels[i];
				createdDataLabels.push(
					createImageLabel(
						imageLabel,
						centroidCoords[0],
						centroidCoords[1],
						labelColor,
						subgrouping,
						imageLabel.width,
						imageLabel.height,
					),
				);
			} else if (dataLabels) {
				const dataLabelText =
					dataLabels === "literal"
						? `${data[i]}`
						: `${asPercent(data[i], sum)}%`;
				createdDataLabels.push(
					createTextLabel(
						dataLabelText,
						centroidCoords[0],
						centroidCoords[1],
						labelColor,
					),
				);
			} else if (labels?.[i]) {
				createdLabels.push(
					createTextLabel(
						labels[i],
						centroidCoords[0],
						centroidCoords[1],
						labelColor,
					),
				);
			}
		}
	}

	if (centerLabel) {
		const centerLabelText = centerLabel === "sum" ? `${sum}` : centerLabel;
		const additionalAttrs: TextAttrsArr = [
			["font-size", `${centerLabelFontSize}`],
			["font-weight", `${centerLabelFontWeight}`],
			["font-family", `${centerLabelFontFamily}`],
		];
		createdLabels.push(
			createTextLabel(
				centerLabelText,
				center[0],
				center[1],
				centerLabelColor,
				additionalAttrs,
			),
		);
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
			const [maskId, theMask] = createPathChartMask(createdMaskingSlices);
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
	svgBody += createdSlices.join("");
	if (hasLabels) svgBody += createdLabels.join("");
	if (dataLabels) svgBody += createdDataLabels.join("");

	const svg = createSvg(
		vWidth + padding * 2,
		vHeight + padding * 2,
		size,
		size,
		svgBody,
	);

	return svg;
}
