---
author: SacDeNoeuds
pubDatetime: 2024-06-11T07:05:55.000+02:00
modDatetime:
title: Satisfying My Designer’s Need For Column-Based Grids
featured: true
draft: false
tags:
  - CSS
  - TIL
description: How I learned to build simple responsive column-based grids
---

## Table Of Content

## Requirements

It’s pretty common for designers to base their design on column-based grids, Bootstrap blessed us with `container`, `.container-fluid` and `col-lg` – blurry memories.
And because it’s too easy, our fellow designers like complicating things by introducing requirements like:

- 4 columns on mobile
- 8 columns on tablet
- 12 columns on desktop
  And usually they don’t acknowledge wider screens like TVs or developers’ monitors 😅 (but don’t tell them plz).

## Gimme the CSS already!! – First Batch

Okay, okay! I get it, my dev life is boring to you, fine – it is to a lot of people frankly. There you go:

<!-- prettier-ignore -->
```html
<div class="grid">
  <div class="column span-1 tablet:span-2 desktop:span-4">…</div>
  <div class="column span-1 tablet:span-2 desktop:span-4">…</div>
  <div class="column span-1 tablet:span-2 desktop:span-4">…</div>
</div>

<style>
  .grid {
    --column-count: 4;
    display: grid;
    /* That’s the magic */
    grid-template-columns: repeat(var(--column-count), 1fr);
    gap: 1rem; /* apply a gap if need be */
  }

  @media (min-width: 600px) {
    .grid { --column-count: 8; }
  }
  @media (min-width: 1200px) {
    .grid { --column-count: 12; }
  }

  .column { --span: 1; grid-column-end: span var(--span); }
  .span-2 { --span: 2; }
  .span-3 { --span: 3; }
  .span-4 { --span: 4; }
  /* etc. */
  .tablet\:span-2 { --span: 2; }
  .tablet\:span-3 { --span: 3; }
  /* etc. */
  .desktop\:span-2 { --span: 2; }
  .desktop\:span-3 { --span: 3; }
</style>
```

## Making It Progressive

In the flavor upper, you need to specify the column span for every viewport unless it’s `1`, boring.
There is a way to specify the column size for mobile and change it _only_ for wider viewports:

<!-- prettier-ignore -->
```html
<div class="grid">
  <div class="column 1/4">…</div>
  <div class="column 1/4 tablet:3/8">…</div>
  <div class="column 1/4 tablet:3/8 desktop:5/12">…</div>
</div>

<style>
  .grid {
    --column-count: 4;
    display: grid;
    grid-template-columns: repeat(var(--column-count), 1fr);
    gap: 1rem; /* apply a gap if need be */
  }

  @media (min-width: 600px) {
    .grid { --column-count: 8; }
  }
  @media (min-width: 1200px) {
    .grid { --column-count: 12; }
  }

  .column {
    --column-size: 0;
    --span: calc(var(--cell-size) * var(--cell-count));
    grid-column-end: span var(--span);
  }
  /* selector for `column 1/4 */
  .column.\31 \/4 { --column-size: 1/4; }
  .column.\32 \/4 { --column-size: 2/4; }
  .column.\33 \/4 { --column-size: 3/4; }
  .column.\34 \/4 { --column-size: 4/4; }
  /* etc. */
  .column.tablet\:1\/8 { --column-size: 1/8; }
  .column.tablet\:2\/8 { --column-size: 2/8; }
  /* etc. */
  .column.desktop\:1\/12 { --column-size: 1/12; }
  .column.desktop\:2\/12 { --column-size: 2/12; }
</style>
```

## You can even go attribute-based

I :love: attribute-based style for their expressiveness – imo it’s like classes with options. The best thing is that you can [add intellisense yourself](../adding-intellisense-to-attribute-styles/)!

<!-- prettier-ignore -->
```html
<div grid>
  <div grid-col="1/4">…</div>
  <div grid-col="1/4 tablet:3/8">…</div>
  <div grid-col="1/4 tablet:3/8 desktop:5/12">…</div>
</div>

<style>
  [grid] {
    --column-count: 4;
    display: grid;
    grid-template-columns: repeat(var(--column-count), 1fr);
    gap: 1rem; /* apply a gap if need be */
  }

  @media (min-width: 600px) {
    [grid] { --column-count: 8; }
  }
  @media (min-width: 1200px) {
    [grid] { --column-count: 12; }
  }

  [column] {
    --column-size: 0;
    --span: calc(var(--cell-size) * var(--cell-count));
    grid-column-end: span var(--span);
  }
  /* See footer notes for attribute selectors */
  [grid-col^="1/4"] { --column-size: 1/4; }
  [grid-col^="2/4"] { --column-size: 2/4; }
  [grid-col^="3/4"] { --column-size: 3/4; }
  [grid-col^="4/4"] { --column-size: 4/4; }
  /* etc. */
  [grid-col~="tablet:1/8"] { --column-size: 1/8; }
  [grid-col~="tablet:2/8"] { --column-size: 2/8; }
  /* etc. */
  [grid-col$="desktop:1/12"] { --column-size: 1/12; }
  [grid-col$="desktop:2/12"] { --column-size: 2/12; }
</style>
```

## Footer note on attribute selectors

Source: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors#attrvalue_2)

`[attr^=value]` represents elements with an attribute name of attr whose value is prefixed (preceded) by value.<br>
**Examples**: `[attr^="value"]`<br>
– Will match: `<el attr="value" />`<br>
– Won’t match: `<el attr="no value" />`

`[attr$=value]` represents elements with an attribute name of attr whose value is suffixed (followed) by value.<br>
**Examples**: `[attr$="value"]`<br>
– Will match: `<el attr="value" />`<br>
– Won’t match: `<el attr="value invalid" />`

`[attr~=value]` represents elements with an attribute name of attr whose value is a whitespace-separated list of words, one of which is exactly value.<br>
**Examples**: `[attr~="value"]`<br>
– Will match: `<el attr="some value" />` or `<el attr="this value is great" />`<br>
– Won’t match: `<el attr="no-value is great" />`

`[attr*=value]` represents elements with an attribute name of attr whose value contains at least one occurrence of value within the string.<br>
**Examples**: `[attr*="value"]`<br>
– Will match: `<el attr="no-value-is-great" />`
