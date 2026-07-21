<script lang="ts">
	import {
		autoBarWidth,
		autoGap,
		autoMaxNumerical,
		BarChartDefaults,
		type BarChartNumericalOptions,
		calcBarCoords,
		calcBarDims,
		calcBarLabelCoords,
		calcDataLabelCoords,
		calcImageLabelOffset,
		classNames,
		getDataLabelText,
		getOnlyItemOrWrap,
		type LinearGradientDirection,
		randId,
		type StringOrNumber,
		sumArray,
	} from "@jgmc/core";
	import ImageLabel from "./creating/ImageLabel.svelte";
	import TextLabel from "./creating/TextLabel.svelte";
	import LinearGradient from "./creating/LinearGradient.svelte";

	let {
		data,
		labels,
		labelColors = BarChartDefaults.labelColors,
		dataLabels,
		imageLabels,
		height = BarChartDefaults.height,
		width = BarChartDefaults.width,
		vWidth,
		vHeight,
		gap,
		max,
		placement = BarChartDefaults.placement,
		barWidth,
		fillColors = BarChartDefaults.fillColors,
		strokeColors,
		strokeWidths,
		gradientColors,
		gradientMode,
		gradientDirection,
	}: BarChartNumericalOptions = $props();

	const largest = $derived(autoMaxNumerical(data));

	const viewWidth = $derived(vWidth ?? width);
	const viewHeight = $derived(vHeight ?? height);

	const hasNormalLabels = $derived(Array.isArray(labels) && labels.length > 0);
	const hasImageLabels = $derived(imageLabels && imageLabels.length > 0);
	const hasLabels = $derived(hasNormalLabels || dataLabels || hasImageLabels);

	const dataPointsAmt = $derived(
		hasLabels
			? Math.max(
					data.length,
					labels ? labels.length : imageLabels ? imageLabels.length : 0,
				)
			: data.length,
	);

	const evenWidth = $derived(
		placement === "top" || placement === "bottom"
			? autoBarWidth(width, dataPointsAmt)
			: autoBarWidth(height, dataPointsAmt),
	);

	const trueGap = $derived(
		gap
			? gap
			: placement === "top" || placement === "bottom"
				? autoGap(width, dataPointsAmt)
				: autoGap(height, dataPointsAmt),
	);

	const topOrBot = $derived(placement === "top" || placement === "bottom");
	const exceedsWidth = $derived(data.some((v) => v > viewWidth));
	const exceedsHeight = $derived(data.some((v) => v > viewHeight));

	const trueVWidth: StringOrNumber = $derived.by(() => {
		if (!topOrBot && exceedsWidth) {
			return max ? max : largest;
		}
		return viewWidth;
	});
	const trueVHeight = $derived.by(() => {
		if (topOrBot && exceedsHeight) {
			return max ? max : largest;
		}
		return viewHeight;
	});

	const isGradient = $derived(
		Boolean(gradientColors) && gradientColors && gradientColors.length > 0,
	);
	const gradientInitId = $props.id();
	const gradientId = $derived(`${gradientInitId}-gradient`);
	const trueGradientMode: BarChartNumericalOptions["gradientMode"] = $derived(
		gradientMode ?? "individual",
	);
	const gradientMaskId = $derived(`${gradientInitId}-mask`);

	const subgrouping = $derived(
		imageLabels?.some((item) => item.topText || item.bottomText) ?? false,
	);
	const sum = $derived(sumArray(data));
	const decideFillColor = (
		fColors: BarChartNumericalOptions["fillColors"],
		idx: number,
	) => {
		if (isGradient && gradientId) {
			if (gradientMode === "continuous") return "transparent";
			else return `url('#${gradientId}')`;
		}
		return getOnlyItemOrWrap(fColors, idx);
	};

	const barRenderData = $derived.by(() => {
		const calcs = [];
		for (let i = 0; i < data.length; i++) {
			const datap = data[i] ?? 0; // Fixes label-only points
			const [trueBarHeight, trueBarWidth] = calcBarDims(
				placement,
				datap,
				evenWidth,
				barWidth ?? evenWidth,
			);
			const [barX, barY] = calcBarCoords(
				i,
				placement,
				trueGap,
				trueVWidth,
				trueVHeight,
				evenWidth,
				barWidth ?? evenWidth,
				trueBarWidth,
				trueBarHeight,
			);

			const barPayload = {
				color: decideFillColor(fillColors, i),
				labelColor: getOnlyItemOrWrap(labelColors, i),
				strokeColor: strokeColors ? getOnlyItemOrWrap(strokeColors, i) : null,
				strokeWidth: strokeWidths ? getOnlyItemOrWrap(strokeWidths, i) : null,
				width: trueBarWidth,
				height: trueBarHeight,
				x: barX,
				y: barY,
				v: datap,
			};

			calcs.push(barPayload);
		}

		return calcs;
	});
