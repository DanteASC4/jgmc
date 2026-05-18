import { build, emptyDir } from "@deno/dnt";

const packages = [
	{
		name: "core",
		description:
			"JGMC Core, contains loads of math used for calculations needed for various chart types.",
	},
	{
		name: "vanilla",
		description:
			"Vanilla distribution of JGMC, uses strings to create SVGs with `0` dependencies, allowing for flexible usage across various environments & frameworks.",
	},
];

const shared = {
	shims: {
		deno: true,
	},
	package: {
		license: "MIT",
		repository: {
			type: "git",
			url: "git+https://github.com/danteasc4/jgmc.git",
		},
		bugs: {
			url: "https://github.com/danteasc4/jgmc/issues",
		},
		keywords: [
			"charts",
			"graphs",
			"svg",
			"data-visualization",
			"ssr",
			"lightweight",
		],
	},
};

await emptyDir("npm");
for (const pkg of packages) {
	await build({
		entryPoints: [`./packages/${pkg.name}/src/mod.ts`],
		outDir: `./npm/${pkg.name}`,
		shims: shared.shims,
		package: {
			name: `@jgmc/${pkg.name}`,
			version: Deno.args[0],
			description: pkg.description,
			...shared.package,
		},
		compilerOptions: {
			lib: ["ESNext", "DOM"],
		},
		rootTestDir: `./packages/${pkg.name}/test`,
		postBuild() {
			Deno.copyFileSync("LICENSE", `npm/${pkg.name}/LICENSE`);
			Deno.copyFileSync("README.md", `npm/${pkg.name}/README.md`);
		},
	});
}

// await build({
// 	entryPoints: ["./src/index.ts"],
// 	outDir: "./npm",
// 	shims: {
// 		deno: true,
// 	},
// 	package: {
// 		name: "toomanycharts",
// 		version: Deno.args[0],
// 		description:
// 			"A small, client-side, 0-dependency package for quickly generating simple SVG-based charts.",
// 		license: "MIT",
// 		repository: {
// 			type: "git",
// 			url: "git+https://github.com/danteasc4/toomanycharts.git",
// 		},
// 		bugs: {
// 			url: "https://github.com/danteasc4/toomanycharts/issues",
// 		},
// 		keywords: [
// 			"charts",
// 			"graphs",
// 			"svg",
// 			"data-visualization",
// 			"ssr",
// 			"lightweight",
// 		]
// 	},
// 	compilerOptions: {
// 		lib: ["ESNext", "DOM"],
// 	},
// 	rootTestDir: "./test",
// 	postBuild() {
// 		Deno.copyFileSync("LICENSE", "npm/LICENSE");
// 		Deno.copyFileSync("README.md", "npm/README.md");
// 	},
// });
