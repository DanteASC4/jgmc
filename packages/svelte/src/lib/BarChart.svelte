<script lang="ts">
	import {
		autoMaxNumerical,
		BarChartDefaults,
		type BarChartNumericalOptions,
		calcAutoGap,
		calcBarCoords,
		calcBarDims,
		calcBarLabelCoords,
		calcDataLabelCoords,
		calcDataPointsAmt,
		calcEvenWidth,
		calcImageLabelOffset,
		calcTrueVDims,
		classNames,
		getDataLabelText,
		getOnlyItemOrWrap,
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
	const hasImageLabels = $derived(
		Array.isArray(imageLabels) && imageLabels.length > 0,
	);
	const hasLabels = $derived(hasNormalLabels || !!dataLabels || hasImageLabels);

	const topOrBot = $derived(placement === "top" || placement === "bottom");
	const exceedsWidth = $derived(data.some((v) => v > viewWidth));
	const exceedsHeight = $derived(data.some((v) => v > viewHeight));

	const dataPointsAmt = $derived(
		calcDataPointsAmt(data, hasLabels, labels, imageLabels),
	);

	const evenWidth = $derived(
		calcEvenWidth(topOrBot, width, height, dataPointsAmt),
	);

	const trueGap = $derived(
		calcAutoGap(topOrBot, width, height, dataPointsAmt, gap),
	);

	const [trueVWidth, trueVHeight] = $derived(
		calcTrueVDims(
			topOrBot,
			viewWidth,
			viewHeight,
			exceedsWidth,
			exceedsHeight,
			largest,
			max,
		),
	);

	const isGradient = $derived(!!gradientColors && gradientColors.length > 0);
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
