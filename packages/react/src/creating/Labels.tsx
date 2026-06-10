import { classNames } from "@jgmc/core";
import React, { memo } from "react";
import type { ImageLabelProps, TextLabelProps } from "$types";

export const TextLabel = memo(function TextLabel({
	label,
	x,
	y,
	labelColor,
	key,
	fontSize,
	fontFamily,
	fontWeight,
}: TextLabelProps) {
	return (
		<text
			key={key}
			className={classNames.labelTextEle}
			x={x}
			y={y}
			fill={labelColor}
			textAnchor="middle"
			alignmentBaseline="middle"
			fontSize={fontSize}
			fontFamily={fontFamily}
			fontWeight={fontWeight}
		>
			{label}
		</text>
	);
});

// View added here to differentiate from the `ImageLabel` type, may change at some point
export const ImageLabelView = memo(function ImageLabel({
	imgLabel,
	x,
	y,
	labelColor,
	key,
	subgrouping = false,
	width = 50,
	height = 50,
}: ImageLabelProps) {
	if (subgrouping) {
		return (
			<g
				className={classNames.imageLabelGroupEle}
				transform={`translate(${x}, ${y})`}
				key={key}
			>
				{imgLabel.topText && (
					<text
						x={0}
						y={-20}
						fill={labelColor}
						className={classNames.labelTextEle}
						textAnchor="middle"
						alignmentBaseline="middle"
					>
						{imgLabel.topText}
					</text>
				)}
				<image
					href={imgLabel.href}
					// alt={imgLabel.alt || ""}
					width={width}
					height={height}
					x={-width / 2}
					y={-height / 2}
					className={classNames.imageLabelEle}
				/>
				{imgLabel.bottomText && (
					<text
						x={0}
						y={20}
						fill={labelColor}
						className={classNames.labelTextEle}
						textAnchor="middle"
						alignmentBaseline="middle"
					>
						{imgLabel.bottomText}
					</text>
				)}
			</g>
		);
	} else {
		return (
			<image
				key={key}
				href={imgLabel.href}
				// alt={imgLabel.alt || ""}
				width={width}
				height={height}
				x={x - width / 2}
				y={y - height / 2}
				className={classNames.imageLabelEle}
			/>
		);
	}
});
