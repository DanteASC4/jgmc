import type { BarChartNumericalOptions } from "../types.ts";

export const calcLabelCoords = (
	placement: BarChartNumericalOptions["placement"],
	barX: number,
	barY: number,
	trueBarWidth: number,
	trueBarHeight: number,
	textOffset = 15,
) => {
	let textX = 0;
	let textY = 0;

	if (placement === "left") {
		textX = trueBarWidth + textOffset;
		textY = barY + trueBarHeight * 0.5;
	} else if (placement === "top") {
		textX = barX + trueBarWidth * 0.5;
		textY = trueBarHeight + textOffset;
	} else if (placement === "right") {
		textX = barX - textOffset * 2;
		textY = barY + trueBarHeight * 0.5;
	} else if (placement === "bottom") {
		textX = barX + trueBarWidth * 0.5;
		textY = barY - textOffset;
	}

	return [textX, textY];
};
