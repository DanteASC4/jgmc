import { memo } from "react";
import type {
	BarChartMaskProps,
	LinearGradientProps,
	PathChartMaskProps,
} from "$types";

const createStop = (color: string, offset: number) => (
	<stop offset={`${offset}%`} stopColor={color} />
);

export const LinearGradientDefs = memo(function LinearGradientDefs({
	colors,
	gDir,
	gMode,
	gId,
	gMask,
	gMaskId,
}: LinearGradientProps) {
	let dist = 1 / (colors.length - 1);
	const stops = [];

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

	return (
		<>
			<defs>
				<linearGradient id={gId} gradientTransform={gDirection}>
					{stops}
				</linearGradient>
				{gMask}
			</defs>
			{gMode === "continuous" && (
				<rect
					{...(gMaskId ? { mask: `url('#${gMaskId}')` } : {})}
					x="0"
					y="0"
					width="100%"
					height="100%"
					fill={`url('#${gId}')`}
				/>
			)}
		</>
	);
});

export const BarChartMask = memo(function BarChartMask({
	maskId,
	children,
}: BarChartMaskProps) {
	return (
		<mask id={maskId}>
			<rect x="0" y="0" width="100%" height="100%" fill="#000000" />
			{children}
		</mask>
	);
});

export const PathChartMask = memo(function PathChartMask({
	maskId,
	children,
}: PathChartMaskProps) {
	return (
		<mask id={maskId}>
			<rect x="0" y="0" width="100%" height="100%" fill="#000000" />
			{children}
		</mask>
	);
});
