export const calcPieSliceCentroidCoords = (
	arcLength: number,
	prevAngleRads: number,
	radius: number,
	center: [number, number],
	quarterTurnAngle: number,
): [number, number] => {
	const innerAngleRads = arcLength / radius;

	const theta = innerAngleRads * 0.5;
	const bisectorAngle = theta + prevAngleRads;

	const theta3 = theta * 3;
	const centroidDist = (2 * radius * Math.sin(theta)) / theta3;

	const preferredDist = radius * 0.55;
	const outwardOffset =
		centroidDist < preferredDist ? (preferredDist - centroidDist) * 0.5 : 0;

	const visualCentroidDist = centroidDist + outwardOffset;

	return [
		center[0] + visualCentroidDist * Math.cos(bisectorAngle - quarterTurnAngle),
		center[1] + visualCentroidDist * Math.sin(bisectorAngle - quarterTurnAngle),
	];
};
