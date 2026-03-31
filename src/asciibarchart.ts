import { bold } from "@std/fmt/colors";
import {
	createHorizontalBar,
	createVerticalBar,
	getChosenChar,
	literalDataLabel,
	percentageDataLabel,
} from "./ascii-creating/asciibarchart.ts";
import { colorString, truncateString } from "./ascii-creating/common.ts";
import { asciiCalcBarDims } from "./math/asciibarchart.ts";
import { autoBarWidth } from "./math/barcharts-common.ts";
import { asPercent } from "./math/common.ts";
import type { AsciiBarChartOptions } from "./types.ts";
import { autoMaxNumerical } from "./utils/general-operations.ts";

// For Debugging
const visibilityChars = ["@", ".", "#", "$", "o"];

const AsciiBarChartDefaults = {
	placement: "top",
	barCharacter: "solid",
	barWidth: 3,
	gap: 3,
	width: 80,
	height: 24,
	color: "white",
	dataLabels: "literal",
	dataLabelColors: "white",
} as const;

export function asciiBarchart({
	data,
	placement = AsciiBarChartDefaults.placement,
	barCharacter = AsciiBarChartDefaults.barCharacter,
	barWidth = AsciiBarChartDefaults.barWidth,
	gap = AsciiBarChartDefaults.gap,
	width = AsciiBarChartDefaults.width,
	height = AsciiBarChartDefaults.height,
	colors = [AsciiBarChartDefaults.color],
	title,
	dataLabels = AsciiBarChartDefaults.dataLabels,
	dataLabelColors = [AsciiBarChartDefaults.dataLabelColors],
}: AsciiBarChartOptions) {
	const chosenChar = getChosenChar(barCharacter);
	const autoMax = autoMaxNumerical(data);
	const aMaxLen = String(autoMax).length;
	const dataPointsAmt = data.length;
	const toporbottom = placement === "top" || placement === "bottom";

	const numGaps = dataPointsAmt + 1;


	console.log('width - width * 0.3', width - width * 0.3);

	const trueWidth = toporbottom
		? numGaps * gap + dataPointsAmt * barWidth
		: width - width * 0.3;
	const trueHeight = toporbottom
		? height - height * 0.3
		: numGaps * gap + dataPointsAmt * barWidth;
	// const trueWidth = toporbottom
	// 	? numGaps * gap + dataPointsAmt * barWidth
	// 	: width - width * 0.3;
	// const trueHeight = toporbottom
	// 	? height - height * 0.3
	// 	: numGaps * gap + dataPointsAmt * barWidth;

	const evenWidth =
		placement === "top" || placement === "bottom"
			? Math.floor(autoBarWidth(trueWidth, dataPointsAmt))
			: Math.floor(autoBarWidth(trueHeight, dataPointsAmt));

	// const gap = roundToHalf(
	//   placement === "top" || placement === "bottom"
	//     ? (autoGap(width, dataPointsAmt))
	//     : (autoGap(height, dataPointsAmt)),
	// ) + 1

	const trueGap = gap / 0.5;

	const adjacentSurface =
		placement === "top" || placement === "bottom" ? trueHeight : trueWidth;

	let barDatalabels: string[] = [];

	if (dataLabels) {
		if (dataLabels === "literal") {
			barDatalabels = data.map(literalDataLabel);
		} else if (dataLabels === "percentage") {
			const grandTotal = data.slice().reduce((acc, curr) => acc + curr, 0);
			barDatalabels = data.map((n, i) => percentageDataLabel(n, i, grandTotal));
		} else if (typeof dataLabels === "function") {
			// STUB - going to need to revisit this eventually as I don't think this works how I was imaginging it would in terms of allowing additional parameters from users.
			barDatalabels = data.map(dataLabels);
		}
	}

	const tabular = {
		height,
		width,
		trueHeight,
		trueWidth,
		autoMax,
		adjacentSurface,
		evenWidth,
		gap,
		trueGap,
		dataPointsAmt,
	};
	console.table(tabular);

	const bars: string[][] = [];
	let constantBarWidth = evenWidth;

	for (let i = 0; i < dataPointsAmt; i++) {
		const datap = data[i];

		const p = asPercent(datap, autoMax);

		const trueDim = Math.floor(adjacentSurface * (p / 100));

		const [trueBarHeight, trueBarWidth] = asciiCalcBarDims(
			placement,
			trueDim,
			barWidth,
		);
		constantBarWidth = toporbottom ? trueBarWidth : trueBarHeight;
		// console.log(
		// 	"trueDim",
		// 	trueDim,
		// 	"trueBarHeight",
		// 	trueBarHeight,
		// 	"trueBarWidth",
		// 	trueBarWidth,
		// 	"constantBarWidth",
		// 	constantBarWidth,
		// );

		const bar = toporbottom
			? createVerticalBar(trueBarHeight, trueBarWidth, chosenChar)
			: createHorizontalBar(trueBarWidth, trueBarHeight, chosenChar);
		// if (placement === "bottom") bar = bar.reverse();
		// console.log(bar);
		bars.push(bar);

		// console.log(datap);
		// console.log(trueBarHeight, trueBarWidth);
		// console.log(createVerticalBar(trueBarHeight, trueBarWidth, chosenChar));
		// console.log("");
	}

	/*
	0123456789
	...abc...

	#####
	  50
	*/


	let lines = "";

	if (title && title !== "") {
		const numSpacesLeft = Math.ceil((trueWidth - title.length) / 2);
		if (title) {
			lines += `${" ".repeat(numSpacesLeft)}${bold(truncateString(title, trueWidth - (numSpacesLeft + title.length)))}\n`;
		}
	}

	if (placement === "bottom") {
		lines += `${autoMax}\n`;
	}

	if (placement !== "bottom") {
		if (placement !== "right") lines += "0";

		// Simplified ternary
		lines += `${placement === "right" ? autoMax : ""}${"▁".repeat(trueWidth)}${placement === "right" ? "0" : autoMax}\n`;

		/*
		// Shorter more correct version
		if(placement === "right") {
			lines += `${autoMax}${"▁".repeat(trueWidth)}0\n`;
		} else if(placement === "top") {
			lines += `${"▁".repeat(trueWidth)}\n`;
		} else if (placement === "left") {
			lines += `${"▁".repeat(trueWidth)}${autoMax}\n`;
		}
		*/

		/*
		// Original Big ternary
		lines += `${placement === "right" ? autoMax : ""}${"▁".repeat(
			(placement === "top" ? trueWidth : trueWidth - String(autoMax).length) +
				1,
		)}${placement === "right" ? "0" : ""}${placement === "left" ? autoMax : ""}\n`;

		// Top
		lines += `${""}${"▁".repeat(trueWidth)}${""}${""}\n`;

		// Right
		lines += `${autoMax}${"▁".repeat((trueWidth - String(autoMax).length) + 1)}${"0"}${""}\n`;

		// Left
		lines += `${""}${"▁".repeat((trueWidth - String(autoMax).length) + 1)}${""}${autoMax}\n`;
		*/
	}

	const pad = (amt: number) => {
		let base = " ".repeat(amt);
		if (String(amt).includes(".5")) base += "\u2009";
		return base;
	};

	console.log(data);
	console.log(barDatalabels);

	if (placement === "top") {
		for (let i = 0; i < trueHeight + 1; i++) {
			let line = "";
			for (let j = 0; j < dataPointsAmt; j++) {
				const barColor = colors[j % colors.length];
				if (j === 0) line += "▕";

				// if (bars[j].length === i) {
				// 	const dl = barDatalabels[j];
				// 	const numSpacesLeft = Math.ceil((barWidth - dl.length) / 2);

				// 	console.log("nsl", numSpacesLeft);
				// 	const lbl = " ".repeat(numSpacesLeft) + dl;
				// 	line += "#".repeat(numSpacesLeft) + dl;
				// } else {
				// 	console.log(i, j, "spaces:", gap);
				// 	line += "-".repeat(gap);
				// }
				line += " ".repeat(gap);

				// line += (bars[j][i] ?? " ".repeat(constantBarWidth));
				if (bars[j][i]) {
					line += colorString(bars[j][i], barColor);
				} else {
					if (bars[j].length === i && dataLabels) {
						const dataLabelColor = dataLabelColors[j % dataLabelColors.length];
						const dl = truncateString(barDatalabels[j], constantBarWidth);
						const numSpacesLeft = Math.floor(
							(constantBarWidth - dl.length) / 2,
						);
						const numSpacesRight =
							constantBarWidth - (dl.length + numSpacesLeft);

						line += `${" ".repeat(numSpacesLeft)}${colorString(dl, dataLabelColor)}${" ".repeat(numSpacesRight)}`;
					} else line += " ".repeat(constantBarWidth);
				}
				// line += bars[j][i]
				// 	? colorString(bars[j][i], barColor)
				// 	: " ".repeat(constantBarWidth);

				if (j === dataPointsAmt - 1) {
					line += pad(gap);
				}
			}
			lines += `${line}\n`;
		}
	}

	if (placement === "left") {
		const interval = gap + constantBarWidth;
		const offsetGap = gap - 1;
		const barLines = bars.flat();

		for (let i = 0; i < trueHeight; i++) {
			let line = "";
			const check = (i % interval) - 1;
			line += "▕";

			if (check < offsetGap) {
				line += " ".repeat(trueWidth + aMaxLen);
			} else {
				const adding = barLines.shift() ?? "";
				line += `${adding}${" ".repeat(trueWidth - adding.length + aMaxLen)}`;
			}

			lines += `${line}\n`;
		}
	}

	if (placement === "right") {
		const interval = gap + constantBarWidth;
		const offsetGap = gap - 1;
		const barLines = bars.flat();

		for (let i = 0; i < trueHeight; i++) {
			let line = "";
			const check = (i % interval) - 1;

			if (check < offsetGap) {
				line += " ".repeat(trueWidth+aMaxLen);
			} else {
				const adding = barLines.shift() ?? "";
				line += `${" ".repeat(trueWidth - adding.length + aMaxLen)}${adding}`;
			}
			line += "▏";

			lines += `${line}\n`;
		}
	}

	if (placement === "bottom") {
		for (let i = trueHeight; i >= 0; i--) {
			let line = "";
			for (let j = 0; j < dataPointsAmt; j++) {
				if (j === 0) line += "▕";
				line +=
					" ".repeat(gap) + (bars[j].at(i) ?? " ".repeat(constantBarWidth));
				if (j === dataPointsAmt - 1) {
					line += pad(gap);
				}
			}
			lines += `${line}\n`;
		}
	}

	if (placement === "bottom") {
		lines += "0";
		lines += `${"▔".repeat(trueWidth)}\n`;
	}

	if (placement !== "bottom") {
		// if (placement === "right")
		// 	lines += `${" ".repeat(trueWidth)}`;
		if (placement === "top") lines += `${autoMax}`;
	}
	// if (placement === "top") lines += `${Math.max(...data)}`;

	console.log("===");
	// console.log(lines);
	// console.log(rgb24(lines, { r: 225, g: 5, b: 71 }));
	// console.log(lines);
	// console.log(lines.replaceAll(" ", "."));

	// console.log(annotateBounds(lines));

	return lines;
}
