---
author: SacDeNoeuds
pubDatetime: 2024-06-11T08:40:31.000+02:00
modDatetime:
title: Styling Tables Using CSS Grids
featured: true
draft: false
tags:
  - HTML
  - CSS
  - TIL
description: In-depth summary of what I learned that I found nowhere else – yet?.
---

## Table of contents

## The Markup

```html
<table>
  <thead>
    <tr>
      <th>Heading 1</th>
      <th>Heading 2</th>
      <th>Heading 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Cell 1</td>
      <td>Cell 2</td>
      <td>Cell 3</td>
    </tr>
  </tbody>
</table>
```

## CSS – first trivial approach

Let’s start with the container.

<!-- prettier-ignore -->
```css
table {
  /* This will be set via JavaScript */
  --column-count: 0;
  display: grid;
  /* let all the columns take one free space or at least their min-content */
  grid-template-columns: repeat(var(--column-count), minmax(min-content, 1fr));
  /* if all min-contents are wider than parent, overflow gracefully */
  overflow-x: auto;
}
```

Now we need to tell intermediate elements to delegate positioning to `td`s. For that, CSS has our back with `display: contents`.

<!-- prettier-ignore -->
```css
thead, tbody, tr { display: contents; }
```

This will make it as if the markup was:

```html
<table>
  <th>Heading 1</th>
  <th>Heading 2</th>
  <th>Heading 3</th>
  <td>Cell 1</td>
  <td>Cell 2</td>
  <td>Cell 3</td>
</table>
```

<details>
  <summary>Here’s some code for a prettier table (purely cosmetic stuff)</summary>

<!-- prettier-ignore -->
```css
table { --border: 1px solid #333; }
th {
  font-weight: bold;
  background-color: #eee;
}
& th, & td {
  padding: 0.5rem;
  white-space: nowrap;
  overflow-x: auto;
  & + th, & + td { border-inline-start: var(--border); }
}
& :where(tbody tr > :is(td, th)) { border-block-start: var(--border); }
```

</details>

## Let’s set the column count – in JS

A first trivial approach:

```js
const table = document.querySelector("table");
const columnCount = table.querySelectorAll("thead > tr > *").length;
table.style.setProperty("--column-count", String(columnCount));
```

That’s it! You have your first CSS grid table. How about we go further?

## Allowing a specific template

Let’s take a 4-cells-table, the first and last ones should be as small as possible, we don’t care about the 2 middle cells.

The matching `grid-template-columns` would be `min-content 1fr 1fr min-content`. Basically, `min-content` and `1fr` are _really_ the 2 keywords you’ll need to know. FYI you can also give fixed values like `50px`, `10rem`, etc…

By specifying 4 keywords, you specify rows of 4 cells, it is a simple as that.

We could provide it as an inline style, or a CSS variable to make it shorter.

<!-- prettier-ignore -->
```html
<table style="--template: min-content 1fr 1fr min-content">
  …
</table>

<style>
  table {
  --column-count: 0;
  /* Let's use a default value falling back to a column-count based template */
  --template: repeat(var(--column-count), minmax(min-content, 1fr));
  /* if the template is overridden, it will be applied */
  /* otherwise the default behavior will apply */
  grid-template-columns: var(--template);
}
</style>
```

## Resizing a table header

TL;DR: `th { resize: inline; }`.

## Handling colspan

No-one focuses on that… but you have to deal with colspan! Take the following HTML:

```html
<table>
  <!-- The example is stupid but hey, a lot of requirements are. -->
  <!-- I'm just adapting here -->
  <thead>
    <tr>
      <th>Heading 1</th>
      <th colspan="2">Heading 2</th>
      <th>Heading 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Cell 1</td>
      <td>Cell 2</td>
      <td colspan="2">Cell 3</td>
    </tr>
  </tbody>
</table>
```

Let’s start with the CSS:

<!-- prettier-ignore -->
```css
& [colspan='2'] { grid-column-end: span 2; }
& [colspan='3'] { grid-column-end: span 3; }
/* handle as many colspan-s as need here. I did not find any other way :S */
/* I usually go up to 12 */
```

Then the JavaScript:

```ts
const mount = (
  table: HTMLTableElement,
  template?: Array<'min-content' | `${number}${'fr' | 'px' …}`>,
) => {
    const columnCount = getColumnCount(table) // 4 in our example
    // handle template scenario
    if (template) {
      assertColumnCount(template, columnCount)
      return table.style.setProperty('--template', template.join(' '))
    } else {
      table.style.setProperty('--column-count', String(columnCount))
      table.style.removeProperty('--template')
    }
  }

const assertColumnCount = (template: unknown[], columnCountInDOM: number) => {
  // fail fast – in dev – if there is any mismatch.
  if (template.length === columnCountInDOM) return
  throw new Error(
    `received a template for ${template.length} columns but got ${columnCountInDOM}`,
  )
}

const getColumnCount = (table: HTMLTableElement) => {
  const cells =
    table.querySelectorAll('thead > tr > *') ||
    table.querySelectorAll('tbody > tr:first-child > *') // fallback to first tbody row when there's no thead.

  // the sum of spans gives us the row cell count.
  return Array.from(cells).reduce((acc, element) => {
    const span =
      (element instanceof HTMLTableCellElement && element.colSpan) ||
      Number(element.ariaColSpan) ||
      1 // default span is 1
    return acc + span
  }, 0)
}
```

## TSX – React, Solid, whatever…

I use TSX a lot – and not React, calm down React lovers – so here’s a full-featured component:

````tsx
type Unit = "fr" | "rem" | "px";

interface Props extends ComponentProps<"table"> {
  /**
   * defines each column's width, can be an rem/px value, "min" or "flex"
   * @example
   * ```tsx
   * <Table columns={['15px', '1fr', '1fr', 'min-content']} … />
   * ```
   */
  template?: Array<"min-content" | "auto" | `${number}${Unit}`>;
}
export const Table = ({ template, ...props }: Props) => {
  const mount = () => {
    // cf the mount function earlier :D
    // to call with mount(tableRef, template)
  };

  return <table {...props} />;
};
````

## Other APIs to consider

We could imagine providing the template at table-header for instance, and then infer it back from JS:

<small>
I don’t know how it plays with colspan•s though 🤔
</small>

```html
<table default-cell-size="1fr">
  <thead>
    <tr>
      <th size="min-content">Heading 1</th>
      <th size="1fr">Heading 2</th>
      <th size="1fr">Heading 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Cell 1</td>
      <td>Cell 2</td>
      <td>Cell 3</td>
    </tr>
  </tbody>
</table>
<script>
  const table = document.querySelector("table");
  const headers = Array.from(
    document.querySelectorAll("table > thead > tr > th")
  );
  const defaultSize = table.getAttribute("default-cell-size");
  const template = headers
    .map(header => header.getAttribute("size") || defaultSize)
    .filter(Boolean)
    .join(" ")
    .trim();
  // will be empty string if no table default-cell-size nor th size is provided.
  if (template) table.style.setProperty("--template", template);
</script>
```
