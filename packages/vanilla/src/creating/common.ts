import { esc } from "@jgmc/core";
import type { AttributePairs } from "$types";

export const combineAttrs = <Known extends string>(
	attrs: AttributePairs<Known>,
) => {
	return attrs.map(([k, v]) => `${esc(k)}="${esc(v)}"`).join(" ");
};
