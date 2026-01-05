# toomanycharts

<p align="center">
 <img height="250" width="250" src="./extras/dalogo.png" />
</p>

The portable, lightweight, performant library for basic SVG charting needs.

Have you ever wanted a quick and simple bar or line chart without installing any heavy dependencies or reading through loads of docs? Well look no further as you can SVG bar charts in `<1ms` with only **3 lines** of code. 

This README is a more of an overview, the [Docs Website](https://danteasc4.github.io/toomanycharts/docs) has additional details & examples!

More links:
- ["Why make or use this lib"](https://danteasc4.github.io/toomanycharts/docs/why-toomanycharts)
- [Changelog](https://danteasc4.github.io/toomanycharts/docs/changelog)
- [Roadmap](https://danteasc4.github.io/toomanycharts/docs/roadmap)

![](./extras/hsep.png)

## Features

- Chart Types
    - Bar chart
    - Bar chart stacked
    - Line chart
- Styling options
    - Fill, stroke, and more
        - Built-in alternating colors & gradient fills
    - Placement options (which edge the chart data protrudes from)
    - Class names attachable to various SVG element outputs
    - Output sizing
    - Output viewbox sizing
- Labels
    - Data labels
        - Literal, percentage, images
    - Dataset labels
- SSR!
    - If called in a server environment will draw on the single dependency of this project `linkedom` to build SVG elements, otherwise will use available DOM APIs. 

![](./extras/hsep.png)

## Installation

```sh
npm i toomanycharts 
```

```sh
pnpm i toomanycharts 
```

```sh
bun i toomanycharts 
```

```sh
deno i npm:toomanycharts 
```

![](./extras/hsep.png)

## Quick start

```ts
import {barchart} from 'toomanycharts';

// `barchart` will return an SVG Element
const myFirstChart = barchart({
    data: [50, 100, 30],
});

// Simply add it to the DOM
document.body.appendChild(myFirstChart);
```

![](./extras/hsep.png)

## Documentation

[Docs Website](https://danteasc4.github.io/toomanycharts/docs)

## Development & Contributing

This project is powered by Deno, which has a lot of really convenient things to speed up development.

That being said there are a couple dev dependencies!

- The Deno runtime which you can find instructions for installing [here](https://docs.deno.com/runtime/getting_started/installation/)
- [watchexec](https://github.com/watchexec/watchexec)
    - This is for running both unit tests **&** the gallery at the same time, and re-run on change. This is useful as tests should be passing, but also when working on charts the visual output is critical. The gallery builds all charts specified at the end of test files & spits them out locally in a super fast easy to view webpage.
    - Deno's task runner provides the `recursive` flag which is awesome as it enables running multiple projects at once (tests & gallery here) but the `--watch` flag seemed to not pick up changes made to the gallery & so instead of toiling with it I just settled on using `watchexec` as it was an easy fix and has potential other useful functionality.

###

Project Structure

```
 toomanycharts
 ├─ tests
 │  └─ speed
 ├─ src
 │  ├─ utils
 │  ├─ math
 │  └─ creating
 ├─ scripts
 ├─ extras
 ├─ e2e
 │  ├─ test-vanilla-ts-anim
 │  │  ├─ vitest
 │  │  │  ├─ Basic
 │  │  │  └─ BasicAnim
 │  │  ├─ public
 │  │  └─ src
 │  │     └─ scripts
 │  ├─ gallery
 │  │  └─ out
 │  └─ test-svelte-ts
 │     ├─ vitest-threebar
 │     │  ├─ threebarhorizontal
 │     │  └─ threebarvertical
 │     ├─ src
 │     │  ├─ lib
 │     │  └─ assets
 │     └─ public
 └─ docs
```

Dir Breakdown

- `/tests`
    - Deno powered unit testing!
    - Gallery charts also supplied in each `.test.ts` file.
    - [docs here](https://jsr.io/@std/testing/doc/bdd)
    - `/speed`
        - Tests for analyzing speed!
        - These are run via the deno `bench` command. (e.g. deno bench `tests/speed/barchart_granular_incr.bench.ts`)
- `/src`
    - Source dir! files here are for top-level package exports, aka what users would import from the package.
    - `/creating`
        - Functionality pertaining primarily to actual DOM creation
    - `/math`
        - Functionality pertaining primarily to math operations
    - `/utils`
        - Miscellaneous functionality
- `/scripts`
    - Currently houses the file used to publish a new version of the package to npm
- `/extras`
    - Mainly holding images for markdown referencing.
    - Also can contain other extra things not necessarily critical to lib!
- `/e2e`
    - End to end testing! In the future I'd like to have a folder for each major framework & other places where this library could be used where example usage can be fully testing in isolated fresh environments.
    - **Currently mainly utilizing the gallery**
    - `/gallery`
        - Small sub-project, the earlier `.test.ts` files each utilize a function that spits out a templated `html` file. This `gallery` project then serves those locally, in a live-updating way.
        - Allows for rapid development & visual testing.
        - `app.css` is a basic shared stylesheet used by the test pages to neatly display the created charts, and their names if they have one, regardless of the number of charts.
        - `test.jpg` is a test image used in testing of image labels.
    - `/test-svelte-ts`
        - Example svelte + typescript project setup using vite.
        - Draws from a local build of the library for testing (installed via `pnpm install ../../npm` after running build script locally.)
    - `/test-vanilla-ts-anim`
        - Example vanilla typescript project setup using vite.
        - Draws from a local build of the library for testing (installed via `pnpm install ../../npm` after running build script locally.)
        - Build is used in documentation.
- `/docs`
    - Deployed build of documentation website.
    - Managed in [separate repo](https://github.com/DanteASC4/tmc-docs)
    - Powered by [fumadocs](https://www.fumadocs.dev/)
