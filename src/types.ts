//    ███    █▄      ███      ▄█   ▄█        ▄█      ███     ▄██   ▄
//    ███    ███ ▀█████████▄ ███  ███       ███  ▀█████████▄ ███   ██▄
//    ███    ███    ▀███▀▀██ ███▌ ███       ███▌    ▀███▀▀██ ███▄▄▄███
//    ███    ███     ███   ▀ ███▌ ███       ███▌     ███   ▀ ▀▀▀▀▀▀███
//    ███    ███     ███     ███▌ ███       ███▌     ███     ▄██   ███
//    ███    ███     ███     ███  ███       ███      ███     ███   ███
//    ███    ███     ███     ███  ███▌    ▄ ███      ███     ███   ███
//    ████████▀     ▄████▀   █▀   █████▄▄██ █▀      ▄████▀    ▀█████▀
//                                ▀

export type Optional<T> = {
	[K in keyof T]?: T[K];
};

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

type MakeRange<
	N extends number,
	Result extends Array<unknown> = [],
> = Result["length"] extends N
	? Result
	: MakeRange<N, [...Result, Result["length"]]>;

type MaxP = MakeRange<101>;

type Percentage = `${MaxP[number]}%`;

type StringOrNumber = string | number;

//       ▄▄▄▄███▄▄▄▄    ▄█     ▄████████  ▄████████
//     ▄██▀▀▀███▀▀▀██▄ ███    ███    ███ ███    ███
//     ███   ███   ███ ███▌   ███    █▀  ███    █▀
//     ███   ███   ███ ███▌   ███        ███
//     ███   ███   ███ ███▌ ▀███████████ ███
//     ███   ███   ███ ███           ███ ███    █▄
//     ███   ███   ███ ███     ▄█    ███ ███    ███
//      ▀█   ███   █▀  █▀    ▄████████▀  ████████▀

/**
 * Used for resulting path's [`stroke-linecap`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke-linecap) attribute
 */
type LineCaps = "round" | "butt" | "square";
/**
 * Controls whether resulting lines are drawn straight or smooth
 */
type LineTypes = "straight" | "smooth";

export type AsciiBarCharacter =
	| "solid"
	| "light"
	| "medium"
	| "dark"
	| (string & {});

type AsciiBasicColors =
	| "black"
	| "red"
	| "green"
	| "yellow"
	| "blue"
	| "magenta"
	| "cyan"
	| "white"
	| "gray";

type HexString = `#${string}`;
type RGBObj = { r: number; g: number; b: number };

export type AsciiColors = (AsciiBasicColors | HexString | RGBObj)[];

//     ▄████████  ▄█          ▄████████    ▄████████    ▄████████    ▄████████    ▄████████
//    ███    ███ ███         ███    ███   ███    ███   ███    ███   ███    ███   ███    ███
//    ███    █▀  ███         ███    ███   ███    █▀    ███    █▀    ███    █▀    ███    █▀
//    ███        ███         ███    ███   ███          ███         ▄███▄▄▄       ███
//    ███        ███       ▀███████████ ▀███████████ ▀███████████ ▀▀███▀▀▀     ▀███████████
//    ███    █▄  ███         ███    ███          ███          ███   ███    █▄           ███
//    ███    ███ ███▌    ▄   ███    ███    ▄█    ███    ▄█    ███   ███    ███    ▄█    ███
//    ████████▀  █████▄▄██   ███    █▀   ▄████████▀   ▄████████▀    ██████████  ▄████████▀
//               ▀
export type BarChartClasses = {
	/**
	 * Name is ambiguous, but attached to parent group of both label & bar groups
	 */
	groupClass: string;
	/**
	 * Attached to the parent `SVG` element
	 */
	parentClass: string;
	/**
	 * Attached to each individual bar `<rect ... />` element
	 */
	barClass: string;
	/**
	 * Attached to the parent `<g>` element which contains the bar elements
	 */
	barGroupClass: string;
};

export type PieChartClasses = {
	/**
	 * Attached to the parent `SVG` element
	 */
	parentClass: string;
	/**
	 * Attached to each individual slice `<path ... />` element
	 */
	sliceClass: string;
	// TODO: Determine if `sliceGroupClass` needed
	/**
	 * Attached to the parent `<g>` element which contains the bar elements
	 */
	sliceGroupClass: string;
	/**
	 * Attached to the centered `<text>` element (if `centerLabel` option supplied)
	 */
	centerLabelClass: string;
};

