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

const localCore = Deno.args.includes("--local-core");
const version = Deno.args.find((arg) => !arg.startsWith("--"));

if (!version) {
	throw new Error("Build version required. Example: 0.5.4");
}

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

const removeReactDependency = (pkgName: string) => {
	if (pkgName !== "react") return;

	const packageJsonPath = "npm/react/package.json";
	const packageLockPath = "npm/react/package-lock.json";
	const packageJson = JSON.parse(Deno.readTextFileSync(packageJsonPath));

	delete packageJson.dependencies?.react;
	if (
		packageJson.dependencies &&
		Object.keys(packageJson.dependencies).length === 0
	) {
		delete packageJson.dependencies;
	}

	Deno.writeTextFileSync(
		packageJsonPath,
		`${JSON.stringify(packageJson, null, 2)}\n`,
	);

	try {
		const packageLock = JSON.parse(Deno.readTextFileSync(packageLockPath));
		delete packageLock.packages?.[""]?.dependencies?.react;
		Deno.writeTextFileSync(
			packageLockPath,
			`${JSON.stringify(packageLock, null, 2)}\n`,
		);
	} catch {
		// dnt may skip lockfile creation depending on package manager options.
	}
};

const runSvelteTask = async (task: string) => {
	const command = new Deno.Command(Deno.execPath(), {
		args: ["task", "--cwd=packages/svelte", task],
		stderr: "inherit",
		stdout: "inherit",
	});
	const result = await command.output();

	if (!result.success) {
		throw new Error(`Svelte task failed: ${task}`);
	}
};

const buildSveltePackage = async () => {
	await runSvelteTask("check");
	await runSvelteTask("build");

	const outputDir = "npm/svelte";
	await emptyDir(outputDir);
	copySync("packages/svelte/dist", `${outputDir}/dist`, {
		overwrite: true,
	});
	Deno.copyFileSync("LICENSE", `${outputDir}/LICENSE`);
	Deno.copyFileSync("packages/svelte/README.md", `${outputDir}/README.md`);

	const packageJson = JSON.parse(
		Deno.readTextFileSync("packages/svelte/package.json"),
	);
	packageJson.version = version;
	packageJson.dependencies = {
		...(packageJson.dependencies ?? {}),
		"@jgmc/core": localCore ? "file:../core" : `^${version}`,
	};

	Deno.writeTextFileSync(
		`${outputDir}/package.json`,
		`${JSON.stringify(packageJson, null, 2)}\n`,
	);
};

for (const pkg of packages) {
	await emptyDir(`npm/${pkg.name}`);
	await build({
		entryPoints: [`./packages/${pkg.name}/mod.ts`],
		outDir: `./npm/${pkg.name}`,
		shims: shared.shims,
		mappings: {
			"./packages/core/mod.ts": {
				name: "@jgmc/core",
				version: localCore ? "file:../core" : `^${version}`,
			},
		},
		package: {
			name: `@jgmc/${pkg.name}`,
			version,
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
			removeReactDependency(pkg.name);
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

// Svelte Package Building
await buildSveltePackage();
