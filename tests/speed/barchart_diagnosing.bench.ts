import { barchart } from "../../src/index.ts";
import { randomDataArray } from "../helpers.ts";

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
let _totalTime = 0;
for (const dataset of size3RandomDataArrs) {
	const start = performance.now();
	barchart({
		data: dataset,
	});
	const end = performance.now();
	const time = end - start;
	size3Timings.push(time);
	_totalTime += time;
	times.push(time);
	// if(time > 5) {
	// 	console.log(dataset);
	// }
	// console.log('Dataset Size: 3 run')
	// console.log(dataset);
	// console.log(`Time taken: ${formatTime(time)}`);
	// console.log('');
}

// Ramping size checks

const sizeTimings = new Map<number, number[]>();

for (let i = 0; i < 100; i++) {
	const size = i + 1;

	for (let j = 0; j < 50; j++) {
		const randomDataset = randomDataArray(size, size, vMin, vMax);
		const start = performance.now();
		barchart({
			data: randomDataset,
		});
		const end = performance.now();
		const time = end - start;
		if (!sizeTimings.has(size)) {
			sizeTimings.set(size, []);
		}
		sizeTimings.get(size)?.push(time);
	}

	// console.log(`Finished ${size} charts`);
}

const _average = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
for (const [_size, _timings] of sizeTimings) {
}
