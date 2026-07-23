import type { BarChartNumericalOptions } from "$types";
import { autoGap } from "./common.ts";

export const autoBarWidth = (surfaceWidth: number, numBars: number): number => {
	return surfaceWidth / numBars / 2;
};

export const calcDataLabelCoords = (
	placement: BarChartNumericalOptions["placement"],
	barX: number,
	barY: number,
	trueBarWidth: number,
	trueBarHeight: number,
	_textOffset = 15,
): [number, number] => {
	let textX = 0;
	let textY = 0;

	if (placement === "left") {
		textX = trueBarWidth * 0.5;
		textY = barY + trueBarHeight * 0.5;
	} else if (placement === "top") {
		textX = barX + trueBarWidth * 0.5;
		textY = trueBarHeight * 0.5;
	} else if (placement === "right") {
		textX = barX + trueBarWidth * 0.5;
		textY = barY + trueBarHeight * 0.5;
	} else if (placement === "bottom") {
		textX = barX + trueBarWidth * 0.5;
		textY = barY + trueBarHeight * 0.5;
	}

	return [textX, textY];
};
/**
 * Helper function to calcluate even bar width based on placement and chart dimensions
 * @param isTopOrBot Whether the bars are being placed vertically or horizontally on the chart
 * @param width Chart width
 * @param height Chart height
 * @param dataPointsAmt Amount of datapoints
 * @returns Even width for all bars
 */
export const calcEvenWidth = (
	isTopOrBot: boolean,
	width: number,
	height: number,
	dataPointsAmt: number,
): number => {
	if (isTopOrBot) return autoBarWidth(width, dataPointsAmt);
	return autoBarWidth(height, dataPointsAmt);
};

/**
 * Helper function to calcluate bar gap based on placement and chart dimensions
 * @param isTopOrBot Whether the bars are being placed vertically or horizontally on the chart
 * @param width Chart width
 * @param height Chart height
 * @param dataPointsAmt Amount of datapoints
 * @param gap User-defined gap, takes precedence if supplied
 * @returns Gap amount to evenly space all bars
 */
export const calcAutoGap = (
	isTopOrBot: boolean,
	width: number,
	height: number,
	dataPointsAmt: number,
	gap?: number,
): number =>
	gap
		? gap
		: isTopOrBot
			? autoGap(width, dataPointsAmt)
			: autoGap(height, dataPointsAmt);

/**
 * Helper function to ensure a proper viewbox even for charts with large data values, making for a sensible visual output.
 * @param isTopOrBot Whether the bars are being placed vertically or horizontally on the chart
 * @param vWidth Chart viewbox width
 * @param vHeight Chart viewbox height
 * @param exceedsWidth Whether any datapoint would exceed the chart width
 * @param exceedsHeight Whether any datapoint would exceed the chart height
 * @param largest Largest value in dataset
 * @param max User-defined max, takes precedence if supplied
 * @returns Normalized viewbox dimensions based on params
 */
export const calcTrueVDims = (
	isTopOrBot: boolean,
	vWidth: number,
	vHeight: number,
	exceedsWidth: boolean,
	exceedsHeight: boolean,
	largest: number,
	max?: number,
): [number, number] => {
	let trueVWidth = vWidth;
	if (!isTopOrBot && exceedsWidth) trueVWidth = max ? max : largest;
	let trueVHeight = vHeight;
	if (isTopOrBot && exceedsHeight) trueVHeight = max ? max : largest;
	return [trueVWidth, trueVHeight];
};

export const calcBarDims = (
	placement: BarChartNumericalOptions["placement"],
	dataPoint: number,
	evenWidth: number,
	barWidth: number,
): [number, number] => {
	let trueBarHeight = dataPoint;
	let trueBarWidth = evenWidth;

	if (placement === "left") {
		const tempS = trueBarWidth;
		trueBarWidth = trueBarHeight;
		trueBarHeight = tempS;
	} else if (placement === "top") {
		// Nothing
	} else if (placement === "right") {
		const tempS = trueBarWidth;
		trueBarWidth = trueBarHeight;
		trueBarHeight = tempS;
	} else if (placement === "bottom") {
		// Nothing
	}

	if (barWidth !== evenWidth) {
		if (placement === "top" || placement === "bottom") {
			trueBarWidth = barWidth;
		} else {
			trueBarHeight = barWidth;
		}
	}

	return [trueBarHeight, trueBarWidth];
};

export const calcBarCoords = (
	idx: number,
	placement: BarChartNumericalOptions["placement"],
	gap: number,
	width: number,
	height: number,
	evenWidth: number,
	barWidth: number,
	trueBarWidth: number,
	trueBarHeight: number,
): [number, number] => {
	let barX = 0;
	let barY = 0;

	const initial = evenWidth * 2 * idx;
	barX = initial + gap;

	if (placement === "left") {
		const tempC = barX;
		barX = barY;
		barY = tempC;
	} else if (placement === "top") {
		// Nothing
	} else if (placement === "right") {
		// const tempC = barY;
		barY = barX;
		barX = width - trueBarWidth;
	} else if (placement === "bottom") {
		barY = height - trueBarHeight;
	}

	if (barWidth !== evenWidth) {
		if (placement === "top" || placement === "bottom") {
			barX += Math.abs(evenWidth * 0.5 - barWidth);
		} else {
			barY += Math.abs(evenWidth * 0.5 - barWidth);
		}
	}

	return [barX, barY];
};
