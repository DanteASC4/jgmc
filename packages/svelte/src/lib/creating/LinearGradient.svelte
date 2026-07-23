<script lang="ts">
	import {
		formatGradientDirection,
		type GradientColor,
		type LinearGradientDirection,
		type LinearGradientType,
	} from "@jgmc/core";
	import type { Snippet } from "svelte";

	type LinearGradientProps = {
		gradientColors: GradientColor[];
		direction?: LinearGradientDirection;
		mode: LinearGradientType;
		gradientId: string;
		gradientMaskId: string;
		children?: Snippet; // mask!!!!!!!!!!?
	};

	let {
		gradientColors,
		direction,
		mode,
		gradientId,
		gradientMaskId,
		children,
	}: LinearGradientProps = $props();

	const trueGradientDirection = $derived(formatGradientDirection(direction));
	// const trueGradientDirection = $derived.by(() => {
	// 	if (!direction) return "rotate(0,0.5,0.5)";

	// 	if (direction === "left-to-right") return "rotate(0,0.5,0.5)";
	// 	else if (direction === "right-to-left") return "rotate(180,0.5,0.5)";
	// 	else if (direction === "top-to-bottom") return "rotate(90,0.5,0.5)";
	// 	else if (direction === "bottom-to-top") return "rotate(270,0.5,0.5)";

	// 	return `rotate(${direction},0.5,0.5)`;
	// });

	const gradientStops = $derived.by(() => {
		if (!Array.isArray(gradientColors) || gradientColors.length === 0)
			return [];
		let dist = 1 / (gradientColors.length - 1);
		const stops: [string, number][] = [];
		for (let i = 0; i < gradientColors.length; i++) {
			const cdist = i * dist * 100;

			let gcolor: string;
			let stopOff: number = cdist;

			if (gradientColors[i].includes(":")) {
				const [c, o] = gradientColors[i].split(":");
				const [digits] = o.split("%");
				gcolor = c;
				stopOff = Number(digits);
				dist -= stopOff / 100;
			} else {
				gcolor = gradientColors[i];
			}
			stops.push([gcolor, stopOff]);
		}
		return stops;
	});
</script>

<defs>
	<linearGradient id={gradientId} gradientTransform={trueGradientDirection}>
		{#each gradientStops as stop}
			<stop stop-color={stop[0]} offset={`${stop[1]}%`} />
		{/each}
	</linearGradient>
	{#if mode === "continuous" && gradientMaskId}
		<mask id={gradientMaskId}>
			<rect x={0} y={0} width="100%" height="100%" fill="#000000" />
			{@render children?.()}
			<!-- {#each barRenderData as bar}
				{let { x, y, width, height } = bar}
				<rect
					class={classNames.rectEle}
					{x}
					{y}
					{width}
					{height}
					fill={"#ffffff"}
				/>
			{/each} -->
		</mask>
	{/if}
</defs>
{#if mode === "continuous" && gradientMaskId && gradientId}
	<rect
		mask={`url('#${gradientMaskId}')`}
		x={0}
		y={0}
		width="100%"
		height="100%"
		fill={`url('#${gradientId}')`}
	/>
{/if}
