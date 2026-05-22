# Migration ToDos

Moving to a monorepo with scoped releases!!

- [ ] **overarching**
  - [x] move to monorepo project setup
    - [x] new dir structure of `packages/{scope}/src`
    - [x] use deno workspaces
  - [ ] rename repo to `jgmc` (just give me charts!)
  - [ ] rename docs slug
  - [ ] update docs
  - [ ] update README
- [ ] `core` scope
  - [x] move math & other shared util / operational logic here
  - [ ] create a README
  - [ ] publish
- [ ] `vanilla` scope
  - [x] re-implement all charts
  - [x] no `linkedom` anymore, string time!
  - [x] utilize `core` scope for calculations
  - [ ] create a README
  - [ ] publish
- [ ] `svelte` scope
  - [ ] TBD
- [ ] `react` scope
  - [ ] TBD
- [ ] `ascii` scope
  - [ ] TBD

# Running misc ToDos

This will now be a smaller list of things that aren't critical but should be done eventually:

- [ ] Using above "migration" ToDo for now



# Next Up
- [ ] Allow a function for labels so users can have their own format.
- [ ] Add 'unit' as an option for `dataLabels` display format.

# Postponed / Not Priority ToDos

- [ ] Implement support for `ManyLinearGradientOptions` aka more than one linear gradient
  - Also a valid argument for *not* doing that, being performance mainly.
- [ ] Radial gradients?
- [ ] Remove or use `feedback.ts`
  - [ ] Not a huge issue since I don't think it affects output size or anything but need to clean that up or use it eventually! Original idea was interesting!
- [ ] Maybe get test coverage to 100?

# Archived / Past ToDos

- [x] Move defaults into their own chart file
  - Better bundling as every chart will no longer unnecessarily load the defaults of other charts
- [x] Types cleanup
  - [x] Consider expanding `BarChartStyleOptions` into a more general "style options" and just use `Pick` on sub-types.
    - I had already done this!
  - [x] Either use or remove the `responsive` option
    - Maybe do a future thing with it
  - [x] Add `strokeWidths` as an alias for `thickness`
    - If both exist use `thickness`
  - [x] Change wording for explaining the `gap` option to say that it will automatically evenly space the bars.
  - [x] Rename for consistency
    - [x] `BarChartNumericalOpts` -> `BarChartNumericalOptions`
    - [x] `BarChartStackedOpts` -> `BarChartStackedOptions`
  - [x] Do a once-over on type descriptions
- [x] Refinement things
  - [x] Ensure top-level chart exported functions have a standard logic flow
    - [x] Also check that things are only happening when needed (e.g. I see in `barchart` I create a `textGroup`, `dataLabelTextGroup`, and `imageLabelGroup` element despite labels being optional!!!)
    - [x] I also have an anchor comment for `classes?.groupClass` ?!?!
  - [x] The above "types cleanup" todos
  - [x] Use arrays over objects for coords
  - [x] Standardize the default `tmc-...` class nomenclature & usage
  - [x] Do a once-over on defaults for all charts
    - [x] Move existing defaults where I fallback to colors to the 'defaults'
  - [ ] Documentation needed:
    - [ ] Universals page (explain some of the ideology behind things, like strokeWidths being on all chart types, array params wrapping, `classes`, etc...)
    - [ ] Per-chart page defaults made clear
      - [x] default classes too!
  - [x] Remove the `classes` option!