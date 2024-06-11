---
author: SacDeNoeuds
pubDatetime: 2024-06-11T06:38:44.000+02:00
title: Styling Semantics – The Tab Example
featured: true
draft: false
tags:
  - CSS
  - HTML
  - TIL
description: "Killing two birds in one stone: Use semantic HTML and style it in CSS"
---

## Table of contents

## The Markup

```html
<!-- As button -->
<div role="tablist">
  <button role="tab" aria-selected="true">Tab #1</button>
  <button role="tab" aria-selected="false">Tab #2</button>
  <button role="tab" aria-selected="false">Tab #3</button>
</div>

<!-- Or as links -->
<div role="tablist">
  <a role="tab" href="/tab-1" aria-selected="true">Tab #1</a>
  <a role="tab" href="/tab-2" aria-selected="false">Tab #2</a>
  <a role="tab" href="/tab-3" aria-selected="false">Tab #3</a>
</div>
```

## The CSS

```css
[role="tablist"] {
  /* Container Styles, usually flex positioning or whatever */
}

[role="tab"] {
  /* unselected tab styles */

  &[aria-selected="true"] {
    /* selected tab styles */
  }
}
```

## Adding Tab Variants

There you go:

```html
<div role="tablist" class="primary">…</div>
```

```css
.primary[role="tablist"] {
}
.primary [role="tab"] {
  &[aria-selected="true"] {
  }
}
```

Simple enough, right?