</script>

<svg
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns="http://www.w3.org/2000/svg"
	{width}
	{height}
	viewBox={`0 0 ${trueVWidth} ${trueVHeight}`}
>
	<title>BarChart</title>
	{#if isGradient && gradientColors}
		<LinearGradient
			{gradientColors}
			direction={gradientDirection}
			mode={trueGradientMode}
			{gradientId}
			{gradientMaskId}
		>
			{#each barRenderData as bar}
				{let { x, y, width, height } = bar}
				<rect
					class={classNames.rectEle}
					{x}
					{y}
					{width}
					{height}
					fill={"#ffffff"}
				/>
			{/each}
		</LinearGradient>
		<!-- <defs>
			<linearGradient id={gradientId} gradientTransform={trueGradientDirection}>
				{#each gradientStops as stop}
					<stop stop-color={stop[0]} offset={`${stop[1]}%`} />
				{/each}
			</linearGradient>
			{#if trueGradientMode === "continuous" && gradientMaskId}
				<mask id={gradientMaskId}>
					<rect x={0} y={0} width="100%" height="100%" fill="#000000" />
					{#each barRenderData as bar}
						{let { x, y, width, height } = bar}
						<rect
							class={classNames.rectEle}
							{x}
							{y}
							{width}
							{height}
							fill={"#ffffff"}
						/>
					{/each}
				</mask>
			{/if}
		</defs>
		{#if trueGradientMode === "continuous" && gradientMaskId && gradientId}
			<rect
				mask={`url('#${gradientMaskId}')`}
				x={0}
				y={0}
				width="100%"
				height="100%"
				fill={`url('#${gradientId}')`}
			/>
		{/if} -->
	{/if}
	{#each barRenderData as bar, i}
		{let {
			x,
			y,
			v,
			color,
			labelColor,
			width,
			height,
			strokeColor,
			strokeWidth,
		} = bar}

		<rect
			class={classNames.rectEle}
			{x}
			{y}
			{width}
			{height}
			fill={color}
			stroke={strokeColor}
			stroke-width={strokeWidth}
		/>

		{#if hasLabels}
			{#if imageLabels?.[i]}
				{const [labelX, labelY] = $derived(
					calcBarLabelCoords(placement, x, y, width, height),
				)}
				{const [xOffset, yOffset] = $derived(calcImageLabelOffset(placement))}
				<ImageLabel
					imgLabel={imageLabels[i]}
					x={labelX + xOffset}
					y={labelY + yOffset}
					{labelColor}
					{subgrouping}
				/>
			{:else if hasNormalLabels && labels?.[i]}
				{const [labelX, labelY] = $derived(
					calcBarLabelCoords(placement, x, y, width, height),
				)}
				<TextLabel label={labels[i]} x={labelX} y={labelY} {labelColor} />
			{/if}

			{#if dataLabels}
				{const [dataLabelX, dataLabelY] = $derived(
					calcDataLabelCoords(placement, x, y, width, height),
				)}
				{const dataLabelText = $derived(getDataLabelText(dataLabels, v, sum))}
				<TextLabel
					label={dataLabelText}
					x={dataLabelX}
					y={dataLabelY}
					{labelColor}
				/>
			{/if}
		{/if}
	{/each}
</svg>
