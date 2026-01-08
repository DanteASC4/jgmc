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

/*
Creating a vertical bar:

<- width ->
███ ^
███ |
███ height
███ |
███ v

Creating a horizontal bar:


< -   height  - >
█████████████████ ^
█████████████████  width
█████████████████ v



*/

/**
 * Creates a vertical bar with the specified height, width, and character.
 * @param height The height of the bar.
 * @param width The width of the bar.
 * @param char The character to use for the bar.
 * @returns An array of strings representing the vertical bar.
 *
 * ```ts
 * const vbar = createVerticalBar(10, 2, "#");
 * console.log(vbar);
 * console.log(vbar.join('\n'))
 *
 * ###
 * ###
 * ###
 * ###
 * ###
 * ###
 * ###
 * ###
 * ###
 * ###
 * ```
 */
export const createVerticalBar = (
	height: number,
	width: number,
	char: string,
): string[] => new Array(height).fill(char.repeat(width));

/**
 * Creates a horizontal bar with the specified height, width, and character.
 * @param height The height of the bar.
 * @param width The width of the bar.
 * @param char The character to use for the bar.
 * @returns An array of strings representing the horizontal bar.
 *
 * Example:
 * ```ts
 * const hbar = createHorizontalBar(10, 2, "#");
 * console.log(hbar);
 * console.log(hbar.join('\n'))
 *
 * ##########
 * ##########
 * ```
 *
 */
export const createHorizontalBar = (
	height: number,
	width: number,
	char: string,
): string[] => new Array(width).fill(char.repeat(height));

// export const createVerticalBar = (
//   height: number,
//   width: number,
//   char: string,
// ) => new Array(height).fill(char.repeat(width)).join("\n");
