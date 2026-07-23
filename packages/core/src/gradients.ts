import type { LinearGradientDirection } from "$types";

/**
 * Helper function for building linear gradients by ensuring the given direction is in the proper format
 * @param dir - Either one of the four preset gradient directions or a number as a string
 * @returns a properly formatted transform for the desired rotation
 */
export const formatGradientDirection = (
	dir?: LinearGradientDirection,
): string => {
	if (!dir) return "rotate(0,0.5,0.5)";

	let rot: string;

	switch (dir) {
		case "left-to-right":
			rot = "0";
			break;
		case "right-to-left":
			rot = "180";
			break;
		case "top-to-bottom":
			rot = "90";
			break;
		case "bottom-to-top":
			rot = "270";
			break;
		default:
			rot = dir;
			break;
	}

	return `rotate(${rot}deg,0.5,0.5)`;
};
