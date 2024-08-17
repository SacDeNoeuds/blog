---
author: SacDeNoeuds
pubDatetime: 2024-08-17T08:18:59.000+02:00
modDatetime:
title: How to implement your own client-side jsx runtime
featured: true
draft: false
tags:
  - JSX
description: Implementing from scratch a jsx runtime (no virtual-dom).
---

I’ve shown [how to provide your own JSX import source](../how-to-provide-your-own-local-jsx-import-source/), now let’s focus on the client-side implementation.

## Let’s start with types

As in the previous article, I took types from Svelte – which took theirs from React 18, etc. –, and for client-side I exported those types:

```ts
// types.d.ts

export interface HTMLElementsAttributes {
  a: HTMLAnchorAttributes;
  // …
}
export type TagName = keyof HTMLElementTagNameMap;

// That gives me easily the event handlers of the
// existing tags in their lowercase shape: `onclick`, `onfocus`, etc.
export type HTMLElementEventHandlers<Tag extends TagName> = Pick<
  HTMLElementTagNameMap[Tag],
  Extract<keyof HTMLElementTagNameMap[Tag], `on${string}`>
> &
  GlobalEventHandlers;

export type HTMLElements = {
  [Tag in keyof HTMLElementAttributes]: HTMLElementAttributes[Tag] &
    Partial<HTMLElementEventHandlers<Tag>>;
};
```

Cool. With that addition, we can get started on the implementation.

## Static implementation

Let’s start with the easiest cases and forget about reactivity for now.
I’ll write the functions as I discover them.

```ts
export function createElement<Tag extends TagName>(
  tag: Tag,
  props: HTMLElement[Tag],
  children: Children // string | number | …, only static stuff.
) {
  const element = document.createElement(tag);
  renderChildren(element, children);
  for (const [key, value] of Object.entries(props)) {
    // OPTIONAL: only if you added the ref prop.
    if (key === "ref") value(element);
    else if (isEventHandler(key, value)) setEventHandler(element, key, value);
    else setAttribute(element, key, value);
  }
}

function isEventHandler(key: string, value: unknown): value is AnyFunction {
  return isFunction(value) && key.startsWith("on");
}

function setEventHandler(
  element: HTMLElement,
  event: string,
  handler: (event: any) => any
) {
  const eventName = event.replace("on", "").toLowerCase();
  element.addEventListener(eventName, handler);
}

const setAttribute = (element: HTMLElement, key: string, value: unknown) => {
  // handle edge-cases first
  if (key === "checked") return (element[key] = value);
  if (key === "value") return (element[key] = value ?? "");
  if (typeof value === "boolean") element.toggleAttribute(key, value);
  else element.setAttribute(key, String(value));
};

function renderChildren(element: Element, children: Children) {
  children.flat().forEach(child => {
    renderChild(element, child);
  });
}

function renderChild(element: Element, child: Child) {
  const node = childToNode(child);
  // The node may have been added previously.
  // (applicable only when we’ll add reactivity)
  if (!element.contains(node)) element.append(node);
}

function childToNode(child: Child): Node {
  if (child instanceof Node) return child;
  if (child === undefined || child === null) return document.createTextNode("");
  if (typeof child === "boolean") return document.createTextNode("");
  if (typeof child === "number") return document.createTextNode(String(child));
  if (typeof child === "string") return document.createTextNode(child);

  const error = new Error("unhandled child type");
  Object.assign(error, { cause: child });
  throw error;
}
```

Boom. All good!

## Add Reactivity

Until some reactive mechanism lands in the JS world – there’s a Signal proposal at the time of writing –, we’ll need to come up with our own implementation. Let’s bet on the platform and consider a probable API like:

```ts
type State<T> = { get: () => T, set: … }
type Computed<T> = { get: () => T }
```

To be able to render both `State` and `Computed`, the signature that interest us is `{ get: () => T }`.

So let’s do it:

