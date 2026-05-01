# Running misc ToDos

This will now be a smaller list of things that aren't critical but should be done eventually:

- [x] Move defaults into their own chart file
  - Better bundling as every chart will no longer unnecessarily load the defaults of other charts
- [ ] Types cleanup
  - [x] Consider expanding `BarChartStyleOptions` into a more general "style options" and just use `Pick` on sub-types.
    - I had already done this!
  - [x] Either use or remove the `responsive` option
    - Maybe do a future thing with it
  - [ ] Add `strokeWidths` as an alias for `thickness`
    - If both exist use `thickness`
  - [ ] Change wording for explaining the `gap` option to say that it will automatically evenly space the bars.
  - [x] Rename for consistency
    - [x] `BarChartNumericalOpts` -> `BarChartNumericalOptions`
    - [x] `BarChartStackedOpts` -> `BarChartStackedOptions`
  - [ ] Do a once-over on type descriptions
- [ ] Refinement things
  - [ ] Ensure top-level chart exported functions have a standard logic flow
    - [ ] Also check that things are only happening when needed (e.g. I see in `barchart` I create a `textGroup`, `dataLabelTextGroup`, and `imageLabelGroup` element despite labels being optional!!!)
    - [ ] I also have an anchor comment for `classes?.groupClass` ?!?!
  - [ ] Maybe get test coverage to 100?
  - [ ] The above "types cleanup" todos
  - [ ] Use arrays over objects for coords
  - [ ] Standardize the default `tmc-...` class nomenclature & usage
    - [ ] Add to gradients & whatnot
  - [ ] Do a once-over on defaults for all charts
    - [ ] Move existing defaults where I fallback to colors to the 'defaults'
  - [ ] Documentation needed:
    - [ ] Universals page (explain some of the ideology behind things, like strokeWidths being on all chart types, array params wrapping, `classes`, etc...)
    - [ ] Per-chart page defaults made clear
      - [ ] `classes` too!

# Postponed / Future / Not Priority ToDos

- [ ] Implement support for `ManyLinearGradientOptions` aka more than one linear gradient
  - Also a valid argument for *not* doing that, being performance mainly.
- [ ] Radial gradients?