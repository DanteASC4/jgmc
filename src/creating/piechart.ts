import { createSVGElement } from "./common.ts";

export const drawPieSlice = (
	coord: [number, number, number],
	coordTo: [number, number, number],
	largeArc: boolean,
	radius: number,
	center: [number, number],
	fill: string,
	strokeColor?: string,
	strokeWidth?: number,
) => {
	const path = createSVGElement("path");
	const largeArcFlag = largeArc ? "1" : "0";

	const pathToDraw = `M ${coord[0]} ${coord[1]}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${coordTo[0]} ${coordTo[1]}
    L ${center[0]} ${center[1]} Z`;

	path.setAttribute("d", pathToDraw);
	path.setAttribute("fill", fill);

	if (strokeColor) path.setAttribute("stroke", strokeColor);
	if (strokeWidth) path.setAttribute("stroke-width", `${strokeWidth}`);

	return path as SVGPathElement;
};
