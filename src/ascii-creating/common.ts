import {
	black,
	blue,
	cyan,
	gray,
	green,
	magenta,
	red,
	rgb24,
	white,
	yellow,
} from "@std/fmt/colors";
import type { AsciiColors } from "../types.ts";

export const colorString = (str: string, color: AsciiColors[number]) => {
	if (
		typeof color === "object" &&
		"r" in color &&
		"g" in color &&
		"b" in color
	) {
		return rgb24(str, color);
	}

	if (typeof color === "string" && color.startsWith("#")) {
		return rgb24(str, Number.parseInt(`0x${color.slice(1)}`, 16));
	}

	if (typeof color === "string") {
		switch (color) {
			case "red":
				return red(str);
			case "green":
				return green(str);
			case "blue":
				return blue(str);
			case "yellow":
				return yellow(str);
			case "magenta":
				return magenta(str);
			case "cyan":
				return cyan(str);
			case "white":
				return white(str);
			case "black":
				return black(str);
			case "gray":
				return gray(str);
			default:
				return white(str);
		}
	}

	return white(str);
};
