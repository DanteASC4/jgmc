import type { LineCaps, StringOrNumber } from "@jgmc/core";
import type {
	GroupAttrs,
	GroupAttrsArr,
	PathAttrs,
	PathAttrsArr,
	RectAttrs,
	SvgAttrs,
} from "$types";
import { classNames } from "../constants.ts";
import { combineAttrs } from "./common.ts";

export const createGroup = (content: string, attrs?: GroupAttrsArr) => {
	const groupAttrs: GroupAttrs = new Map(attrs ?? []);
	groupAttrs.set("class", classNames.groupEle);
	return `<g${combineAttrs(groupAttrs)}>${content}</g>`;
};

export const createSvg = (
	vWidth: StringOrNumber,
	vHeight: StringOrNumber,
	width: StringOrNumber,
	height: StringOrNumber,
	body: string,
) => {
	const svgAttrs: SvgAttrs = new Map([
		["width", `${width}`],
		["height", `${height}`],
		["viewBox", `0 0 ${vWidth} ${vHeight}`],
		["class", classNames.svgEle],
	]);
	return `<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" ${combineAttrs(
		svgAttrs,
	)}>${body}</svg>`;
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
	const rectAttrs: RectAttrs = new Map([
		["x", `${x}`],
		["y", `${y}`],
		["width", `${width}`],
		["height", `${height}`],
		["fill", fill],
		["class", classNames.rectEle],
	]);
	if (stroke) rectAttrs.set("stroke", stroke);
	if (strokeWidth) rectAttrs.set("stroke-width", `${strokeWidth}`);

	return `<rect ${combineAttrs(rectAttrs)} />`;
};

export const createPath = (
	d: string,
	{
		stroke,
		strokeWidth,
		linecap,
		fill,
	}: {
		stroke?: string;
		strokeWidth?: StringOrNumber;
		linecap?: LineCaps;
		fill?: string;
	},
	attrs?: PathAttrsArr,
) => {
	const pathAttrs: PathAttrs = new Map([
		["d", d],
		["class", classNames.pathEle],
	]);
	if (stroke) pathAttrs.set("stroke", stroke);
	if (strokeWidth) pathAttrs.set("stroke-width", `${strokeWidth}`);
	if (linecap) pathAttrs.set("stroke-linecap", linecap);
	if (fill) pathAttrs.set("fill", fill);
	if (attrs)
		attrs.forEach(([k, v]) => {
			pathAttrs.set(k, v);
		});

	return `<path ${combineAttrs(pathAttrs)} />`;
};
