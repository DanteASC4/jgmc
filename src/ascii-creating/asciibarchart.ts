import type { AsciiBarCharacter } from "../types.ts";

export const getChosenChar = (incoming: AsciiBarCharacter): string => {
	switch (incoming) {
		case "solid":
			return "█";
		case "light":
			return "░";
		case "medium":
			return "▒";
		case "dark":
			return "▓";
		default:
			return incoming;
	}
};

export const createVerticalBar = (
	height: number,
	width: number,
	char: string,
) => new Array(height).fill(char.repeat(width));

// export const createVerticalBar = (
//   height: number,
//   width: number,
//   char: string,
// ) => new Array(height).fill(char.repeat(width)).join("\n");
