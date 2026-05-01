import type { BarChartNumericalOptions } from "../types.ts";

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
) => {
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

export const calcBarDims = (
	placement: BarChartNumericalOptions["placement"],
	dataPoint: number,
	evenWidth: number,
	barWidth: number,
) => {
	let trueBarHeight = dataPoint;
	let trueBarWidth = evenWidth;

	if (placement === "left") {
		const tempS = trueBarWidth;
		trueBarWidth = trueBarHeight;
		trueBarHeight = tempS;
	} else if (placement === "top") {
		// Nothing
	} else if (placement === "right") {
		// Width -> height
		// Datapoint -> width
		// x = containerWidth - dataPoint
		// y = x
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
