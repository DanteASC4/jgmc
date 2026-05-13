import type { LineCaps, StringOrNumber } from "@jgmc/core";
import type { GroupAttrs, PathAttrs, RectAttrs, SvgAttrs } from "$types";
import { classNames } from "../constants.ts";
import { combineAttrs } from "./common.ts";

export const createGroup = (content: string, attrs?: GroupAttrs) => {
  const groupAttrs: GroupAttrs = attrs ?? [];
  groupAttrs.push(["class", classNames.groupEle]);
  return `<g${combineAttrs(groupAttrs)}>${content}</g$>`;
};

export const createSvg = (
  vWidth: StringOrNumber,
  vHeight: StringOrNumber,
  width: StringOrNumber,
  height: StringOrNumber,
  body: string,
) => {
  const svgAttrs: SvgAttrs = [
    ["width", `${width}`],
    ["height", `${height}`],
    ["viewBox", `0 0 ${vWidth} ${vHeight}`],
    ["class", classNames.svgEle],
  ];
  return `<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" ${
    combineAttrs(
      svgAttrs,
    )
  }>${body}</svg>`;
};

export const createRect = (
  x: number,
  y: number,
  width: StringOrNumber,
  height: StringOrNumber,
  fill: string,
  stroke?: string,
  strokeWidth?: StringOrNumber,
) => {
  const rectAttrs: RectAttrs = [
    ["x", `${x}`],
    ["y", `${y}`],
    ["width", `${width}`],
    ["height", `${height}`],
    ["fill", fill],
    ["class", classNames.rectEle],
  ];
  if (stroke) rectAttrs.push(["stroke", stroke]);
  if (strokeWidth) rectAttrs.push(["stroke-width", `${strokeWidth}`]);

  return `<rect ${combineAttrs(rectAttrs)} />`;
};

export const createPath = (
  d: string,
  { stroke, strokeWidth, linecap, fill }: {
    stroke?: string;
    strokeWidth?: StringOrNumber;
    linecap?: LineCaps;
    fill?: string;
  },
  attrs?: PathAttrs,
) => {
  const pathAttrs: PathAttrs = [
    ["d", d],
    ["class", classNames.pathEle],
  ];
  if (stroke) pathAttrs.push(["stroke", stroke]);
  if (strokeWidth) pathAttrs.push(["stroke-width", `${strokeWidth}`]);
  if (linecap) pathAttrs.push(["stroke-linecap", linecap]);
  if (fill) pathAttrs.push(["fill", fill]);
  if (attrs) pathAttrs.push(...attrs);

  return `<path ${combineAttrs(pathAttrs)} />`;
};
