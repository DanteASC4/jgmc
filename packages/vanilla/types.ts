// deno-lint-ignore ban-types
export type AttributePairs<Known extends string> = [
	Known | (string & {}),
	string,
][];

export type TextAttrs = AttributePairs<
	"x" | "y" | "fill" | "class" | "text-anchor" | "alignment-baseline"
>;
export type ImageAttrs = AttributePairs<
	"href" | "alt" | "width" | "height" | "x" | "y" | "class"
>;
export type RectAttrs = AttributePairs<
	"x" | "y" | "width" | "height" | "fill" | "stroke" | "stroke-width"
>;
export type GroupAttrs = AttributePairs<"transform" | "class">;
export type SvgAttrs = AttributePairs<"width" | "height" | "viewBox">;
export type PathAttrs = AttributePairs<
	"d" | "fill" | "stroke" | "stroke-width" | "stroke-linecap"
>;
