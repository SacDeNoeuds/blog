---
author: SacDeNoeuds
pubDatetime: 2024-06-11T08:10:27.000+02:00
modDatetime:
title: How To Print A Single Element
featured: false
draft: false
tags:
  - CSS
  - HTML
  - TS/JS
  - TIL
description: It fits in a 10-lines stylesheet
---

It’s pretty common to be asked to generated PDFs client-side. For that I like using the native print-to-PDF feature, accessible via the native print dialog one can trigger using `window.print()`

## An example is worth a thousand words

<!-- prettier-ignore -->
```html
<style>
  @media print {
  body { visibility: hidden; }

  .printable {
    visibility: visible;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>

<body>
  <div>
    <div>
      …Deep Nested DOM…
      <button onclick="window.print()">
        Print
      </button>
    </div>
    <div class="printable">
      This will be the only part sent to the print dialog, enjoy!
    </div>
  </div>
</body>
```
