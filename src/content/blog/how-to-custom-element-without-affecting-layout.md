---
author: SacDeNoeuds
pubDatetime: 2024-09-14T07:46:54.000+02:00
modDatetime: 
title: How to Custom Element without affecting layout
featured: false
draft: false
tags: 
  - HTML
  - CSS
  - TIL
description: "TL;DR – use `display: contents`".
---

Let’s say you have an `counter-button` elements like:

```html
<counter-buttons>
  <button>-</button>
  <input type="number" readonly disabled />
  <button>+</button>
</counter-buttons>
```

But you don’t want to affect layout. Remember that `display: contents` we heavily used for the [HTML Tables as CSS Grid](./styling-tables-with-css-grid/) ?

```html
<style>
  counter-buttons {
    display: contents;
  }
  .container {
    display: flex;
    gap: 1rem;
  }
</style>
<div class="container">
  <counter-buttons>
    <button>-</button>
    <input type="number" readonly disabled />
    <button>+</button>
  </counter-buttons>
</div>
```

Yey, our button/input/button group is spaced as before wrapping them in a `<counter-buttons>` 🙌
