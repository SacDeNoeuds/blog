---
author: SacDeNoeuds
pubDatetime: 2024-06-11T07:41:46.000+02:00
modDatetime:
title: Adding Intellisense To Attribute Styles
featured: true
draft: false
tags:
  - HTML
  - CSS
  - Editor
  - JSX
  - TIL
description: How to add autocompletion when using your own attributes
---

This only works for HTML purists and TSX (sorry for non-TypeScript-ers) – although your IDE may apply TS intellisense if you are using JS 🤷 (inn’it VSCode?).

What I can say: after discovering this possibility, I am super keen on refactoring my CSS utilities and some components with variants to give it a try.

The only pushback I have for now is performance concerns. To me it’s ok to use `array.map(…).filter(…)` instead of `array.reduce(…)` for readability because the performance loss is acceptable, that I don’t know about attribute selectors.

I’ve read that exact attribute selectors `[attr="value"]` are approximately as good as classes. My _guess_ is that `[attr^=]` (starts with) and `[attr$=""]` (ends with) are fairly good as well. Now what about `[attr~=]` and `[attr*=]`? Maybe they are a bit less performant compared to others. If anyone has an answer I’m super curious to hear it.

## Table of contents

## CSS sample

<!-- prettier-ignore -->
```html
<div rounded />
<div rounded="thin" />
<div rounded="block-end" />
<div rounded="thick block-end" />
<style>
  [rounded] {}
  [rounded^="thin"] {}
  [rounded^="thick"] {}
  [rounded$="block-end"] {}
</style>
```

## The associated TypeScript type

```ts
type RoundedSize = "thin" | "thick" | …
type RoundedPosition = "block-end" | "inline" | …
export type Rounded =
  | true // apply default rounded styles
  | RoundedSize // change size but not position
  | RoundedPosition // change position but not size
  | `${RoundedSize} ${RoundedPosition}` // must specify size *and then* position
```

## TSX – React, Solid, …

I haven’t checked all the tools of course, there’s just too many of them using TSX.

<details>
<summary>If it doesn’t work with your tool, follow this methodology</summary>

1. In any component file, type a known attribute. I usually spot a global one like `class`.
2. Follow the type definition (usually alt+click).
3. Spot the attributes interface that is also used in the global namespace (usually named `JSX`).
4. Augment that namespace and that attributes interface.

</details>

```ts
// in your entry point, mine is src/main.tsx
declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      rounded?: Rounded;
    }
  }
}
```

## For Svelte

```ts
// in your entry point, mine is src/main.ts
const component = new AppComponent({
  target: document.body,
  props: { … }
})

// …

declare global {
  namespace svelteHTML {
    interface HTMLAttributes {
      rounded?: Rounded
    }
  }
}

// you can externalize this into a another file. I would suggest you do.
```

## VSCode HTML language features

I haven’t checked that one yet, just I read the doc. Here’s my [perplexity.ai](https://www.perplexity.ai/search/How-does-vscode-PqtKYtRGRSOKKh0z4Lx64Q) search about it, and here’s what it says:

You can declare a `custom-attributes.html-data.json` file.

You can create a VS Code extension that contributes custom HTML data by defining the `contributes.html.customData` property in the extension's package.json file. This property should point to the JSON files containing the custom data definitions.

```json
{
  "contributes": {
    "html": {
      "customData": ["./custom-attributes.html-data.json"]
    }
  }
}
```

Now let’s populate the `custom-attributes.html-data.json` file:

```json
{
  "version": 1.1,
  "globalAttributes": [
    {
      "name": "rounded",
      "description": "Apply rounding with options to an element. Example: <div rounded /> <div rounded='{size}' /> <div rounded='{position}' /> or <div rounded='{size} {position}' ",
      "values": [
        {
          "name": "",
          "description": "apply default rounding"
        },
        {
          "name": "/^(thin|thick)$/",
          "description": "apply sized rounding"
        },
        {
          "name": "/^(block-end)$/",
          "description": "apply positioned rounding"
        },
        {
          "name": "/^(thin|thick) (block-end)$/",
          "description": "apply sized and positioned rounding"
        }
      ]
    }
  ]
}
```
