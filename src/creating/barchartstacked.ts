import { calcBarCoords, calcBarDims } from "../math/barchart.ts";
import { calcLabelCoords } from "../math/labels.ts";
import type { BarChartStackedOpts } from "../types.ts";
import { createSVGElement } from "./common.ts";

// text offset now computed via shared calcLabelCoords

export const createStackedBarAndText = (
	gIdx: number,
	placement: BarChartStackedOpts["placement"],
	dataPoint: number[],
	numericalDataPoint: number,
	label: string,
	gap: number,
	barWidth: number,
	evenWidth: number,
	color: string | string[],
	labelColor: string,
	{ width, height }: { width: number; height: number },
	{
		barClass,
		labelClass,
	}: Pick<BarChartStackedOpts['classes'], "barClass" | "labelClass">,
) => {
	// Compute bar dimensions and coordinates analogous to single-bar charts
	const [trueBarHeight, trueBarWidth] = calcBarDims(
		placement,
		numericalDataPoint,
		evenWidth,
		barWidth,
	);
	const [barX, barY] = calcBarCoords(
		gIdx,
		placement,
		gap,
		width,
		height,
		evenWidth,
		barWidth,
		trueBarWidth,
		trueBarHeight,
	);

	// Label coordinates consistent with barchart
	const [textX, textY] = calcLabelCoords(
		placement,
		barX,
		barY,
		trueBarWidth,
		trueBarHeight,
	);

	const bars: SVGElement[] = [];
	for (let i = 0; i < dataPoint.length; i++) {
		const current = dataPoint[i];
		const offset = dataPoint.slice(0, i).reduce((c, p) => c + p, 0);

		const bar = createSVGElement("rect");
		if (typeof color === "string") {
			bar.setAttribute("fill", color);
		} else {
			const chosen = color[i % color.length];
			bar.setAttribute("fill", chosen);
		}
		// bar.setAttribute("x", `${barX}`);
		// bar.setAttribute("y", `${barY+offset}`);
		// bar.setAttribute("width", `${trueBarWidth}`);
		// bar.setAttribute("height", `${trueBarHeight}`);

		if (placement === "top" || placement === "bottom") {
			bar.setAttribute("x", `${barX}`);
			bar.setAttribute("y", `${barY + offset}`);
			bar.setAttribute("width", `${trueBarWidth}`);
			bar.setAttribute("height", `${current}`);
		} else {
			bar.setAttribute("x", `${barX + offset}`);
			bar.setAttribute("y", `${barY}`);
			bar.setAttribute("width", `${current}`);
			bar.setAttribute("height", `${trueBarHeight}`);
		}

		// bar.setAttribute("title", `Bar value of ${dataPoint}`);
		if (barClass) bar.classList.add(barClass as string);

		bars.push(bar);
	}

	const text = createSVGElement("text");
	text.setAttribute("fill", labelColor);
	text.setAttribute("x", `${textX}`);
	text.setAttribute("y", `${textY}`);
	// text.setAttribute("title", `Bar label ${label}`);
	text.textContent = label;
	if (labelClass) text.classList.add(labelClass as string);

	// group.appendChild(bar);
	// group.appendChild(text);
	// if (groupClass) group.classList.add(groupClass);

	return [bars, text] as const;
};
