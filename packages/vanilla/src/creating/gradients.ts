import {
	type GradientColor,
	type LinearGradientDirection,
	type LinearGradientType,
	randId,
} from "@jgmc/core";
import { createRect } from "./svg.ts";

const createStop = (color: string, offset: number) =>
	`<stop offset="${offset}%" stop-color="${color}" />`;

export const createLinearGradient = (
	colors: GradientColor[],
	gDir: LinearGradientDirection = "left-to-right",
	gMode: LinearGradientType,
	gId: string,
	gMask?: string,
	gMaskId?: string,
) => {
	const gid = gId;

	let dist = 1 / (colors.length - 1);
	const stops: string[] = [];

	for (let i = 0; i < colors.length; i++) {
		const cdist = i * dist * 100;

		let color: string;
		let stopOff: number = cdist;

		const hasStop = colors[i].includes(":");
		if (hasStop) {
			// This is kind of cursed but I think it should be performant.
			const [c, o] = colors[i].split(":");
			const [digits] = o.split("%");
			color = c;
			stopOff = Number(digits);
			dist -= stopOff / 100;
		} else {
			color = colors[i];
		}

		stops.push(createStop(color, stopOff));
	}

	let gDirection = "";
	if (gDir === "left-to-right") gDirection = "rotate(0,0.5,0.5)";
	else if (gDir === "right-to-left") gDirection = "rotate(180,0.5,0.5)";
	else if (gDir === "top-to-bottom") gDirection = "rotate(90,0.5,0.5)";
	else if (gDir === "bottom-to-top") gDirection = "rotate(270,0.5,0.5)";
	else gDirection = `rotate(${gDir},0.5,0.5)`;

	if (gMode === "individual") {
		const defs = `<defs><linearGradient id="${gid}" gradientTransform="${gDirection}">${stops.join("")}</linearGradient></defs>`;
		return [defs, null] as const;
	} else {
		const defs = `<defs><linearGradient id="${gid}" gradientTransform="${gDirection}">${stops.join("")}</linearGradient>${gMask ?? ""}</defs>`;
		const bg = `<rect ${gMaskId ? `mask="url('#${gMaskId}')" ` : ""}x="0" y="0" width="100%" height="100%" fill="url('#${gid}')" />`;
		return [defs, bg] as const;
	}
};

export const createBarChartMask = (bars: string[]) => {
	const maskId = randId();
	const bg = createRect(0, 0, "100%", "100%", "#000000");
	const mask = `<mask id="${maskId}">${bg}${bars.join("")}</mask>`;
	return [maskId, mask] as const;
};

export const createPathChartMask = (lines: string[]) => {
	const maskId = randId();
	const bg = createRect(0, 0, "100%", "100%", "#000000");
	const mask = `<mask id="${maskId}">${bg}${lines.join("")}</mask>`;
	return [maskId, mask] as const;
};