export type DonutChartClasses = {
	/**
	 * Attached to the parent `SVG` element
	 */
	parentClass: string;
	/**
	 * Attached to each individual slice `<path ... />` element
	 */
	sliceClass: string;
	// TODO: Determine if `sliceGroupClass` needed
	/**
	 * Attached to the parent `<g>` element which contains the bar elements
	 */
	sliceGroupClass: string;
	/**
	 * Attached to the centered `<text>` element (if `centerLabel` option supplied)
	 */
	centerLabelClass: string;
};

export type LineChartClasses = {
	/**
	 * Added to resulting `<path>` elements
	 */
	lineClass: string;
	/**
	 * Added to resulting `<g>` tag containing line `<path>` elements
	 */
	lineGroupClass: string;
	/**
	 * Added to resulting parent `<svg>` element
	 */
	parentClass: string;
	/**
	 * Added to resulting `<text>` elements
	 */
	labelClass: string;
	/**
	 * Added to resulting `<g>` tag containing line `<text>` elements
	 */
	labelGroupClass: string;
};

export type LabelClasses = {
	/**
	 * Attached to each individual label `<text>` element
	 */
	labelClass: string;
	/**
	 * Attached to each individual data label `<text>` element
	 */
	dataLabelClass: string;
	/**
	 * Attached to each individual `<img>` element
	 */
	imageLabelClass: string;
	/**
	 * Attached to each individual top & bottom `<text>` element (if topText or bottomText supplied)
	 */
	imageLabelTextClass: string;

	/**
	 * Attached to the `<g>` element which contains the label `<text>` elements
	 */
	labelGroupClass: string;
	/**
	 * Attached to the `<g>` element which contains the created data label `<text>` elements
	 */
	dataLabelGroupClass: string;
	/**
	 * Attached to the `<g>` element which contains the created image label `<g>` elements. While other label types are just `<text>` elements and don't need sub-grouping, image labels can consist of additional elements if `topText` or `bottomText` was supplied.
	 *
	 * If there is top/bottom text:
	 *
	 * ```html
	 * <g class="imageLabelContainerClass">
	 *  <g class="imageLabelSubGroupClass">
	 *    <text>top</text>
	 *    <img src alt />
	 *    <text>bottom</bottom>
	 *  </g>
	 *  ...
	 * <g>
	 * ```
	 *
	 * If there's no bottom or top text, there will be no sub-grouping:
	 *
	 * ```html
	 * <g class="imageLabelContainerClass">
	 *    <img src alt />
	 *  ...
	 * <g>
	 * ```
	 */
	imageLabelContainerClass: string;
	/**
	 * Attached to the `<g>` element which contains the created image label elements `<img>`. If top/bottom text was supplied, this is attached to the sub-groups if sub-grouping is performed.
	 *
	 * @see {@link imageLabelContainerClass} for a more detailed breakdown
	 */
	imageLabelSubGroupClass: string;
};

//     ▄██████▄     ▄███████▄     ███      ▄█   ▄██████▄  ███▄▄▄▄      ▄████████
//    ███    ███   ███    ███ ▀█████████▄ ███  ███    ███ ███▀▀▀██▄   ███    ███
//    ███    ███   ███    ███    ▀███▀▀██ ███▌ ███    ███ ███   ███   ███    █▀
//    ███    ███   ███    ███     ███   ▀ ███▌ ███    ███ ███   ███   ███
//    ███    ███ ▀█████████▀      ███     ███▌ ███    ███ ███   ███ ▀███████████
//    ███    ███   ███            ███     ███  ███    ███ ███   ███          ███
//    ███    ███   ███            ███     ███  ███    ███ ███   ███    ▄█    ███
//     ▀██████▀   ▄████▀         ▄████▀   █▀    ▀██████▀   ▀█   █▀   ▄████████▀
//

export type ChartOptions = {
	/**
	 * Controls the resulting SVG `width` attribute.
	 *
	 * Used in some calculations. Leave blank if you get unexpected results.
	 *
	 * Instead use CSS to change the SVG width to any value with no issues!
	 */
	width: number;
	/**
	 * Controls the resulting SVG `height` attribute.
	 *
	 * Used in some calculations. Leave blank if you get unexpected results.
	 *
	 * Instead use CSS to change the SVG height to any value with no issues!
	 */
	height: number;
	/**
	 * Controls the "viewBox" width of resulting SVG
	 *
	 * Defaults to width if unset.
	 *
	 * **WARN** This is an advanced option & can lead to unexpected results, docs demo usage page is TODO!
	 */
	vWidth: number;
	/**
	 * Controls the "viewBox" height of resulting SVG
	 *
	 * Defaults to height if unset.
	 *
	 * **WARN** This is an advanced option & can lead to unexpected results, docs demo usage page is TODO!
	 */
	vHeight: number;
};

