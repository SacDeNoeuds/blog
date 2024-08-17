---
author: SacDeNoeuds
pubDatetime: 2024-08-17T07:45:13.000+02:00
modDatetime:
title: How to provide your own local JSX import source using TypeScript.
featured: true
draft: false
tags:
  - JSX
description: A look at how to use `jsxImportSource` TS compiler option
---

I like crafting my own stuff. And I knew one could provide their own `jsxImportSource` in the TypeScript compiler option. Now I figured how to make it point to a local implementation.

## Project structure

```
root/
├── project/
│   └── my-awesome-app/
│       ├── client/
│       └── server/
└── library/
    ├── std/
    └── dom-kit/
        └── jsx/ // where my implementation lives
```

## TSConfig

```json
{
  "compilerOptions": {
    // …
    "jsx": "react-jsx",
    "jsxImportSource": "dom-kit/jsx",
    "paths": {
      // …
      "dom-kit": ["./library/dom-kit/index"],
      "dom-kit/*": ["./library/dom-kit/*"]
    }
  }
}
```

## How it works

The `jsxImportSource` expects a folder containing at least those files:

- jsx-runtime.ts exporting functions `jsx` and `jsxs`
- jsx-dev-runtime.ts exporting function `jsxDEV`

In both files you can add a `Fragment` export to support `<>…</>` notation.

## The base to get started

Let’s demo a dead-simple string-based implementation of jsx – that could be used server-side for instance.

```ts
// jsx-runtime.ts

type Child = string | number | boolean;
type Children = Child[]
type Element = string; // Actually rendered. On Frontend, that would be dom nodes.
type Component<Props = {}> = (props: Props & { children?: Children }) => Element
export type ComponentProps<T> = T extends Component<infer Props>
  ? Props
  : T extends keyof HTMLElementTagNameMap
  ? InferPropsOfElement<T> // to implement
  : never

export { jsx as jsxs }
export function jsx<TagOrComponent extends string | Component>(
  tag: TagOrComponent,
  props: ComponentProps<TagOrComponent>
): Element {
  // basically, if it’s a function.
  if (isComponent(tag)) return tag(props)
  const { children, ...attributes } = props;
  return createElement(tag, attributes, children)
}

function createElement<Tag extends HTMLElementTagNameMap>(
  tag: Tag,
  attributes: InferAttributesFor<Tag>,
  children: Children
): Element {
  // handle edge-cases.
  if (isSelfClosed(tag)) …

  return [
    `<${tag} ${stringifyAttributes(attributes)}>`,
    ...children.map(childToNode),
    `</${tag}>`
  ].join('')
  // Going Further:
  // - trim spaces when no attributes specified
  // - trim children
  // - optimize performance by avoiding using an array.
}
```

```tsx
// jsx-dev-runtime.ts

export { jsx as jsxDEV } from "./jsx-runtime";
```

## Add some types for intellisense

You can define those wherever you want, I defined them in jsx/types.d.ts
Basically I took those from Svelte, which took theirs from React 18.

I ended up exporting a type with the following signature:

```ts
export interface HTMLElements {
  a: HTMLAnchorAttributes;
  abbr: HTMLAttributes;
  address: HTMLAttributes;
  area: HTMLAreaAttributes;
  // …
}
```

Then at the end of my `jsx.ts` file, I added

```ts
declare global {
  namespace JSX {
    type Element = string;
    interface IntrinsicElements extends HTMLElements {}
  }
}
```

## Closing words

You’re all set, you now have full control over your JSX & element types – which can be handy –, but remember, with great power…
In the meantime, I’ll make another post on how to build your own client-side JSX runtime.
