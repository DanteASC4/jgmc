import { createSVGElement, makeSVGParent } from "./creating/common.ts";
import { drawDonutSlice } from "./creating/donutchart.ts";
import { createLinearGradient, createPathsMask } from "./creating/gradients.ts";
import { createImageLabel, createLabel } from "./creating/labels.ts";
import { calcDonutSliceCentroidCoords } from "./math/donutchart.ts";
import type { DonutChartOptions } from "./types.ts";
import { getSingleOrWrap } from "./utils/get-single-or-wrap.ts";

export const DonutChartDefaults = {
	size: 300,
	padding: 15,
	centerLabelFontSize: 32,
	centerLabelFontWeight: "bold",
	centerLabelFontFamily: "monospace",
	centerLabelColor: "#000000",
	fillColors: "#ffffff",
	labelColors: "#000000",
} satisfies { [K in keyof DonutChartOptions]?: DonutChartOptions[K] };

export function donutchart({
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
}: DonutChartOptions) {
	const sum = data.reduce((v, p) => v + p, 0);
	const asDecimalPercentages = data.map((n) => n / sum);

	if (!vWidth) vWidth = size;
	if (!vHeight) vHeight = size;

	const parent = makeSVGParent(
		vWidth + padding * 2,
		vHeight + padding * 2,
		size,
		size,
	);

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

	const slicesGroup = createSVGElement("g");
	slicesGroup.classList.add("tmc-donutgroup");

	const hasLabels =
		(labels && labels.length > 0) ||
		dataLabels ||
		(imageLabels && imageLabels.length > 0);

	const labelGroup = hasLabels || centerLabel ? createSVGElement("g") : null;

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

	const centroids = [];
	const slices: SVGPathElement[] = [];

	for (let i = 0; i < asCoords.length; i++) {
		const coord = asCoords[i];
		const coordTo = i === asCoords.length - 1 ? asCoords[0] : asCoords[i + 1];
		const largeArcFlag = coord[2] >= halfLength;

		let color = getSingleOrWrap(fillColors, i);
		if (isGradient && gradientId) {
			if (gradientMode === "continuous") color = "transparent";
			else color = `url('#${gradientId}')`;
		} else if (fillColors && fillColors.length > 0) {
			color = fillColors[i % fillColors.length];
		}

		const strokeColor = strokeColors
			? getSingleOrWrap(strokeColors, i)
			: undefined;
		const strokeWidth = strokeWidths
			? getSingleOrWrap(strokeWidths, i)
			: undefined;

		const slicePath = drawDonutSlice(
			coord,
			coordTo,
			largeArcFlag,
			radius,
			center,
			color,
			strokeColor,
			strokeWidth,
		);

		slicesGroup.appendChild(slicePath);
		if (gradientMode === "continuous" && gradientId) slices.push(slicePath);

		if (hasLabels && labelGroup) {
			const labelColor = getSingleOrWrap(labelColors, i);
			const arcLength = coord[2];
			const prevAngleRads = asCoords
				.slice(0, i)
				.map((_, idx) => (totalLength * asDecimalPercentages[idx]) / radius)
				.reduce((prev, curr) => prev + curr, 0);

			const centroidCoords = calcDonutSliceCentroidCoords(
				arcLength,
				prevAngleRads,
				radius,
				center,
				quarterTurnAngle,
			);
			centroids.push(centroidCoords);

			if (imageLabels?.[i]) {
				const imageLabel = imageLabels[i]; // Shouldn't wrap image labels
				// const imageLabel = getSingleOrWrap(imageLabels, i);
				const imageLabelEle = createImageLabel(
					imageLabel,
					centroidCoords[0],
					centroidCoords[1],
					labelColor,
					subgrouping,
					imageLabel.width,
					imageLabel.height,
				);

				labelGroup.appendChild(imageLabelEle);
			} else if (dataLabels) {
				const dataLabelValue =
					dataLabels === "literal"
						? String(data[i])
						: `${((data[i] / sum) * 100).toFixed(1)}%`;
				const dataLabelEle = createLabel(
					dataLabelValue,
					centroidCoords[0],
					centroidCoords[1],
					labelColor,
				);
				labelGroup.appendChild(dataLabelEle);
			} else if (labels?.[i]) {
				const labelEle = createLabel(
					labels[i],
					centroidCoords[0],
					centroidCoords[1],
					labelColor,
				);

				labelGroup.appendChild(labelEle);
			}
		}
	}

	if (centerLabel) {
		const centerLabelValue = centerLabel === "sum" ? String(sum) : centerLabel;
		const centerLabelEle = createLabel(
			centerLabelValue,
			center[0],
			center[1],
			centerLabelColor,
		);
		centerLabelEle.classList.add("tmc-donut-center-label");
		centerLabelEle.setAttribute("font-size", `${centerLabelFontSize}`);
		centerLabelEle.setAttribute("font-weight", `${centerLabelFontWeight}`);
		centerLabelEle.setAttribute("font-family", `${centerLabelFontFamily}`);

		labelGroup?.appendChild(centerLabelEle);
	}

	if (
		isGradient &&
		gradientDef &&
		gradientBg &&
		gradientMode === "continuous"
	) {
		const [maskId, theMask] = createPathsMask(slices);
		gradientDef.appendChild(theMask);

		gradientBg.setAttribute("mask", `url('#${maskId}')`);
		parent.appendChild(gradientBg);
	}

	parent.appendChild(slicesGroup);
	if ((hasLabels || centerLabel) && labelGroup) parent.appendChild(labelGroup);

	return parent;
}
