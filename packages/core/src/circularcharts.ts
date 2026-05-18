export const decimalPercentsToStarts = (decimalPercents: number[]) => {
	return decimalPercents.map((p, i) => {
		const v = p + decimalPercents.slice(0, i).reduce((v, c) => v + c, 0);
		const b = v < 0 ? 1 + v : v;
		return b;
	});
};

export const getCoordsForCircularCharts = (
	asDists: number[],
	asDecimalPercentages: number[],
	radius: number,
	quarterTurnAngle: number,
	center: [number, number],
) => {
	return asDists.map((d, i) => {
		const angle = d / radius - quarterTurnAngle;
		return [
			center[0] + radius * Math.cos(angle),
			center[1] + radius * Math.sin(angle),
			asDecimalPercentages[(i + 1) % asDecimalPercentages.length] *
				asDists[asDists.length - 1],
		] as [number, number, number];
	});
};
