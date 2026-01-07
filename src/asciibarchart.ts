import {
  createVerticalBar,
  getChosenChar,
} from "./ascii-creating/asciibarchart.ts";
import { asciiCalcBarDims } from "./math/asciibarchart.ts";
import { autoBarWidth } from "./math/barcharts-common.ts";
import { asPercent, autoGap } from "./math/common.ts";
import { AsciiBarChartOptions } from "./types.ts";
import { autoMaxNumerical, roundToHalf } from "./utils/general-operations.ts";
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
  // const { columns, rows } = Deno.consoleSize();
  const chosenChar = getChosenChar(barCharacter);
  const autoMax = autoMaxNumerical(data);
  const dataPointsAmt = data.length;
  const toporbottom = placement === "top" || placement === "bottom";

  const numGaps = dataPointsAmt + 1;

  const trueWidth = toporbottom
    ? (numGaps * gap) + (dataPointsAmt * barWidth)
    : width - (width * .3);
  const trueHeight = toporbottom
    ? height - (height * .3)
    : (numGaps * gap) + (dataPointsAmt * barWidth);

  const evenWidth = placement === "top" || placement === "bottom"
    ? Math.floor(autoBarWidth(trueWidth, dataPointsAmt))
    : Math.floor(autoBarWidth(trueHeight, dataPointsAmt));

  // const gap = roundToHalf(
  //   placement === "top" || placement === "bottom"
  //     ? (autoGap(width, dataPointsAmt))
  //     : (autoGap(height, dataPointsAmt)),
  // ) + 1

  const trueGap = gap / .5;

  const adjacentSurface = placement === "top" || placement === "bottom"
    ? trueHeight
    : trueWidth;

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
    constantBarWidth = trueBarWidth;
    console.log(
      "trueDim",
      trueDim,
      "trueBarHeight",
      trueBarHeight,
      "trueBarWidth",
      trueBarWidth,
    );

    let bar = createVerticalBar(trueBarHeight, trueBarWidth, chosenChar);
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

  if (placement === "bottom") lines += `${Math.max(...data)}\n`;

  if (placement === "top") {
    lines += "0";
    lines += "▁".repeat(trueWidth) + "\n";
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
        line += " ".repeat(gap) +
          (bars[j][i] ?? " ".repeat(constantBarWidth));
        if (j === dataPointsAmt - 1) {
          line += pad(gap);
        }
      }
      lines += line + "\n";
    }
  }

  if (placement === "bottom") {
    for (let i = trueHeight; i >= 0; i--) {
      let line = "";
      for (let j = 0; j < dataPointsAmt; j++) {
        if (j === 0) line += "▕";
        line += " ".repeat(gap) +
          (bars[j].at(i) ?? " ".repeat(constantBarWidth));
        if (j === dataPointsAmt - 1) {
          line += pad(gap);
        }
      }
      lines += line + "\n";
    }
  }

  if (placement === "bottom") {
    lines += "0";
    lines += "▔".repeat(trueWidth) + "\n";
  }

  if (placement === "top") lines += `${Math.max(...data)}`;

  console.log("===");
  console.log(lines);

  return "";
}
