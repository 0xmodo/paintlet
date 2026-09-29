# Project structure

```text
src/
  main.js                 Load styles and start the application
  app/
    create-app.js         Assemble the document, editor, UI and actions
    shortcuts.js          Keyboard bindings
  editor/
    paint-document.js     Bitmap, history and flood fill
    canvas-editor.js      Pointer gestures, tools and selections
  features/
    files.js              New, open, save and drag-and-drop
    image.js              Resize, transforms, invert and clear
    selection.js          Selection and history actions
    text.js               Text placement and font loading
    view.js               Zoom and color actions
  ui/
    catalog.js            Tool, palette, menu and zoom definitions
    layout.js             Application markup
    controls.js           Controls and document status
    menus.js              Menu interaction and focus
    dialogs.js            Modal dialogs and notifications
    help.js               Guide and about dialogs
    icons.js              SVG icons
  styles/
    index.css             Stylesheet entry and cascade order
    fonts.css             Local Ubuntu font faces
    base.css              Theme and global defaults
    chrome.css            Window, menus and command bar
    workspace.css         Tools and canvas workspace
    palette.css           Color controls
    status.css            Status bar and zoom controls
    dialogs.css           Dialogs and notifications
    responsive.css        Responsive overrides
  assets/fonts/           Ubuntu font files and their license
docs/                     Development documentation
```

`app/create-app.js` owns the application state and passes explicit dependencies
to the feature and UI factories. Features return named actions used by both
buttons and keyboard shortcuts. The editor modules do not import application
or UI modules; document and selection events keep the interface synchronized.

Keep the stylesheet imports in `styles/index.css` in order, with responsive
overrides last. Vite processes fonts referenced by `styles/fonts.css` and emits
hashed assets into the build.

`index.html`, the package manifests and `vercel.json` remain at the repository
root for Vite and Vercel. `dist/`, `node_modules/`, `.vercel/` and local environment
files are generated or machine-specific and remain ignored.

Run `npm ci` to install, `npm run dev` to develop, and `npm run build` followed by
`npm run preview` to inspect the production build. When changing module boundaries,
check drawing, undo/redo, fill, selection movement, crop, resize, rotation, text,
PNG import/export, local font loading and the mobile layout in a browser.