```ts
type Reactive<T> = { get: () => T }

// Update the children type
type Child = string | number | …
type Children = Array<Child | Reactive<Child>>

// Update the attributes type
type HTMLElements = {
  [Tag in keyof HTMLElementAttributes]: {
    [AttributeName in keyof HTMLElementAttributes[Tag]]: HTMLElementAttributes[Tag][AttributeName] | Reactive<HTMLElementAttributes[Tag][AttributeName]>
  } &
    Partial<HTMLElementEventHandlers<Tag>>;
}

export function createElement<Tag extends TagName>(
  tag: Tag,
  props: HTMLElement[Tag],
  children: Children
) {
  const element = document.createElement(tag);
  renderChildren(element, children);
  for (const [key, value] of Object.entries(props)) {
    // OPTIONAL: only if you added the ref prop.
    if (key === "ref") value(element);
    else if (isEventHandler(key, value)) setEventHandler(element, key, value);
    // NEW:
    else if (isReactive(value)) setReactiveAttribute(element, key, value)
    else setAttribute(element, key, value);
  }
}

function isReactive(value: any): value is Reactive<any> {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as any).get === 'function'
  );
}

function setReactiveAttribute<Tag extends TagName, AttributeName extends string>(
  element: Element,
  key: AttributeName,
  value: Reactive<HTMLElements[Tag][AttributeName]>
) {
  // TODO: avoid running effect when the element
  // is disconnected from the dom.

  // the proposal is shipped with an `effect` function, let’s use it:
  effect(() => {
    // leverage the existing `setAttribute` implementation` !
    setAttribute(element, key, value.get())
  })
}

function renderChildren(element: Element, children: Children) {
  children.flat().forEach((child) => {
    isReactive(child)
      ? renderReactiveChild(element, child)
      : renderChild(element, child)
  })
}

function renderReactiveChild(element: Element, signal: Reactive<Child>) {
  // TODO: avoid running effect when the element
  // is disconnected from the dom.

  // To spare us some work, we’ll consider one use-case, and one use-case only: when we have a child list.
  // Why do I do that ? Because a single child can be considered as a list of 1 element.
  // Plus, a reactive child can see its value change from a single child to multiple children. Handling a single child as a child list covers all scenarios.

  // keep a previousNode reference to handle updates and removal of child lists.
  let previousNode: Node[];
  effect(() => {
    const child = signal.get()
    const children = Array.isArray(child) ? child : [child]
    const nodes = asList.map(childToNode)

    // "anchor" because the node I’ll take as reference to know where
    // to append/replace old nodes by new nodes.
    const anchor = previousNodes[0];
    // handle edge-case first: first render
    if (!anchor) element.append(...nodes)
    else {
      // because I’ll be removing old nodes, I need to persist an anchor first.
      const tempAnchor = document.createTextNode();
      // insert temp anchor before the anchor –previous– node.
      element.insertBefore(tempAnchor, anchor)
      previousNodes.forEach((node) => element.removeChild(node))
      // add all new nodes before temp anchor
      nodes.forEach((node) => element.insertBefore(node, tempAnchor))

      element.removeChild(tempAnchor)
    }
    previousNode = nodes; // keep reference !
  })
}
```

## The good ol’ `<Counter />` example

```tsx
interface Props {
  initialCount?: number;
}
function Counter({ initialCount = 0 }: Props) {
  const count = new Signal.State(initialCount)
  const decrement = (event: Event) => count.update((n) => n - 1)
  const increment = (event: Event) => count.update((n) => n + 1)

  return (
    <div class="counter" data-count={count}>
      <button type="button" onclick={decrement}>
        -
      </button>
      <span>{count}</span>
      <button type="button" onclick={increment}>
        +
      </button>
    </span>
  )
}
```

## There you go!

Obviously, you may encounter some edge-cases, I personally use my implementation for my side-projects, but you know, at my own risk.

So far so good, I enjoyed the journey and hope you did too.
Enjoy your handcrafted < 2kb jsx runtime 🤗

PS: Here’s the full version of my home-made ~jam~ implementation, all in a [CodeSandbox](https://codesandbox.io/p/github/SacDeNoeuds/client-side-jsx-demo/main?import=true&workspaceId=4ede00d8-090d-4142-8ec8-cedea34a9ce2) ❤️.
