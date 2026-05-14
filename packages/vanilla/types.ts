export type AttributePairs<Known extends string> = [
	// deno-lint-ignore ban-types
	Known | (string & {}),
	string,
][];

type KnownOrAny<Known extends string> = Known | (string & {});

export type AttributeMap<Known extends string> = Map<KnownOrAny<Known>, string>;

export type TextAttrsU =
	| "x"
	| "y"
	| "fill"
	| "class"
	| "text-anchor"
	| "alignment-baseline";
export type TextAttrsArr = AttributePairs<TextAttrsU>;
export type TextAttrs = AttributeMap<TextAttrsU>;

export type ImageAttrsU =
	| "href"
	| "alt"
	| "width"
	| "height"
	| "x"
	| "y"
	| "class";
export type ImageAttrsArr = AttributePairs<ImageAttrsU>;
export type ImageAttrs = AttributeMap<ImageAttrsU>;

export type RectAttrsU =
	| "x"
	| "y"
	| "width"
	| "height"
	| "fill"
	| "stroke"
	| "stroke-width";
export type RectAttrsArr = AttributePairs<RectAttrsU>;
export type RectAttrs = AttributeMap<RectAttrsU>;

export type GroupAttrsU = "transform" | "class";
export type GroupAttrsArr = AttributePairs<GroupAttrsU>;
export type GroupAttrs = AttributeMap<GroupAttrsU>;

export type SvgAttrsU = "width" | "height" | "viewBox";
export type SvgAttrsArr = AttributePairs<SvgAttrsU>;
export type SvgAttrs = AttributeMap<SvgAttrsU>;

export type PathAttrsU =
	| "d"
	| "fill"
	| "stroke"
	| "stroke-width"
	| "stroke-linecap";
export type PathAttrsArr = AttributePairs<PathAttrsU>;
export type PathAttrs = AttributeMap<PathAttrsU>;
