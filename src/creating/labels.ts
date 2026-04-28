import type { ImageLabel } from "../types.ts";
import { createSVGElement } from "./common.ts";

export const createLabel = (
	label: string,
	textX: number,
	textY: number,
	labelColor: string,
) => {
	const text = createSVGElement("text") as SVGTextElement;

	text.setAttribute("fill", labelColor);
	text.setAttribute("x", `${textX}`);
	text.setAttribute("y", `${textY}`);
	// text.setAttribute("title", `Bar label ${label}`);
	text.setAttribute("text-anchor", "middle");
	text.setAttribute("alignment-baseline", "middle");
	text.textContent = label;

	return text;
};

export const createImageLabel = (
	imgLabel: ImageLabel,
	textX: number,
	textY: number,
	labelColor: string,
	subgrouping = false,
	textClass?: string,
	imgLabelClass?: string,
	imgLabelGroupClass?: string,
	width = 50,
	height = 50,
) => {
	if (subgrouping) {
		const imageLabelSubGroup = createSVGElement("g");
		imageLabelSubGroup.classList.add("tmc-image-label-group");
		imageLabelSubGroup.setAttribute(
			"transform",
			`translate(${textX}, ${textY})`,
		);
		if (imgLabelGroupClass)
			imageLabelSubGroup.classList.add(imgLabelGroupClass);

		const topText = createLabel(imgLabel.topText || "", 0, -20, labelColor);
		const bottomText = createLabel(
			imgLabel.bottomText || "",
			0,
			20,
			labelColor,
		);
		if (textClass) {
			topText.classList.add(textClass);
			bottomText.classList.add(textClass);
		}

		const img = createSVGElement("image");
		img.setAttribute("href", imgLabel.href);
		img.setAttribute("alt", imgLabel.alt || "");
		img.setAttribute("width", String(width));
		img.setAttribute("height", String(height));
		// center at subgroup origin
		img.setAttribute("x", String(-width / 2));
		img.setAttribute("y", String(-height / 2));
		img.setAttribute("class", "tmc-image-label");
		if (imgLabelClass) img.classList.add(imgLabelClass);

		if (topText) imageLabelSubGroup.appendChild(topText);
		imageLabelSubGroup.appendChild(img);
		if (bottomText) imageLabelSubGroup.appendChild(bottomText);
		return imageLabelSubGroup;
	} else {
		const img = createSVGElement("image");
		img.setAttribute("href", imgLabel.href);
		img.setAttribute("alt", imgLabel.alt || "");

		img.setAttribute("width", String(width));
		img.setAttribute("height", String(height));
		img.setAttribute("x", String(textX - width / 2));
		img.setAttribute("y", String(textY - height / 2));

		img.setAttribute("class", "tmc-image-label");

		if (imgLabelClass) img.classList.add(imgLabelClass);

		return img;
	}
};
