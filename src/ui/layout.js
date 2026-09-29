import { tools, colors, menus, zoomLevels } from './catalog.js';
import { icon } from './icons.js';

export function mountLayout(root) {
  root.innerHTML = `
    <main class="paint-window" aria-label="Paintlet application">
      <header class="titlebar">
        <span class="app-icon">${icon('palette')}</span>
        <h1 id="window-title">Untitled — Paintlet</h1>
        <span class="title-note">a little room for your imagination</span>
        <button class="title-help" data-action="about" aria-label="About Paintlet" title="About Paintlet">?</button>
      </header>
      <nav class="menubar" aria-label="Application menus">
        ${Object.entries(menus).map(([label, entries]) => `<div class="menu-wrap"><button class="menu-trigger" aria-haspopup="true" aria-expanded="false" aria-controls="menu-${label}"><span>${label[0]}</span>${label.slice(1)}</button><div class="menu-popup" id="menu-${label}" hidden role="menu" aria-label="${label}">${entries.map(entry => entry ? `<button role="menuitem" data-action="${entry[0]}"><span>${entry[1]}</span><kbd>${entry[2]}</kbd></button>` : '<hr>').join('')}</div></div>`).join('')}
        <span class="menubar-end">Made for making things.</span>
      </nav>
      <div class="commandbar" role="toolbar" aria-label="File and editing actions">
        <div class="command-group">${[['new','New image'],['open','Open image'],['save','Save as PNG']].map(([name,label]) => `<button class="icon-button" data-action="${name}" title="${label}" aria-label="${label}">${icon(name)}</button>`).join('')}</div>
        <div class="command-group">${[['undo','Undo'],['redo','Redo']].map(([name,label]) => `<button class="icon-button" data-action="${name}" title="${label}" aria-label="${label}">${icon(name)}</button>`).join('')}</div>
        <div class="command-group"><button class="text-button" data-action="resize">${icon('image')}<span>Canvas size</span></button><button class="text-button" data-action="crop" title="Crop to selection">${icon('crop')}<span>Crop</span></button></div>
        <span class="command-hint">A blank canvas. A good place to start.</span>
      </div>
      <div class="editor-layout">
        <aside class="toolbox" aria-label="Drawing tools">
          <div class="grip" aria-hidden="true"></div>
          <div class="tool-grid">${tools.map(([name,label,key]) => `<button class="tool-button" data-tool="${name}" aria-label="${label}" aria-pressed="${name === 'pencil'}" title="${label} (${key})">${icon(name)}</button>`).join('')}</div>
          <div class="tool-settings">
            <label for="brush-size">Size</label>
            <select id="brush-size" title="Stroke size"><option value="1">1 px</option><option value="3" selected>3 px</option><option value="6">6 px</option><option value="10">10 px</option><option value="18">18 px</option><option value="28">28 px</option></select>
            <div class="stroke-preview" aria-hidden="true"><span id="stroke-sample"></span></div>
            <label for="shape-style">Shape</label>
            <select id="shape-style" title="Shape fill style"><option value="outline">Outline</option><option value="both">Fill + line</option><option value="solid">Solid fill</option></select>
            <div class="toolbox-caption"><span>PAINTLET</span><small>make your mark</small></div>
          </div>
        </aside>
        <section class="drawing-area" aria-label="Drawing workspace">
          <div class="workspace-caption"><span id="document-label">UNTITLED</span><span>YOUR NEXT GREAT IDEA STARTS HERE</span></div>
          <div class="canvas-scroll" id="canvas-scroll">
            <div class="canvas-frame"><canvas id="paint-canvas" aria-label="Drawing canvas. Select a tool, then drag to draw." tabindex="0"></canvas><span class="canvas-handle" aria-hidden="true"></span></div>
          </div>
          <div class="workspace-footer"><span id="active-tool">Pencil</span><span>Shift for straight lines & perfect shapes</span><span>PNG · LOCAL ONLY</span></div>
        </section>
      </div>
      <footer class="palettebar">
        <button class="color-stack" data-action="swap" aria-label="Swap foreground and background colors" title="Swap colors (X)"><span class="back-color"></span><span class="front-color"></span></button>
        <div class="swatches" role="group" aria-label="Color palette">${colors.map(color => `<button class="swatch" data-color="${color}" style="--swatch:${color}" title="${color} · click: foreground, right-click: background" aria-label="Set color ${color}"></button>`).join('')}</div>
        <div class="custom-colors"><label title="Custom foreground color"><input id="foreground" type="color" value="#202020" aria-label="Foreground color"/><span>Edit colors</span></label><input id="background" type="color" value="#ffffff" aria-label="Background color" title="Background color"/></div>
        <span class="palette-tip">Left click: foreground<br>Right click: background</span>
      </footer>
      <div class="statusbar"><span id="status-message" role="status">For a little inspiration, just start drawing.</span><span id="coordinates">0, 0 px</span><span id="dimensions">960 × 640 px</span><div class="zoom-controls"><button data-action="zoomOut" aria-label="Zoom out">−</button><select id="zoom" aria-label="Zoom level">${zoomLevels.map(value => `<option value="${value}" ${value === 100 ? 'selected' : ''}>${value}%</option>`).join('')}</select><button data-action="zoomIn" aria-label="Zoom in">+</button><button data-action="fit" class="fit-button" title="Fit to window">Fit</button></div></div>
    </main>
    <input type="file" id="file-input" accept="image/png,image/jpeg,image/webp,image/gif,image/bmp" hidden />
    <dialog id="dialog"><form id="dialog-form"><div class="dialog-title"><strong id="dialog-title"></strong><button type="button" id="close-dialog" aria-label="Close dialog">×</button></div><div id="dialog-body"></div><div class="dialog-actions"><button type="button" id="cancel-dialog">Cancel</button><button type="submit" id="confirm-dialog">OK</button></div></form></dialog>
    <div class="toast" id="toast" role="status" hidden></div>`;
}