export type ImageLabel = {
	/**
	 * image source, absolute or relative
	 */
	href: string;
	/**
	 * image alt text
	 */
	alt: string;
	/**
	 * text placed above the image
	 */
	topText?: string;
	/**
	 * text placed below the image
	 */
	bottomText?: string;
	/**
	 * If set used for the image element's height
	 */
	height?: number;
	/**
	 * If set used for the image element's width
	 */
	width?: number;
};

// TODO rename "Labels" -> "LabelOptions"
export type Labels = {
	/**
	 * Defaults to `#ffffff`
	 * Will alternate between colors if there are less colors than the number of drawn labels.
	 */
	labelColors: string | string[];
	/**
	 * An array of strings attached to various datasets of charts. See chart's themselves for specifics.
	 */
	labels: string[];
	/**
	 * "literal" makes data labels display the given number in-place
	 * "percentage" makes data labels display their value as a percentage of the sum of all values in the `data` array
	 */
	dataLabels: "literal" | "percentage";
	/**
	 * An alternative label format, allowing images, alt text, top text, and bottom text.
	 *
	 * Takes precedence over `labels` if supplied.
	 *
	 * @see {@link ImageLabel}
	 */
	imageLabels: ImageLabel[];
};

export type GradientColor = string | `${string}:${Percentage}`;

export type LinearGradientDirection =
	| "left-to-right"
	| "right-to-left"
	| "top-to-bottom"
	| "bottom-to-top"
	| `${number}`;

export type LinearGradientType = "individual" | "continuous";

export type LinearGradientOptions = {
	/**
	 * Array of CSS color values, optionally with a percentage to control the stop position for said color.
	 * If percentage is not supplied, colors will be spaced evenly across the gradient.
	 *
	 * Examples of valid color strings:
	 * - `"red"`
	 * - `"#ff0000"`
	 * - `"rgb(255, 0, 0)"`
	 * - `"red:0%"` (if percentage is supplied, it must be in the form of a string with a colon separating the color and percentage)
	 * - `"rgb(255, 0, 0):50%"`
	 */
	gradientColors: GradientColor[];
	/**
	 * Defaults to `"individual"` when `gradientColors` is supplied.
	 *
	 * Accepted values:
	 * - "individual"
	 *   - each color in `gradientColors` is applied to a separate segment of the chart (e.g. each bar gets its own gradient, or each line gets its own gradient).
	 * - "continuous"
	 *   - the gradient is applied across the entire chart, with colors transitioning smoothly from one to the next based on their specified percentages or their position in the array.
	 *
	 */
	gradientMode: LinearGradientType;
	/**
	 * Defaults to `"left-to-right"` when `gradientColors` is supplied but no `gradientDirection` is given.
	 *
	 * Accepted values:
	 * - "left-to-right"
	 * - "right-to-left"
	 * - "top-to-bottom"
	 * - "bottom-to-top"
	 * - any valid CSS angle value (e.g. "45deg", "90deg", etc.)
	 */
	gradientDirection: LinearGradientDirection;
};

// TODO use this to allow multiple gradients
export type ManyLinearGradientOptions = {
	gradientColors: GradientColor[][];
	gradientMode: Extract<LinearGradientType, "individual">;
	gradientDirection: LinearGradientDirection;
};

export type GeneralChartStyleOptions = {
	/**
	 * A single or array of [CSS color values](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Colors/Color_values)
	 * Used as the "fill" on resulting chart elements.
	 * Colors are applied in provided order, if there are fewer colors than chart elements, colors will alternate by wrapping around.
	 *
	 * Defaults to `"#ffffff"` if not supplied.
	 */
	fillColors: string | string[];
	/**
	 * A single or array of [CSS color values](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Colors/Color_values)
	 * Used as the stroke on resulting bars.
	 * Colors are applied in provided order, if there are fewer colors than chart elements, colors will alternate by wrapping around.
	 *
	 * No default value if not supplied.
	 */
	strokeColors: string | string[];
	/**
	 * A single or array of [CSS length units](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length)
	 * Used as the "stroke-width" on resulting bars.
	 * Lengths are applied in provided order, if there are fewer lengths than chart elements, lengths will alternate by wrapping around.
	 *
	 * No default value if not supplied.
	 */
	strokeWidths: StringOrNumber | StringOrNumber[];
};

