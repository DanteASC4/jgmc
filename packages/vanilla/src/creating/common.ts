import { esc } from "@jgmc/core";
import type { AttributeMap, AttributePairs } from "$types";

export const combineAttrsArr = <Known extends string>(
	attrs: AttributePairs<Known>,
) => {
	return attrs.map(([k, v]) => `${esc(k)}="${esc(v)}"`).join(" ");
};

export const combineAttrs = <Known extends string>(
	attrs: AttributeMap<Known>,
): string => {
	return Array.from(attrs)
		.map(([k, v]) => `${esc(k)}="${esc(v)}"`)
		.join(" ");
};
