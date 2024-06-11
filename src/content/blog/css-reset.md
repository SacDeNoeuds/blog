---
author: SacDeNoeuds
pubDatetime: 2024-06-11T06:42:40.000+02:00
modDatetime:
title: The Shortest and Most Aggressive CSS Reset
featured: false
draft: false
tags:
  - CSS
  - TIL
description: How to reset most of the styles in 15 lines of CSS
---

Because it is very common to provide our own implementations of buttons, links and so on, I tend to reset every element’s view to … nothing. Simple text, no background, same font size and family, etc.

Here’s the snippet:

```css
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  border: none;
  text-decoration: none;
  font: inherit;
  color: inherit;
  background: transparent;
  line-height: inherit;
}

*:focus,
*:focus-visible {
  outline: none;
}
```
