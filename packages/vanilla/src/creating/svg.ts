import type { StringOrNumber } from "@jgmc/core";
import type { GroupAttrs, RectAttrs, SvgAttrs } from "$types";
import { combineAttrs } from "./common.ts";

export const createGroup = (content: string, attrs?: GroupAttrs) => {
	return `<g${attrs ? ` ${combineAttrs(attrs)}` : ""}>${content}</g$>`;
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
	];
	return `<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" ${combineAttrs(svgAttrs)}>${body}</svg>`;
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
	];
	if (stroke) rectAttrs.push(["stroke", stroke]);
	if (strokeWidth) rectAttrs.push(["stroke-width", `${strokeWidth}`]);

	return `<rect ${combineAttrs(rectAttrs)} />`;
};
