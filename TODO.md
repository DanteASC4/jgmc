# `core`

TODOs & other task tracking / organizing things relevant to the `@jgmc/core` package.

## ToDos

- [ ] Finish up writing about the dir structure / project overview bit.
- [ ] research a11y for svg elements
- move chart defaults to core?

## Ideas or Tabled

- more chart types
- basic axes

![](./extras/hsep.png)

# `vanilla`

TODOs & other task tracking / organizing things relevant to the `@jgmc/vanilla` package.

## ToDos

- [ ] Proofread readme
- [ ] Improve testing
  - [ ] Right now tests are pretty much purely visual. I'm sure there's a way things could be tested more properly non-visually though.

## Ideas or Tabled

- Allow 'turning off' the addition of default classes?
  - Would reduce output size
- Some sort of basic tooltip for chart elements
- Simple legends

![](./extras/hsep.png)

# `react`

TODOs & other task tracking / organizing things relevant to the `@jgmc/react` package.

## ToDos

- [x] Add all chart components
	- [x] BarChart
	- [x] BarChartStacked
	- [x] DonutChart
	- [x] PieChart
	- [x] LineChart
- [x] make sure to not bundle react & react dom
- [x] ensure there would be no repeat keys if multiple of same charts made
- [ ] investigate ignoring of `gap` parameter?
- [ ] go over the readme again

## Ideas or Tabled

- ?!?

![](./extras/hsep.png)

# `svelte`

TODOs & other task tracking / organizing things relevant to the `@jgmc/svelte` package.

## ToDos

- [ ] get started!

## Ideas or Tabled

- ?!?

![](./extras/hsep.png)

# `docs`

TODOs & other task tracking / organizing things relevant to the docs website.

## ToDos

- [ ] fix the `<LiveChart />` component
  - seems to be ignoring given css?
- [ ] should probably make the `changelog` page's styling of 'new', 'fix', and the likes into components


## Ideas or Tabled

- ~~A playground page for each package would be cool~~
  - Sort of working! `<LiveChart />`!

![](./extras/hsep.png)

# `Misc/General`

Anything else & things that may apply to all chart types

## ToDos

- [ ] Clean up root level deno tasks a bit
  - [ ] Mainly naming
- [ ] Expand on & update the `e2e` tests folder!
- [x] Gotta fix up build flow somehow
  - Now building & publishing core separately
- [ ] Standardize logic organization across charts
	- Ongoing
	- Mainly just moving things around so stuff is declared in the same places chart to chart.
- [ ] Test coverage!
- [ ] See if there's a simple way to support repeating linear gradients.

## Ideas or Tabled

- Reduce some manual

# Potential Bugs / Things to investigate

- [ ] small chart sizes (e.g. height & width 50px with larger values?)
	- Looks a bit odd but I think that may be just due to how limited space is when it's that small.
- [ ] numerical `gradientDirection`
  - [ ] E.g. `45deg` doesn't seem to be working in the react package.
  - [ ] should also allow negative numbers `-45deg`