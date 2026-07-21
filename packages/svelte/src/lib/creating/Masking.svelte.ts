import { classNames } from "@jgmc/core";
import { createRawSnippet, type Snippet } from "svelte";

type MaskingBarProps = {
	x: number;
	y: number;
	width: number;
	height: number;
	fill: string;
	stroke?: string;
	strokeWidth?: string;
};

export const maskingBar: Snippet<[MaskingBarProps]> = createRawSnippet(
	(getProps: () => MaskingBarProps) => {
		return {
			render: () => {
				const { x, y, width, height, fill, stroke, strokeWidth } = getProps();
				const strokeAttr = stroke ? `strok="${stroke}"` : "";
				const strokeWidthAttr = strokeWidth
					? `stroke-width="${strokeWidth}"`
					: "";

				return `<rect class="${classNames.rectEle}" x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" ${strokeAttr} ${strokeWidthAttr} />`;
			},
		};
	},
);
