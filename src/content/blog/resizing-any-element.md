---
author: SacDeNoeuds
pubDatetime: 2024-06-11T08:27:36.000+02:00
modDatetime:
title: Resizing Any Element With A CSS Utility
featured: false
draft: false
tags:
  - CSS
description: Beware, extremely complicated code ahead!
---

<!-- prettier-ignore -->
```html
<style>
  /* using logical properties */
  [resize="inline"], .resize-inline { resize: inline; }
  /* or orientation ones */
  [resize="horizontal"], .resize-horizontally { resize: horizontal; }
</style>

<div>
  <div resize="inline" or class="resize-inline">
    Resizable 🤷
  </div>
  <div>
    Non-resizable
  </div>
</div>
```
