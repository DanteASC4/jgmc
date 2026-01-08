import {
	createHorizontalBar,
	createVerticalBar,
	getChosenChar,
} from "./ascii-creating/asciibarchart.ts";
import { asciiCalcBarDims } from "./math/asciibarchart.ts";
import { autoBarWidth } from "./math/barcharts-common.ts";
import { asPercent } from "./math/common.ts";
import type { AsciiBarChartOptions } from "./types.ts";
import { autoMaxNumerical } from "./utils/general-operations.ts";
import { annotateBounds } from "./utils/misc.ts";

const AsciiBarChartDefaults = {
	placement: "top",
	barCharacter: "solid",
	barWidth: 3,
	gap: 3,
	width: 80,
	height: 24,
} as const;

export function asciiBarchart({
	data,
	placement = AsciiBarChartDefaults.placement,
	barCharacter = AsciiBarChartDefaults.barCharacter,
	barWidth = AsciiBarChartDefaults.barWidth,
	gap = AsciiBarChartDefaults.gap,
	width = AsciiBarChartDefaults.width,
	height = AsciiBarChartDefaults.height,
}: AsciiBarChartOptions) {
	const chosenChar = getChosenChar(barCharacter);
	const autoMax = autoMaxNumerical(data);
	const dataPointsAmt = data.length;
	const toporbottom = placement === "top" || placement === "bottom";

	const numGaps = dataPointsAmt + 1;

	const trueWidth = toporbottom
		? numGaps * gap + dataPointsAmt * barWidth
		: width - width * 0.3;
	const trueHeight = toporbottom
		? height - height * 0.3
		: numGaps * gap + dataPointsAmt * barWidth;

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

	let lines = "";

	/*

01234567890123456789
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
   ███   ███   ███aaa


  */

	if (placement === "bottom") lines += `${autoMax}\n`;

	if (placement !== "bottom") {
		if (placement !== "right") lines += "0";

		lines += `${placement==="right"?autoMax:""}${"▁".repeat(trueWidth - String(autoMax).length)}${placement === "right" ? "0" : ""}${placement==="left"?autoMax:""}\n`;
		// if (placement === "top") lines += `${"▁".repeat(trueWidth)}\n`;
		// // if (placement === "top") lines += `${"▔".repeat(trueWidth)}\n`;
		// else
		// 	lines += `${"▁".repeat(trueWidth)}${placement === "right" ? "0" : ""}\n`;
	}

	const pad = (amt: number) => {
		let base = " ".repeat(amt);
		if (String(amt).includes(".5")) base += "\u2009";
		return base;
	};

	if (placement === "top") {
		for (let i = 0; i < trueHeight; i++) {
			let line = "";
			for (let j = 0; j < dataPointsAmt; j++) {
				if (j === 0) line += "▕";
				line += " ".repeat(gap) + (bars[j][i] ?? " ".repeat(constantBarWidth));
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
				line += " ".repeat(trueWidth);
			} else {
				const adding = barLines.shift() ?? "";
				line += `${adding}${" ".repeat(trueWidth - adding.length)}`;
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
				line += " ".repeat(trueWidth);
			} else {
				const adding = barLines.shift() ?? "";
				line += `${" ".repeat(trueWidth - adding.length)}${adding}`;
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
		if (placement === "right")
			lines += `${" ".repeat(trueWidth - String(autoMax).length)}`;
		else if(placement === "top") lines += `${autoMax}`;
	}
	// if (placement === "top") lines += `${Math.max(...data)}`;

	console.log("===");
	console.log(lines);

	// console.log(annotateBounds(lines));

	return "";
}
