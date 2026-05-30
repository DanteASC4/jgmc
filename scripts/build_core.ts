import { build, emptyDir } from "@deno/dnt";
import { copySync } from "@std/fs";

await emptyDir("npm");
await build({
	entryPoints: ["./packages/core/mod.ts"],
	outDir: "./npm/core",
	shims: {
		deno: true,
	},
	package: {
		name: "@jgmc/core",
		version: Deno.args[0],
		description:
			"JGMC Core, contains loads of math used for calculations needed for various chart types.",
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
	},
	compilerOptions: {
		lib: ["ESNext", "DOM"],
	},
	rootTestDir: "./packages/core/test",
	postBuild() {
		Deno.copyFileSync("LICENSE", "npm/core/LICENSE");
		Deno.copyFileSync("packages/core/README.md", "npm/core/README.md");
		copySync("packages/core/assets", "npm/core/assets", {
			overwrite: true,
		});
	},
});
