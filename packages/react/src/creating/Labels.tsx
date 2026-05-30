import { classNames, type ImageLabel } from "@jgmc/core";
import React, { type JSX } from "react";

export const createTextLabel = (
	label: string,
	x: number,
	y: number,
	labelColor: string,
	key: string,
): JSX.Element => {
	return (
		<text
			key={key}
			className={classNames.labelTextEle}
			x={x}
			y={y}
			fill={labelColor}
			textAnchor="middle"
			alignmentBaseline="middle"
		>
			{label}
		</text>
	);
};

export const createImageLabel = (
	imgLabel: ImageLabel,
	textX: number,
	textY: number,
	labelColor: string,
	subgrouping = false,
	width = 50,
	height = 50,
): JSX.Element => {
	if (subgrouping) {
		return (
			<g
				className={classNames.imageLabelGroupEle}
				transform={`translate(${textX}, ${textY})`}
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
				href={imgLabel.href}
				// alt={imgLabel.alt || ""}
				width={width}
				height={height}
				x={textX - width / 2}
				y={textY - height / 2}
				className={classNames.imageLabelEle}
			/>
		);
	}
};
