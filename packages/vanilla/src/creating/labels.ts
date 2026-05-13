import { esc, type ImageLabel } from "@jgmc/core";
import type { ImageAttrs, TextAttrs } from "$types";
import { classNames } from "../constants.ts";
import { combineAttrs } from "./common.ts";

export const createTextLabel = (
	label: string,
	x: number,
	y: number,
	labelColor: string,
	attrs?: TextAttrs,
) => {
	const textAttrs: TextAttrs = [
		["x", `${x}`],
		["y", `${y}`],
		["fill", labelColor],
		["class", classNames.labelTextEle],
		["text-anchor", "middle"],
		["alignment-baseline", "middle"],
	];
	if (attrs) textAttrs.push(...attrs);
	return `<text ${combineAttrs(textAttrs)}>${esc(label)}</text>`;
};

export const createImageLabel = (
	imgLabel: ImageLabel,
	textX: number,
	textY: number,
	labelColor: string,
	subgrouping = false,
	width = 50,
	height = 50,
) => {
	if (subgrouping) {
		const imgAttrs: ImageAttrs = [
			["href", imgLabel.href],
			["alt", imgLabel.alt || ""],
			["width", `${width}`],
			["height", `${height}`],
			["x", `${-width / 2}`],
			["y", `${-height / 2}`],
			["class", classNames.imageLabelEle],
		];
		const theImg = `<image ${combineAttrs(imgAttrs)} />`;
		let imgLabelGroupBody = "";
		if (imgLabel.topText)
			imgLabelGroupBody += createTextLabel(
				esc(imgLabel.topText),
				0,
				-20,
				labelColor,
			);
		imgLabelGroupBody += theImg;
		if (imgLabel.bottomText)
			imgLabelGroupBody += createTextLabel(
				esc(imgLabel.bottomText),
				0,
				20,
				labelColor,
			);

		return `<g ${combineAttrs([
			["class", classNames.imageLabelGroupEle],
			["transform", `translate(${textX}, ${textY})`],
		])}>${imgLabelGroupBody}</g>`;
	} else {
		const imgAttrs: ImageAttrs = [
			["href", imgLabel.href],
			["alt", imgLabel.alt || ""],
			["width", `${width}`],
			["height", `${height}`],
			["x", `${textX - width / 2}`],
			["y", `${textY - height / 2}`],
			["class", classNames.imageLabelEle],
		];
		const theImg = `<image ${combineAttrs(imgAttrs)} />`;
		return theImg;
	}
};
