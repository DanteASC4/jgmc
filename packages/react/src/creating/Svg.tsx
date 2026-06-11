import { classNames } from "@jgmc/core";
import { memo } from "react";
import type { PathProps, RectProps, SvgPropsCustom } from "$types";

export const Svg = memo(function Svg({
	width,
	height,
	vWidth,
	vHeight,
	children,
}: SvgPropsCustom) {
	return (
		<svg
			xmlnsXlink="http://www.w3.org/1999/xlink"
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			viewBox={`0 0 ${vWidth} ${vHeight}`}
		>
			<title>BarChart</title>
			{children}
		</svg>
	);
});

export const Rect = memo(function Rect({
	x,
	y,
	width,
	height,
	fill,
	stroke,
	strokeWidth,
}: RectProps) {
	return (
		<rect
			className={classNames.rectEle}
			x={x}
			y={y}
			width={width}
			height={height}
			fill={fill}
			stroke={stroke}
			strokeWidth={strokeWidth}
		/>
	);
});

export const Path = memo(function Path({
	d,
	fill,
	stroke,
	strokeWidth,
	strokeLinecap,
	strokeLinejoin,
}: PathProps) {
	return (
		<path
			className={classNames.pathEle}
			d={d}
			fill={fill}
			stroke={stroke}
			strokeWidth={strokeWidth}
			strokeLinecap={strokeLinecap}
			strokeLinejoin={strokeLinejoin}
		/>
	);
});
