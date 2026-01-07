import type { AsciiBarChartOptions } from "../types.ts";

export const asciiCalcBarDims = (
	placement: AsciiBarChartOptions["placement"],
	dataPoint: number,
	barWidth: number,
) => {
	let trueBarHeight = dataPoint;
	let trueBarWidth = barWidth;

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

	return [trueBarHeight, trueBarWidth];
};

// export const asciiCalcBarDims = (
// 	placement: AsciiBarChartOptions["placement"],
// 	dataPoint: number,
// 	evenWidth: number,
// 	barWidth: number,
// ) => {
// 	let trueBarHeight = dataPoint;
// 	let trueBarWidth = evenWidth;

// 	if (placement === "left") {
// 		const tempS = trueBarWidth;
// 		trueBarWidth = trueBarHeight;
// 		trueBarHeight = tempS;
// 	} else if (placement === "top") {
// 		// Nothing
// 	} else if (placement === "right") {
// 		// Width -> height
// 		// Datapoint -> width
// 		// x = containerWidth - dataPoint
// 		// y = x
// 		const tempS = trueBarWidth;
// 		trueBarWidth = trueBarHeight;
// 		trueBarHeight = tempS;
// 	} else if (placement === "bottom") {
// 		// Nothing
// 	}

// 	if (barWidth !== evenWidth) {
// 		if (placement === "top" || placement === "bottom") {
// 			trueBarWidth = barWidth;
// 		} else {
// 			trueBarHeight = barWidth;
// 		}
// 	}

// 	return [trueBarHeight, trueBarWidth];
// };
