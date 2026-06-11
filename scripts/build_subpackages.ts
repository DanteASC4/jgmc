import { build, emptyDir } from "@deno/dnt";
import { copySync } from "@std/fs";

const packages = [
	{
		name: "vanilla",
		description:
			"Vanilla distribution of JGMC, uses strings to create SVGs with `0` dependencies, allowing for flexible usage across various environments & frameworks.",
	},
	{
		name: "react",
		description:
			"React distribution of JGMC, uses React elements to create SVGs, allowing for easy integration with React projects and leveraging React's rendering capabilities.",
	},
];

const shared = {
	shims: {
		deno: true,
	},
	package: {
		sideEffects: false,
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
		entryPoints: [`./packages/${pkg.name}/mod.ts`],
		outDir: `./npm/${pkg.name}`,
		shims: shared.shims,
		mappings:
			pkg.name !== "core"
				? {
						"./packages/core/mod.ts": {
							name: "@jgmc/core",
							version: `^${Deno.args[0]}`,
						},
					}
				: undefined,
		package: {
			name: `@jgmc/${pkg.name}`,
			version: Deno.args[0],
			description: pkg.description,
			peerDependencies:
				pkg.name === "react"
					? {
							react: "^19.0.0",
							"react-dom": "^19.0.0",
						}
					: undefined,
			...shared.package,
		},
		compilerOptions: {
			lib: ["ESNext", "DOM"],
		},
		rootTestDir: `./packages/${pkg.name}/test`,
		postBuild() {
			Deno.copyFileSync("LICENSE", `npm/${pkg.name}/LICENSE`);
			Deno.copyFileSync(
				`packages/${pkg.name}/README.md`,
				`npm/${pkg.name}/README.md`,
			);
			copySync(`packages/${pkg.name}/assets`, `npm/${pkg.name}/assets`, {
				overwrite: true,
			});
		},
	});
}
