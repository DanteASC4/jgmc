import type { BarChartNumericalOpts } from "../types.ts";

export const autoBarWidth = (surfaceWidth: number, numBars: number) => {
	return surfaceWidth / numBars / 2;
};

export const calcDataLabelCoords = (
	placement: BarChartNumericalOpts["placement"],
	barX: number,
	barY: number,
	trueBarWidth: number,
	trueBarHeight: number,
	_textOffset = 15,
) => {
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
