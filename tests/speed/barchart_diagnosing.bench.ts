import { barchart } from "../../src/index.ts";
import { formatTime, randomDataArray } from "../helpers.ts";

const size3RandomDataArrs: number[][] = [];
const size5RandomDataArrs: number[][] = [];
const size10RandomDataArrs: number[][] = [];
const size20RandomDataArrs: number[][] = [];
const size50RandomDataArrs: number[][] = [];
const size100RandomDataArrs: number[][] = [];

const vMin = 0;
const vMax = 1000;

for (let i = 0; i < 1000; i++) {
	size3RandomDataArrs.push(randomDataArray(3, 3, vMin, vMax));
	size5RandomDataArrs.push(randomDataArray(5, 5, vMin, vMax));
	size10RandomDataArrs.push(randomDataArray(10, 10, vMin, vMax));
	size20RandomDataArrs.push(randomDataArray(20, 20, vMin, vMax));
	size50RandomDataArrs.push(randomDataArray(50, 50, vMin, vMax));
	size100RandomDataArrs.push(randomDataArray(100, 100, vMin, vMax));
}

const size3Timings: number[] = [];
const times: number[] = [];
let totalTime = 0;
for (const dataset of size3RandomDataArrs) {
	const start = performance.now();
	barchart({
		data: dataset,
	});
	const end = performance.now();
	const time = end - start;
	size3Timings.push(time);
	totalTime+=time;
	times.push(time);
	// if(time > 5) {
	// 	console.log(dataset);
	// }
	// console.log('Dataset Size: 3 run')
	// console.log(dataset);
	// console.log(`Time taken: ${formatTime(time)}`);
	// console.log('');
}
console.log(`Top 5 longest runs: ${times.sort((a,z) => z-a).slice(0,5).join(', ')}`);
console.log(`Finished ${size3Timings.length} charts in total time ${formatTime(totalTime)}`)
// console.log(size3Timings.join("\n"));
