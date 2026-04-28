import { createSVGElement } from "./common.ts";

export const drawLineStraight = (
	coords: [number, number][],
	color: string,
	thickness: number,
	linecap: string,
) => {
	const path = createSVGElement("path");

	let drawString = `M 0,${coords[0][1]}`;
	// let drawString = "M 0,0";
	// let drawString = `M 0, ${fullWidth ? coords[0][1] : 0}`;
	drawString += "\n  L";

	for (let i = 0; i < coords.length; i++) {
		const coord = coords[i];
		drawString += ` ${coord[0]},${coord[1]}`;
		if (i !== coords.length - 1) drawString += "\n";
	}

	path.setAttribute("d", drawString);
	path.setAttribute("fill", "none");
	path.setAttribute("stroke", color);
	// NOTE React doesn't like two-word attributes
	path.setAttribute("stroke-width", `${thickness}`);
	path.setAttribute("stroke-linecap", linecap);
	return path as SVGPathElement;
};

export const drawLineSmooth = (
	coords: [number, number][],
	color: string,
	thickness: number,
	linecap: string,
) => {
	const path = createSVGElement("path");

	let drawString = ``;

	// const pairs = chunk(coords, 2);
	drawString += `M ${coords[0][0]},${coords[0][1]}\n`;

	// console.log("---s---");
	// console.log(coords);
	for (let i = 0; i < coords.length - 1; i++) {
		const [fx, fy] = coords[i];
		const [tx, ty] = coords[i + 1];
		// console.log("i", i);
		// console.log("fx", fx, "fy", fy);
		// console.log("tx", tx, "ty", ty);

		const mx = (tx + fx) / 2;
		const c1x = mx;
		const c1y = fy;
		const c2x = mx;
		const c2y = ty;

		if (i === 0) drawString += `C ${c1x},${c1y} ${c2x},${c2y} ${tx},${ty}\n`;
		else drawString += ` ${c1x},${c1y} ${c2x},${c2y} ${tx},${ty}\n`;
	}

	// for (let i = 0; i < coords.length - 1; i++) {
	// 	const p0 = i - 1 >= 0 ? coords[i - 1] : coords[i];
	// 	const p1 = coords[i];
	// 	const p2 = coords[i + 1];
	// 	const p3 = i + 2 < coords.length ? coords[i + 2] : coords[i + 1];
	//
	// 	const [ctrl1, ctrl2] = calcControlPoint(p0, p1, p2, p3);
	//
	// 	drawString += `C ${ctrl1[0]},${ctrl1[1]} ${ctrl2[0]},${ctrl2[1]} ${p2[0]},${p2[1]}\n`;
	//
	// 	// drawString += `Q ${catRomCtrl[0]},${catRomCtrl[1]} ${pNext[0]},${pNext[1]}\n`;
	// }

	// Quadratic version, not c1
	//  for (let i = 1; i < coords.length; i++) {
	// 	const pPrev = i - 2 >= 0 ? coords[i - 2] : coords[i - 1];
	// 	const c = coords[i - 1];
	// 	const pNext = coords[i];
	//
	// 	const catRomCtrl = calcCatmullRomPoint(pPrev, c, pNext);
	//
	// 	drawString += `Q ${catRomCtrl[0]},${catRomCtrl[1]} ${pNext[0]},${pNext[1]}\n`;
	// }

	// for (let i = 0; i < coords.length; i++) {
	// 	const [x, y] = coords[i];
	// 	if (!hasQ) {
	// 		drawString += `Q ${x},${y} ${control[0]},${control[1]} \nt `;
	// 		hasQ = true;
	// 	} else {
	// 		drawString += `${x},${y} `;
	// 	}
	// }

	path.setAttribute("d", drawString);
	path.setAttribute("fill", "none");
	path.setAttribute("stroke", color);
	// NOTE React doesn't like two-word attributes
	path.setAttribute("stroke-width", `${thickness}`);
	path.setAttribute("stroke-linecap", linecap);
	path.setAttribute("stroke-linejoin", "round");
	return path as SVGPathElement;
};

export const createLineDataLabels = (
	coords: [number, number][],
	labels: string[],
	labelColor: string,
	height: number,
	labelClass?: string,
) => {
	const lg = createSVGElement("g");

	// console.log(labels);

	for (let i = 0; i < labels.length; i++) {
		const coord = coords[i];
		const label = labels[i];
		const text = createSVGElement("text");
		const [x, y] = coord;

		text.setAttribute("fill", labelColor);
		text.setAttribute("dominant-baseline", "hanging");
		text.setAttribute("dy", "0.5em");
		text.setAttribute("alignment-baseline", "middle");
		text.setAttribute("text-anchor", "middle");
		if (i === 0) {
			text.setAttribute("x", `${x + 25}`);
		} else if (i === labels.length - 1) {
			text.setAttribute("x", `${x - 10}`);
		} else {
			text.setAttribute("x", `${x}`);
		}
		if (y <= 20) {
			text.setAttribute("y", `${y + 20}`);
		} else if (y >= height - 20) {
			text.setAttribute("y", `${y - 15}`);
		} else {
			text.setAttribute("y", `${y - 20}`);
		}
		// text.setAttribute("title", `Bar label ${label}`);
		text.textContent = label;
		if (labelClass) text.classList.add(labelClass);
		lg.appendChild(text);
	}

	return lg;
};
