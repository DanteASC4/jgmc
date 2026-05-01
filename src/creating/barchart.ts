import type { BarChartNumericalOptions } from "../types.ts";
import { createSVGElement } from "./common.ts";

const textOffset = 15;
/**
 * @deprecated
 */
export const createBarAndText = (
	gIdx: number,
	placement: BarChartNumericalOptions["placement"],
	dataPoint: number,
	label: string,
	gap: number,
	barWidth: number,
	evenWidth: number,
	color: string,
	labelColor: string,
	{ width, height }: { width: number; height: number },
	{ barClass, labelClass }: { barClass?: string; labelClass?: string },
) => {
	// const group = createSVGElement("g");

	const text = createSVGElement("text");
	const bar = createSVGElement("rect");

	let barX = 0;
	let barY = 0;
	let trueBarHeight = dataPoint;
	let trueBarWidth = evenWidth;

	let textX = 0;
	let textY = 0;
	// let trueBarHeight = barWidth;
	// let trueBarWidth = dataPoint;

	const initial = evenWidth * 2 * gIdx;
	barX = initial + gap;

	if (placement === "left") {
		// ...
		const tempS = trueBarWidth;
		trueBarWidth = trueBarHeight;
		trueBarHeight = tempS;

		const tempC = barX;
		barX = barY;
		barY = tempC;

		textX = trueBarWidth + textOffset;
		textY = barY + trueBarHeight * 0.5;
	} else if (placement === "top") {
		textX = barX + trueBarWidth * 0.25;
		textY = trueBarHeight + textOffset;
	} else if (placement === "right") {
		// Width -> height
		// Datapoint -> width
		// x = containerWidth - dataPoint
		// y = x
		const tempS = trueBarWidth;
		trueBarWidth = trueBarHeight;
		trueBarHeight = tempS;

		// const tempC = barY;
		barY = barX;
		barX = width - trueBarWidth;

		textX = barX - textOffset * 2;
		textY = barY + trueBarHeight * 0.5;
	} else if (placement === "bottom") {
		barY = height - trueBarHeight;

		textX = barX + trueBarWidth * 0.25;
		textY = barY - textOffset;
	}

	if (barWidth !== evenWidth) {
		if (placement === "top" || placement === "bottom") {
			trueBarWidth = barWidth;
			barX += Math.abs(evenWidth * 0.5 - barWidth);
		} else {
			trueBarHeight = barWidth;
			barY += Math.abs(evenWidth * 0.5 - barWidth);
		}
	}

	bar.setAttribute("fill", color);
	bar.setAttribute("x", `${barX}`);
	bar.setAttribute("y", `${barY}`);
	bar.setAttribute("width", `${trueBarWidth}`);
	bar.setAttribute("height", `${trueBarHeight}`);
	bar.setAttribute("title", `Bar value of ${dataPoint}`);
	if (barClass) bar.classList.add(barClass);

	text.setAttribute("fill", labelColor);
	text.setAttribute("x", `${textX}`);
	text.setAttribute("y", `${textY}`);
	// text.setAttribute("title", `Bar label ${label}`);
	text.textContent = label;
	if (labelClass) text.classList.add(labelClass);

	// group.appendChild(bar);
	// group.appendChild(text);
	// if (groupClass) group.classList.add(groupClass);

	return [bar, text] as const;
};

export const createBar = (
	barX: number,
	barY: number,
	trueBarWidth: number,
	trueBarHeight: number,
	fill: string,
	stroke?: string,
	strokeWidth?: string | number,
	// barClass: Pick<BarChartNumericalOptions, "barClass">,
) => {
	const bar = createSVGElement("rect");

	bar.setAttribute("fill", fill);
	bar.setAttribute("x", `${barX}`);
	bar.setAttribute("y", `${barY}`);
	bar.setAttribute("width", `${trueBarWidth}`);
	bar.setAttribute("height", `${trueBarHeight}`);

	if (strokeWidth) bar.setAttribute("stroke-width", `${strokeWidth}`);
	if (stroke) bar.setAttribute("stroke", stroke);

	// bar.setAttribute("title", `Bar value of ${dataPoint}`);
	// if (barClass) bar.classList.add(barClass);

	return bar;
};
