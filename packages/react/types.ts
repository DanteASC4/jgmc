import type { BarChartNumericalOptions } from "@jgmc/core";
import type * as React from "react";
import type { Ref } from "react";

export type BarChartProps = BarChartNumericalOptions &
	React.SVGProps<SVGSVGElement> & {
		ref?: Ref<SVGSVGElement>;
	};
