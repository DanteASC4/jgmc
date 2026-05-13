import { chunk } from "@std/collections/chunk";
import { midpoint } from "./common.ts";

export const calcSmoothControlPoints = (
  coordFrom: [number, number],
  coordTo: [number, number],
): [number, number, number, number] => {
  const mx = (coordTo[0] + coordFrom[0]) / 2;
  return [mx, coordFrom[1], mx, coordTo[1]];
};

export const autoOffset = (width: number, numPoints: number) =>
  width / numPoints;

export const genSingleControlPoint = (
  coord1: [number, number],
  coord2: [number, number],
) => {
  const x1 = coord1[0];
  const y1 = coord1[1];
  const x2 = coord2[0];
  const y2 = coord2[1];

  const moveamt = 3;
  const [xMP, yMP] = midpoint(x1, y1, x2, y2);

  const controlP: [number, number] = [xMP + moveamt, yMP + moveamt];

  return controlP;
};

export const genControlPoints = (coords: [number, number][]) => {
  const controlPoints: [number, number][] = [];
  const asPairs = chunk(coords, 2);
  let i = 0;
  let lastX = 0;
  let lastY = 0;
  const moveamt = 3;
  for (const pairs of asPairs) {
    const x1 = pairs[0][0];
    const y1 = pairs[0][1];
    const x2 = pairs[1] ? pairs[1][0] : lastX;
    const y2 = pairs[1] ? pairs[1][1] : lastY;
    lastX = x2;
    lastY = y2;

    const [xMP, yMP] = midpoint(x1, y1, x2, y2);

    const controlO = i % 2 === 0 ? -moveamt : moveamt;
    const controlP: [number, number] = [xMP + controlO, yMP + controlO];
    controlPoints.push(controlP);
    i++;
  }
  return controlPoints;
};

export const genCoordsStraight = (
  vals: number[],
  offset: number,
  max: number,
  min: number,
) => {
  const coords: [number, number][] = [];
  for (let i = 0; i < vals.length; i++) {
    const x = offset * i;
    const v = vals[i];
    const y = max - (v - min) + min;
    coords.push([x, y]);
  }
  return coords;
};