//  ▄████████    ▄█    █▄       ▄████████    ▄████████     ███        ▄████████
// ███    ███   ███    ███     ███    ███   ███    ███ ▀█████████▄   ███    ███
// ███    █▀    ███    ███     ███    ███   ███    ███    ▀███▀▀██   ███    █▀
// ███         ▄███▄▄▄▄███▄▄   ███    ███  ▄███▄▄▄▄██▀     ███   ▀   ███
// ███        ▀▀███▀▀▀▀███▀  ▀███████████ ▀▀███▀▀▀▀▀       ███     ▀███████████
// ███    █▄    ███    ███     ███    ███ ▀███████████     ███              ███
// ███    ███   ███    ███     ███    ███   ███    ███     ███        ▄█    ███
// ████████▀    ███    █▀      ███    █▀    ███    ███    ▄████▀    ▄████████▀
//                                          ███    ███

export type BarChartOptionsBase = {
	/**
	 * Defaults to `"bottom"` if not supplied
	 */
	placement: "top" | "right" | "bottom" | "left";
	/**
	 * When not supplied this is calculated automatically using the following formula:
	 * ```
	 * barWidth = surfaceLength / numBars / 2
	 * ```
	 * Which results in an even width for each bar, based on the available space for the surface the bars are being attached to.
	 */
	barWidth: number;
	/**
	 * When not supplied, defaults to largest datapoint in the supplied `data` array.
	 *
	 * Will override the SVG `viewBox` height if supplied.
	 *
	 * **WARN** This is an advanced option & can lead to unexpected results, docs demo usage page is TODO!
	 */
	max: number;
	/**
	 * When not supplied this is calculated automatically using the following formula:
	 * ```
	 * gap = surfaceLength / numBars / 4
	 * ```
	 * Which results in even spacing between all bars based on the available space for the surface the bars are being attached to.
	 */
	gap: number;
	// classes: BarChartClasses & LabelClasses;
} & LinearGradientOptions & // & BarChartClasses
	Labels &
	GeneralChartStyleOptions &
	ChartOptions;

type CircleChartCenterLabelOptions = {
	centerLabel: "sum" | string;
	centerLabelColor: string;
	centerLabelFontSize: number | number;
	centerLabelFontWeight: string | number;
	centerLabelFontFamily: string;
};

export type PieChartOptionsBase = {
	/**
	 * Defaults to `300`
	 */
	size: number;
	/**
	 * Defaults to `15`
	 */
	padding: number;
} & LinearGradientOptions &
	Labels &
	CircleChartCenterLabelOptions &
	GeneralChartStyleOptions &
	Omit<ChartOptions, "width" | "height">;

export type DonutChartOptionsBase = {
	/**
	 * Defaults to `300`
	 */
	size: number;
	/**
	 * Defaults to `15`
	 */
	padding: number;
} & LinearGradientOptions &
	Labels &
	CircleChartCenterLabelOptions &
	GeneralChartStyleOptions &
	Omit<ChartOptions, "width" | "height">;

export type LineChartOptionsBase = {
	/**
	 * When not supplied defaults to `0` or a negative value if present in given data.
	 *
	 * **WARN** This is an advanced option & can lead to unexpected results, leave unset if results are undesirable!
	 */
	min: number;
	/**
	 * When not supplied, defaults to largest datapoint in the supplied `data` array.
	 *
	 * Will override the SVG `viewBox` height if supplied.
	 *
	 * **WARN** This is an advanced option & can lead to unexpected results, leave unset if results are undesirable!
	 */
	max: number;
	/**
	 * Used for resulting path's `stroke-width`
	 */
	thickness: number | number[];
	/**
	 * Used for resulting path's [`stroke-linecap`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke-linecap) attribute
	 */
	cap: LineCaps | LineCaps[];
	/**
	 * Controls whether resulting lines are drawn straight or smooth
	 * Defaults to `"straight"`
	 */
	lineType: LineTypes | LineTypes[];
	/**
	 * Decides whether the drawn line reaches the end of it's containing SVG box,
	 * Defaults to false
	 */
	fullWidthLine: boolean;
	/**
	 * Used for the resulting path's `stroke` attribute, effectively coloring the line
	 * Defaults to `#ffffff`
	 * Will alternate between colors if there are less colors than the number of drawn lines.
	 */
	colors: string | string[];
} & ChartOptions &
	LinearGradientOptions &
	GeneralChartStyleOptions &
	Labels;

