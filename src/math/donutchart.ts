export const calcDonutSliceCentroidCoords = (
	arcLength: number,
	prevAngleRads: number,
	radius: number,
	center: [number, number],
	quarterTurnAngle: number,
): [number, number] => {
  const innerAngleRads = arcLength / radius;

  const theta = innerAngleRads * 0.5;
  const bisectorAngle = theta + prevAngleRads;

  const outwardsOffset = radius * 0.75;
  const centroidDist = outwardsOffset;

  return [
    center[0] + centroidDist * Math.cos(bisectorAngle - quarterTurnAngle),
    center[1] + centroidDist * Math.sin(bisectorAngle - quarterTurnAngle),
  ]
}