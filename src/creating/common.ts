import { parseHTML } from "linkedom";

const fallbackDoc = parseHTML(
	`<!doctype html><html><head></head><body></body></html>`,
).document;

// Allows for seamless client or ssr usage. Might split or just default to linkedom later though.
export const createSVGElement = (ele: string) => {
	// deno-coverage-ignore-start
	if (typeof document !== "undefined" && document instanceof Document) {
		return document.createElementNS("http://www.w3.org/2000/svg", ele);
	}
	return fallbackDoc.createElementNS("http://www.w3.org/2000/svg", ele);
	// else {
	// 	const { document } = parseHTML(
	// 		`<!doctype html><html><head></head><body></body></html>`,
	// 	);
	// 	return document.createElementNS("http://www.w3.org/2000/svg", ele);
	// }
	// deno-coverage-ignore-stop
};

export const createElement = (tag: string) => {
	// deno-coverage-ignore-start
	if (typeof document !== "undefined" && document instanceof Document) {
		return document.createElement(tag);
	}
	return fallbackDoc.createElement(tag);
	/* 	else {
		const { document } = parseHTML(
			`<!doctype html><html><head></head><body></body></html>`,
		);
		return document.createElement(tag);
	} */
	// deno-coverage-ignore-stop
};

// const { document } = parseHTML(
// 	`<!doctype html><html><head></head><body></body></html>`,
// );
//
// export const createSVGElement = (ele: string) => {
// 	return document.createElementNS("http://www.w3.org/2000/svg", ele);
// };

// const doc = new DOMParser().parseFromString("", "text/html");
//
// export const createSVGElement = (ele: string) => {
// 	return doc.createElement(ele) as unknown as SVGElement;
// };

// export const createSVGElement = (ele: string) => {
// 	const cenv = Deno.env.get("MODE");
// 	if (cenv === "DEV") {
// 		return doc.createElement(ele) as unknown as SVGElement;
// 	}
//
// 	return document.createElementNS("http://www.w3.org/2000/svg", ele);
// };

// export const createSVGElement = (ele: string) =>
// 	document.createElementNS("http://www.w3.org/2000/svg", ele);

export const makeSVGParent = (
	vWidth: number,
	vHeight: number,
	width: number,
	height: number,
	minX = 0,
	minY = 0,
) => {
	const svg = createSVGElement("svg");
	svg.classList.add("tmc-chart");
	svg.setAttribute("width", `${width}`);
	svg.setAttribute("height", `${height}`);
	svg.setAttribute("viewBox", `${minX} ${minY} ${vWidth} ${vHeight}`);
	svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
	return svg;
};