// This will get cleaned up later
export type AsciiBarChartOptionsBase = {
	/**
	 * Defaults to `"bottom"` if not supplied
	 */
	placement: "top" | "right" | "bottom" | "left";
	/**
	 * The character used to represent bars in the resulting ASCII chart. Can be any string or one of the built-in options:
	 *
	 * - "solid": "█"
	 * - "light": "░"
	 * - "medium": "▒"
	 * - "dark": "▓"
	 *
	 * Defaults to "solid" if not supplied.
	 */
	barCharacter: AsciiBarCharacter;
	/**
	 * The width of each bar in characters.
	 *
	 * Defaults to `3` if not supplied.
	 */
	barWidth: number;
	/**
	 * The number of spaces between each bar.
	 *
	 * Defaults to `3` if not supplied.
	 */
	gap: number;
	/**
	 * Controls the height of the resulting ASCII chart in characters.
	 *
	 * Defaults to `24` if not supplied.
	 */
	height: number;
	/**
	 * Controls the width of the resulting ASCII chart in characters.
	 *
	 * Defaults to `80` if not supplied.
	 */
	width: number;
	/**
	 * Used as the color for the bars in the resulting ASCII chart. Can be an array to allow for alternating colors.
	 *
	 * Defaults to `["white"]` if not supplied.
	 *
	 * Accepted color values are:
	 * - Any basic ANSI color
	 * 	- "black"
	 * 	- "red"
	 * 	- "green"
	 * 	- "yellow"
	 * 	- "blue"
	 * 	- "magenta"
	 * 	- "cyan"
	 * 	- "white"
	 * 	- "gray"
	 * - Any valid hex color string (e.g. "#ff0000")
	 * - An object with r,g,b for each color value
	 * 	- `{ r: 255, g: 0, b: 0 }`
	 */
	colors: AsciiColors;
	title: string;
	/**
	 * Used to determine the format of data labels in the resulting ASCII chart. Can be a custom formatting function, or one of the following presets:
	 * - "literal": displays the given number in-place
	 * - "percentage": displays the value as a percentage of the sum of all values in the `data` array
	 * - A custom function which takes the value and index of each data point, and returns a string to be displayed as the data label for that point. The function can optionally take additional arguments for more advanced use cases.
	 */
	dataLabels:
		| "literal"
		| "percentage"
		| ((v: number, i: number, ...args: unknown[]) => string);
	/**
	 * Used as the color for the data labels in the resulting ASCII chart. Can be an array to allow for alternating colors.
	 *
	 * Defaults to `["white"]` if not supplied.
	 *
	 * Accepted color values are:
	 * - Any basic ANSI color
	 * 	- "black"
	 * 	- "red"
	 * 	- "green"
	 * 	- "yellow"
	 * 	- "blue"
	 * 	- "magenta"
	 * 	- "cyan"
	 * 	- "white"
	 * 	- "gray"
	 * - Any valid hex color string (e.g. "#ff0000")
	 * - An object with r,g,b for each color value
	 * 	- `{ r: 255, g: 0, b: 0 }`
	 */
	dataLabelColors: AsciiColors;
};

// TODO rename `Opts` -> `Options`
export type BarChartNumericalOptions = Prettify<
	Optional<BarChartOptionsBase> & {
		/**
		 * A single array of numbers, each number representing a bar.
		 */
		readonly data: number[];
	}
>;

// TODO rename `Opts` -> `Options`
export type BarChartStackedOptions = Prettify<
	Optional<BarChartOptionsBase> & {
		/**
		 * A 2D array of numbers, each sub-array representing a stack of bars.
		 */
		readonly data: number[][];
	}
>;

export type PieChartOptions = Prettify<
	Optional<PieChartOptionsBase> & {
		/**
		 * A single array of numbers, each number representing a slice of the pie.
		 */
		readonly data: number[];
	}
>;

export type DonutChartOptions = Prettify<
	Optional<DonutChartOptionsBase> & {
		/**
		 * A single array of numbers, each number representing a slice of the pie.
		 */
		readonly data: number[];
	}
>;

// STUB - is this even used anywhere?
export type BarChartOptions = BarChartNumericalOptions | BarChartStackedOptions;

export type LineChartOptions = Prettify<
	Optional<LineChartOptionsBase> & {
		/**
		 * Array of numbers representing the data points for each line.
		 * If multiple arrays are provided, each array will be used for a separate line.
		 * If a single array is provided, it will be used for one lines.
		 */
		readonly data: number[][] | number[];
		// readonly labels?: string[][] | string[]; // Pretty sure this is a mistake since now have the `Labels` type (inb4 errors)
	}
>;

export type AsciiBarChartOptions = Prettify<
	Optional<AsciiBarChartOptionsBase> & {
		/**
		 * A single array of numbers, each number representing a bar.
		 */
		readonly data: number[];
	}
>;
