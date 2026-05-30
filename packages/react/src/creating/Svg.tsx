import { classNames, type StringOrNumber } from "@jgmc/core";
import React, { type JSX } from "react";

export const createRect = (
	x: number,
	y: number,
	width: StringOrNumber,
	height: StringOrNumber,
	fill: string,
	key: string,
	stroke?: string,
	strokeWidth?: StringOrNumber,
): JSX.Element => {
	return (
		<rect
			key={key}
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
};
