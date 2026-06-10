import type {
	BarChartNumericalOptions,
	BarChartStackedOptions,
	GradientColor,
	ImageLabel,
	LinearGradientDirection,
	LinearGradientType,
} from "@jgmc/core";
import type React from "react";
import type { Ref } from "react";
import type { StringOrNumber } from "../core/types.ts";

export type BarChartProps = BarChartNumericalOptions &
	React.SVGProps<SVGSVGElement> & {
		ref?: Ref<SVGSVGElement>;
	};

export type BarChartStackedProps = BarChartStackedOptions &
	React.SVGProps<SVGSVGElement> & {
		ref?: Ref<SVGSVGElement>;
	};

//? The "custom" is added here to differentiate from the standard SVGProps
export type SvgPropsCustom = {
	width: number;
	height: number;
	vWidth: number;
	vHeight: number;
	children?: React.ReactNode;
};

export type RectProps = {
	x: number;
	y: number;
	width: StringOrNumber;
	height: StringOrNumber;
	fill: string;
	key: string;
	stroke?: string;
	strokeWidth?: StringOrNumber;
};

export type PathProps = Omit<React.SVGProps<SVGPathElement>, "strokeWidth"> & {
	d: string;
	fill?: string;
	key: string;
	stroke?: string;
	strokeWidth?: StringOrNumber;
};

export type TextLabelProps = {
	label: string;
	x: number;
	y: number;
	labelColor: string;
	key: string;
	fontSize?: number;
	fontFamily?: string;
	fontWeight?: StringOrNumber;
};

export type ImageLabelProps = {
	imgLabel: ImageLabel;
	x: number;
	y: number;
	labelColor: string;
	key: string;
	subgrouping?: boolean;
	width?: number;
	height?: number;
};

export type StopProps = {
	color: string;
	offset: number;
};

export type LinearGradientProps = {
	colors: GradientColor[];
	gDir: LinearGradientDirection;
	gMode: LinearGradientType;
	gId: string;
	gMask?: React.ReactNode;
	gMaskId?: string;
};

export type BarChartMaskProps = {
	maskId: string;
	children: React.ReactNode[];
};

export type PathChartMaskProps = {
	maskId: string;
	children: React.ReactNode[];
};
