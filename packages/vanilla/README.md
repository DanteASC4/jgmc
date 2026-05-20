# toomanycharts

<p align="center">
 <img height="250" width="250" src="./extras/dalogo.png" />
</p>

Flexible, straightforward charts at the speed of data.

Have you ever wanted a quick and simple bar or line chart without installing any heavy dependencies or reading through loads of docs? Well look no further as you can SVG bar charts in `<1ms` with only **3 lines** of code!

This README is a more of an overview, the [Docs Website](https://danteasc4.github.io/toomanycharts/docs) is everything you need to know for using this lib!

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
    - Donut chart
    - Pie chart
- Styling options
    - Fill, stroke, and more
        - Built-in alternating colors & gradient fills
    - Placement options (which edge the chart data protrudes from)
    - Sensible default class names attached to various SVG element outputs
    - Output sizing
    - Output viewbox sizing
- Labels
    - Data labels
        - Literal, percentage, images
    - Dataset labels
- Flexible output usage
  - Since strings are the output you can do create them just about anywhere & use them however works best for you.
  - SSR, streaming, client creationg, etc...

![](./extras/hsep.png)

## Installation

```sh
npm i @jgmc/vanilla
```

```sh
pnpm i @jgmc/vanilla
```

```sh
bun i @jgmc/vanilla
```

```sh
deno i npm:@jgmc/vanilla
```

![](./extras/hsep.png)

## Quick start

```ts
import {barchart} from '@jgmc/vanilla';

// `barchart` will return an SVG Element
const myFirstChart = barchart({
    data: [50, 100, 30],
});

// Simply add it to the page wherever!
document.body.setHTML(myFirstChart);
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

### Project Structure

```
 vanilla
 ├─ tests
 ├─ src
 │  ├─ creating
 ├─ README.md
 ├─ deno.json
 └─ assets
```

Dir Breakdown

- `/tests`
    - Deno powered unit testing!
    - [docs here](https://jsr.io/@std/testing/doc/bdd)
- `/src`
    - Source dir for vanilla implementation of all charts!
    - `/creating`
        - DOM serialization related functions
- `/scripts`
    - Currently houses the file used to publish a new version of the package to npm
- `/asssets`
    - Mainly holding images for markdown referencing.
    - Also can contain other extra things not necessarily critical to lib!