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

		const bar = toporbottom
			? createVerticalBar(trueBarHeight, trueBarWidth, chosenChar)
			: createHorizontalBar(trueBarWidth, trueBarHeight, chosenChar);
		bars.push(bar);
	}

	let lines = "";

	if (title && title !== "") {
		const safeTitle = truncateString(title, Math.max(1, trueWidth));
		const numSpacesLeft = Math.max(
			0,
			Math.ceil((trueWidth - safeTitle.length) / 2),
		);
		lines += `${" ".repeat(numSpacesLeft)}${bold(safeTitle)}\n`;
	}

	if (placement === "bottom") {
		lines += `${autoMax}\n`;
	}

	// Axis line building
	if (placement !== "bottom") {
		if (placement !== "right") lines += "0";

		lines += `${placement === "right" ? autoMax : ""}${"▁".repeat(trueWidth)}${placement === "right" ? "0" : autoMax}\n`;
	}

	// I don't remember why I made this, but I think I was trying to cheat spacing since u2009 is a half space lol. I checked if the ".5" is hit with a couple datasets but it wasn't hit, though I'm not confident it's never hit.
	// Leaving for now
	const pad = (amt: number) => {
		let base = " ".repeat(amt);
		if (String(amt).includes(".5")) base += "\u2009";
		return base;
	};

	const shouldRenderDataLabels = Boolean(
		dataLabels && barDatalabels.length > 0,
	);
	const sideLabelWidth = shouldRenderDataLabels
		? Math.max(aMaxLen, ...barDatalabels.map((label) => label.length)) + 1
		: aMaxLen;
	const createCenteredDataLabel = (idx: number) => {
		const dataLabelColor = dataLabelColors[idx % dataLabelColors.length];
		const dl = truncateString(barDatalabels[idx], constantBarWidth);
		const numSpacesLeft = Math.floor((constantBarWidth - dl.length) / 2);
		const numSpacesRight = constantBarWidth - (dl.length + numSpacesLeft);

		return `${" ".repeat(numSpacesLeft)}${colorString(dl, dataLabelColor)}${" ".repeat(numSpacesRight)}`;
	};
	const createSideDataLabel = (idx: number) => {
		const dataLabelColor = dataLabelColors[idx % dataLabelColors.length];
		const label = barDatalabels[idx];
		const trailingSpaces = Math.max(0, sideLabelWidth - label.length);

		return `${colorString(label, dataLabelColor)}${" ".repeat(trailingSpaces)}`;
	};
	const createSideDataLabelBeforeBar = (idx: number) => {
		const dataLabelColor = dataLabelColors[idx % dataLabelColors.length];
		const label = barDatalabels[idx];
		const leadingSpaces = Math.max(0, sideLabelWidth - label.length);

		return `${" ".repeat(leadingSpaces)}${colorString(label, dataLabelColor)}`;
	};

	if (placement === "top") {
		for (let i = 0; i < trueHeight + 1; i++) {
			let line = "";
			for (let j = 0; j < dataPointsAmt; j++) {
				const barColor = colors[j % colors.length];
				if (j === 0) line += "▕";
				line += " ".repeat(gap);

				if (bars[j][i]) {
					line += colorString(bars[j][i], barColor);
				} else {
					if (bars[j].length === i && shouldRenderDataLabels) {
						line += createCenteredDataLabel(j);
					} else line += " ".repeat(constantBarWidth);
				}

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
			const currentBarIdx = Math.floor(i / interval);
			const barColor = colors[currentBarIdx % colors.length];
			const isLabelRow =
				shouldRenderDataLabels &&
				currentBarIdx < dataPointsAmt &&
				i % interval === gap + Math.floor(constantBarWidth / 2);
			line += "▕";

			if (check < offsetGap) {
				line += " ".repeat(trueWidth + sideLabelWidth);
			} else {
				const adding = barLines.shift() ?? "";
				line += colorString(adding, barColor);
				line += isLabelRow
					? createSideDataLabel(currentBarIdx)
					: " ".repeat(sideLabelWidth);
				line += " ".repeat(trueWidth - adding.length);
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
			const currentBarIdx = Math.floor(i / interval);
			const barColor = colors[currentBarIdx % colors.length];
			const isLabelRow =
				shouldRenderDataLabels &&
				currentBarIdx < dataPointsAmt &&
				i % interval === gap + Math.floor(constantBarWidth / 2);

			if (check < offsetGap) {
				line += " ".repeat(trueWidth + sideLabelWidth);
			} else {
				const adding = barLines.shift() ?? "";
				line += " ".repeat(trueWidth - adding.length);
				line += isLabelRow
					? createSideDataLabelBeforeBar(currentBarIdx)
					: " ".repeat(sideLabelWidth);
				line += colorString(adding, barColor);
			}
			line += "▏";

			lines += `${line}\n`;
		}
	}

	if (placement === "bottom") {
		for (let i = Math.floor(trueHeight); i >= 0; i--) {
			let line = "";
			for (let j = 0; j < dataPointsAmt; j++) {
				const barColor = colors[j % colors.length];
				if (j === 0) line += "▕";
				line += " ".repeat(gap);
				if (bars[j].at(i)) {
					line += colorString(bars[j].at(i) ?? "", barColor);
				} else if (bars[j].length === i && shouldRenderDataLabels) {
					line += createCenteredDataLabel(j);
				} else {
					line += " ".repeat(constantBarWidth);
				}
				// line +=
				// 	" ".repeat(gap) + (bars[j].at(i) ?? " ".repeat(constantBarWidth));
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

	return lines;
}
