---
author: SacDeNoeuds
pubDatetime: 2024-06-11T06:51:11.000+02:00
modDatetime:
title: Styling Semantics – The Disabled Example
featured: true
draft: false
tags:
  - CSS
  - HTML
  - TIL
description: Spoiler Alert! I will target pseudo-classes and attributes 🤫
---

## The Markup

```html
<button disabled>…</button>
<a aria-disabled="true">…</a>
<any-thing aria-disabled="true">…</any-thing>
```

## The CSS

If you can, use layers to make sure those modifiers will be applied over component/element styles.

```css
@layer components, modifiers;

@layer components {
  button, .button { … }
  a, .link { … }
}

@layer modifiers {
  :disabled, [aria-disabled="true"], [disabled] {
    opacity: 0.7;
    cursor: not-allowed;
  }
}
```

If you don’t have the possibility to leverage CSS Layers, you can increase the selector’s specificity without using `!important` by repeating the selector (as many times as needed):

```css
:disabled:disabled,
[aria-disabled="true"][aria-disabled="true"],
[disabled][disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}
```
