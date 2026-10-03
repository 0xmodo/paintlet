# Paintlet

A classic drawing board for your browser, built with JavaScript and the Canvas
2D API. Draw, edit pictures, and save a PNG without creating an account.

**[Try Paintlet](https://paintlet.vercel.app)** ·
**[Architecture](docs/architecture.md)** ·
**[Report an issue](https://github.com/0xmodo/paintlet/issues)**

## Features

- Draw with a pencil, brush, airbrush, lines, rectangles, rounded rectangles,
  and ellipses.
- Fill connected areas, sample colors, erase, and add text.
- Select and move part of a picture, crop to a selection, or delete it.
- Flip pictures, rotate them 90° clockwise, invert colors, and change canvas size.
- Undo and redo edits, zoom in and out, or fit the picture to the workspace.
- Open PNG, JPEG, WebP, GIF, and BMP images, including by drag and drop.
- Export the finished picture as PNG.

Image decoding, drawing, and PNG export happen in your browser. The application
has no image upload endpoint or account system.

## Using Paintlet

1. Open the [drawing board](https://paintlet.vercel.app) and choose a tool from
   the left toolbar.
2. Choose a foreground color from the palette. Right-click a swatch to set the
   background color, or press **X** to swap the two.
3. Draw on the canvas, or use **File → Open** to edit an existing picture.
4. Choose **File → Save as PNG** to download your work before closing the tab.

Hold **Shift** while drawing a line to snap its angle, or while drawing a
rectangle or ellipse to make a square or circle. Use **Select** to mark a region,
then drag inside it to move the selected pixels.

### Keyboard shortcuts

Use **Ctrl** on Windows/Linux or **⌘** on macOS for the combinations below.
Some browsers may reserve shortcuts; the menus provide the same actions.

| Action | Shortcut |
| --- | --- |
| Undo | Ctrl/⌘ + Z |
| Redo | Ctrl/⌘ + Shift + Z or Ctrl/⌘ + Y |
| Open image | Ctrl/⌘ + O |
| Save PNG | Ctrl/⌘ + S |
| New picture | Ctrl/⌘ + N |
| Select all | Ctrl/⌘ + A |
| Delete selection | Delete or Backspace |
| Zoom in / out | + / − |
| Swap foreground and background | X |
| Quick guide | ? |

Tool keys: **S** select, **P** pencil, **B** brush, **A** airbrush, **E** eraser,
**F** fill, **I** color picker, **T** text, **L** line, **R** rectangle,
**O** ellipse, and **U** rounded rectangle.

## Development

Requires Node.js **20.19+ within the 20.x series, or 22.12+**, and npm, matching
the installed Vite version's Node.js requirement.

```sh
git clone https://github.com/0xmodo/paintlet.git
cd paintlet
npm ci
npm run dev
```

Open the local URL printed by Vite. No application credentials or environment
variables are required.

To build and preview the static production output:

```sh
npm run build
npm run preview
```

The build writes to `dist/`. The included [Vercel configuration](vercel.json)
uses `npm ci`, `npm run build`, and that output directory.

## How it works

Paintlet uses native JavaScript modules, HTML/CSS, and Canvas 2D, with Vite for
development and bundling. It has no runtime framework dependency.

The picture lives in a bitmap separate from the display canvas. This lets the
editor preview selections without including their outlines in exported images.
Edits are stored as bitmap snapshots for undo and redo; a complete brush stroke
becomes one history step. Color filling uses a scanline flood-fill implementation.

| Location | Responsibility |
| --- | --- |
| [`src/app/`](src/app/) | Application setup and keyboard shortcuts |
| [`src/editor/`](src/editor/) | Bitmap state, drawing gestures, selections, and history |
| [`src/features/`](src/features/) | File operations, image actions, text, and view controls |
| [`src/ui/`](src/ui/) | Menus, dialogs, toolbar definitions, and icons |
| [`src/styles/`](src/styles/) | Layout, themes, and responsive styles |

See the [architecture guide](docs/architecture.md) for state ownership, rendering,
selection behavior, and guidance on extending the editor.

## Current limits

- There is no autosave or session recovery. Download a PNG to keep your work.
- This is a single-document raster editor. Text and shapes become pixels once
  committed; there are no persistent layers or editable vector objects.
- Imports accept files up to 32 MiB and dimensions up to 4096 × 4096 pixels.
  Imported images are drawn onto a white background.
- Canvas size changes preserve the artwork at the top left and trim it when
  shrinking; they do not scale the picture.
- History retains at most 40 snapshots, targeting 64 MiB of snapshot data while
  keeping at least two snapshots. Large pictures can exceed that memory target.
- PNG is the only export format; animation editing is not supported.

## Verification and contributions

There is currently no automated test script. A production build checks module
and asset resolution. For editor changes, also check drawing, undo/redo, fill,
selection movement, image transformations, text, import/export, zoom, and mobile
layout in a browser. The [architecture guide](docs/architecture.md#build-and-verification)
describes these checks in more detail.

For bug reports, include your browser, the steps to reproduce the problem, and
the expected and actual behavior. Attach an example image only if it is safe to
share publicly.

## Credits

An independent project by [0xmodo](https://github.com/0xmodo), inspired by classic
Windows Paint. Not affiliated with Microsoft.

Bundled Ubuntu fonts include their [font license](src/assets/fonts/LICENSE.txt).
