<script lang="ts">
	import { classNames, type StringOrNumber } from "@jgmc/core";

	type TextLabelProps = {
		label: string;
		x: number;
		y: number;
		labelColor: string;
		fontSize?: number;
		fontFamily?: string;
		fontWeight?: StringOrNumber;
	};

	let {
		label,
		x,
		y,
		labelColor,
		fontSize,
		fontFamily,
		fontWeight,
	}: TextLabelProps = $props();
</script>

<text
	class={classNames.labelTextEle}
	{x}
	{y}
	fill={labelColor}
	text-anchor="middle"
	alignment-baseline="middle"
	font-size={fontSize}
	font-family={fontFamily}
	font-weight={fontWeight}
>
	{label}
</text>
