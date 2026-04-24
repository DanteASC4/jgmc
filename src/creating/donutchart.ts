import { midpoint } from "../math/common.ts";
import { createSVGElement } from "./common.ts";

export const drawDonutSlice = (
  coord: [number, number],
  coordTo: [number, number],
  largeArc: boolean,
  radius: number,
  center: [number, number],
  fill: string,
  strokeColor?: string,
  strokeWidth?: number,
) => {
  const path = createSVGElement("path");
  const largeArcFlag = largeArc ? '1' : '0';
  const midpointStart = midpoint(coord[0], coord[1], center[0], center[1]);
  const midpointEnd = midpoint(coordTo[0], coordTo[1], center[0], center[1]);

  const pathToDraw = `M ${coord[0]} ${coord[1]}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${coordTo[0]} ${coordTo[1]}
    L ${midpointEnd[0]} ${midpointEnd[1]}
    A ${radius*0.5} ${radius*0.5} 0 ${largeArcFlag} 0 ${midpointStart[0]} ${midpointStart[1]}
    L ${coord[0]} ${coord[1]}
    Z`;

  path.setAttribute("d", pathToDraw);
  path.setAttribute("fill", fill);

  if (strokeColor) path.setAttribute("stroke", strokeColor);
  if (strokeWidth) path.setAttribute("stroke-width", `${strokeWidth}`);

  return path as SVGPathElement;
}