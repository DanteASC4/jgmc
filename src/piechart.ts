import { createSVGElement, makeSVGParent } from "./creating/common.ts";
import { createLinearGradient, createPathsMask } from "./creating/gradients.ts";
import { createImageLabel, createLabel } from "./creating/labels.ts";
import { drawPieSlice } from "./creating/piechart.ts";
import { calcPieSliceCentroidCoords } from "./math/piechart.ts";
import type { PieChartOptions } from "./types.ts";
import { getSingleOrWrap } from "./utils/get-single-or-wrap.ts";

export const PieChartDefaults = {
	size: 300,
	padding: 15,
	centerLabelFontSize: 32,
	centerLabelFontWeight: "bold",
	centerLabelFontFamily: "monospace",
} satisfies { [K in keyof PieChartOptions]?: PieChartOptions[K] };

export function piechart({
	data,
	size = PieChartDefaults.size,
	padding = PieChartDefaults.padding,
	labels,
	labelColors,
	dataLabels,
	imageLabels,
	centerLabel,
	centerLabelColor,
	centerLabelFontSize = PieChartDefaults.centerLabelFontSize,
	centerLabelFontWeight = PieChartDefaults.centerLabelFontWeight,
	centerLabelFontFamily = PieChartDefaults.centerLabelFontFamily,
	vWidth,
	vHeight,
	fillColors,
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
	slicesGroup.classList.add("tmc-piegroup");

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
	const center = { x: radius + padding, y: radius + padding };
	const totalLength = 2 * Math.PI * radius;
	const halfLength = totalLength * 0.5;

	asDecimalPercentages.unshift(0);

	const asStarts = asDecimalPercentages.map((p, i) => {
		const v = p + asDecimalPercentages.slice(0, i).reduce((v, c) => v + c, 0);
		const b = v < 0 ? 1 + v : v;
		return b;
	});
	const asDists = asStarts.map((d) => d * totalLength);
	const asCoords = asDists.map((d, i) => {
		const angle = d / radius - quarterTurnAngle;
		return {
			x: center.x + radius * Math.cos(angle),
			y: center.y + radius * Math.sin(angle),
			v:
				asDecimalPercentages[(i + 1) % asDecimalPercentages.length] *
				totalLength,
		};
	});
	asDecimalPercentages.shift();
	asCoords.pop();

	const centroids = [];
	const slices: SVGPathElement[] = [];

	for (let i = 0; i < asCoords.length; i++) {
		const coord = asCoords[i];
		const coordTo = i === asCoords.length - 1 ? asCoords[0] : asCoords[i + 1];
		// STUB - gradients
		const largeArcFlag = coord.v >= halfLength;

		// const color = fillColors ? fillColors[i%fillColors.length] : '#ffffff';
		let color = "#ffffff";
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
		// const strokeWidth = strokeWidths
		// 	? strokeWidths[i % strokeWidths.length]
		// 	: undefined;

		const slicePath = drawPieSlice(
			[coord.x, coord.y, coord.v],
			[coordTo.x, coordTo.y, coordTo.v],
			largeArcFlag,
			radius,
			[center.x, center.y],
			color,
			strokeColor,
			strokeWidth,
		);

		slicesGroup.appendChild(slicePath);
		if (gradientMode === "continuous" && gradientId) slices.push(slicePath);

		if (hasLabels && labelGroup) {
			const labelColor = labelColors
				? labelColors[i % labelColors.length]
				: "#ffffff";
			const arcLength = coord.v;
			const prevAngleRads = asCoords
				.slice(0, i)
				.map((_, idx) => (totalLength * asDecimalPercentages[idx]) / radius)
				.reduce((prev, curr) => prev + curr, 0);

			const centroidCoords = calcPieSliceCentroidCoords(
				arcLength,
				prevAngleRads,
				radius,
				[center.x, center.y],
				quarterTurnAngle,
			);
			centroids.push(centroidCoords);

			if (imageLabels?.[i]) {
				const imageLabel = imageLabels[i % imageLabels.length];
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
		const centerLabelTrueColor = centerLabelColor ?? "#000000";
		const centerLabelValue = centerLabel === "sum" ? String(sum) : centerLabel;
		const centerLabelEle = createLabel(
			centerLabelValue,
			center.x,
			center.y,
			centerLabelTrueColor,
		);
		centerLabelEle.classList.add("tmc-pie-center-label");

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
