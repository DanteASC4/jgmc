<script lang="ts">
	import { classNames, type ImageLabel } from "@jgmc/core";

	type ImageLabelProps = {
		imgLabel: ImageLabel;
		x: number;
		y: number;
		labelColor: string;
		subgrouping: boolean;
	};

	let {
		imgLabel,
		x,
		y,
		labelColor,
		subgrouping = false,
	}: ImageLabelProps = $props();

	let width = $derived(imgLabel.width ?? 50);
	let height = $derived(imgLabel.height ?? 50);
</script>

{#if subgrouping}
	<g class={classNames.imageLabelGroupEle} transform={`translate(${x},${y})`}>
		{#if imgLabel.topText}
			<text
				class={classNames.labelTextEle}
				x={0}
				y={-20}
				fill={labelColor}
				text-anchor="middle"
				alignment-baseline="middle"
			>
				{imgLabel.topText}
			</text>
		{/if}
		<image
			class={classNames.imageLabelEle}
			href={imgLabel.href}
			{width}
			{height}
			x={-width / 2}
			y={-height / 2}
		/>
		{#if imgLabel.bottomText}
			<text
				class={classNames.labelTextEle}
				x={0}
				y={20}
				fill={labelColor}
				text-anchor="middle"
				alignment-baseline="middle"
			>
				{imgLabel.bottomText}
			</text>
		{/if}
	</g>
{:else}
	<image
		class={classNames.imageLabelEle}
		href={imgLabel.href}
		{width}
		{height}
		x={-width / 2}
		y={-height / 2}
	/>
{/if}
