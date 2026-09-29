import './style.css';
import { PaintDocument } from './document.js';
import { Editor } from './editor.js';
import { icon } from './icons.js';

const tools = [
  ['select', 'Select', 'S', 'Drag to select. Drag inside to move; Delete to erase.'],
  ['eraser', 'Eraser', 'E', 'Drag to erase using the background color.'],
  ['fill', 'Fill with color', 'F', 'Click a connected area to fill it.'],
  ['picker', 'Pick color', 'I', 'Click a pixel to sample its color.'],
  ['pencil', 'Pencil', 'P', 'Draw freely. Right-click to use the background color.'],
  ['brush', 'Brush', 'B', 'Paint a smooth, round brush stroke.'],
  ['spray', 'Airbrush', 'A', 'Hold to spray a fine mist of color.'],
  ['text', 'Text', 'T', 'Click where you want to add text.'],
  ['line', 'Line', 'L', 'Drag a line. Hold Shift to snap its angle.'],
  ['rect', 'Rectangle', 'R', 'Drag a rectangle. Hold Shift for a square.'],
  ['ellipse', 'Ellipse', 'O', 'Drag an ellipse. Hold Shift for a circle.'],
  ['round', 'Rounded rectangle', 'U', 'Drag a rounded rectangle. Hold Shift for a square.'],
];
const colors = ['#000000','#808080','#800000','#808000','#008000','#008080','#000080','#800080','#808040','#004040','#0080ff','#004080','#8000ff','#804000',
  '#ffffff','#c0c0c0','#ff0000','#ffff00','#00ff00','#00ffff','#0000ff','#ff00ff','#ffff80','#00ff80','#80ffff','#8080ff','#ff0080','#ff8040'];
const menus = {
  File: [['new', 'New', 'Ctrl+N'], ['open', 'Open…', 'Ctrl+O'], ['save', 'Save as PNG', 'Ctrl+S']],
  Edit: [['undo', 'Undo', 'Ctrl+Z'], ['redo', 'Redo', 'Ctrl+Y'], null, ['selectAll', 'Select all', 'Ctrl+A'], ['deselect', 'Deselect', 'Esc'], ['delete', 'Delete selection', 'Del']],
  View: [['zoomIn', 'Zoom in', '+'], ['zoomOut', 'Zoom out', '−'], ['actual', 'Actual size', '100%'], ['fit', 'Fit to window', '']],
  Image: [['crop', 'Crop to selection', ''], ['resize', 'Canvas size…', ''], null, ['flipH', 'Flip horizontally', ''], ['flipV', 'Flip vertically', ''], ['rotate', 'Rotate 90° clockwise', ''], ['invert', 'Invert colors', ''], ['clear', 'Clear image', '']],
  Colors: [['customColor', 'Edit foreground color…', ''], ['backgroundColor', 'Edit background color…', ''], ['swap', 'Swap colors', 'X']],
  Help: [['help', 'Quick guide', '?'], ['about', 'About Paintlet', '']],
};

document.querySelector('#app').innerHTML = `
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
    <div class="statusbar"><span id="status-message" role="status">For a little inspiration, just start drawing.</span><span id="coordinates">0, 0 px</span><span id="dimensions">960 × 640 px</span><div class="zoom-controls"><button data-action="zoomOut" aria-label="Zoom out">−</button><select id="zoom" aria-label="Zoom level">${[25,50,75,100,125,150,200,300,400].map(value => `<option value="${value}" ${value === 100 ? 'selected' : ''}>${value}%</option>`).join('')}</select><button data-action="zoomIn" aria-label="Zoom in">+</button><button data-action="fit" class="fit-button" title="Fit to window">Fit</button></div></div>
  </main>
  <input type="file" id="file-input" accept="image/png,image/jpeg,image/webp,image/gif,image/bmp" hidden />
  <dialog id="dialog"><form id="dialog-form"><div class="dialog-title"><strong id="dialog-title"></strong><button type="button" id="close-dialog" aria-label="Close dialog">×</button></div><div id="dialog-body"></div><div class="dialog-actions"><button type="button" id="cancel-dialog">Cancel</button><button type="submit" id="confirm-dialog">OK</button></div></form></dialog>
  <div class="toast" id="toast" role="status" hidden></div>`;

const $ = selector => document.querySelector(selector);
const bitmap = new PaintDocument();
let filename = 'Untitled';
let toastTimer;
const editor = new Editor($('#paint-canvas'), bitmap, point => {
  $('#coordinates').textContent = `${Math.floor(point.x)}, ${Math.floor(point.y)} px`;
}, (point, color) => addText(point, color));

function toast(message) {
  clearTimeout(toastTimer);
  $('#toast').textContent = message; $('#toast').hidden = false;
  toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 2800);
}
function update() {
  const title = `${filename}${bitmap.dirty ? ' *' : ''} — Paintlet`;
  $('#window-title').textContent = title; document.title = title;
  $('#document-label').textContent = filename;
  $('#dimensions').textContent = `${bitmap.width} × ${bitmap.height} px`;
  document.querySelectorAll('[data-action="undo"]').forEach(button => button.disabled = !bitmap.canUndo && !editor.selection?.floating);
  document.querySelectorAll('[data-action="redo"]').forEach(button => button.disabled = !bitmap.canRedo);
  document.querySelectorAll('[data-action="crop"], [data-action="delete"], [data-action="deselect"]').forEach(button => button.disabled = !editor.selection);
}
bitmap.addEventListener('change', update);
editor.canvas.addEventListener('selectionchange', update);

function selectTool(name) {
  editor.setTool(name);
  document.querySelectorAll('[data-tool]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.tool === name)));
  const tool = tools.find(item => item[0] === name);
  $('#active-tool').textContent = tool[1]; $('#status-message').textContent = tool[3];
}
function setColor(color, background = false) {
  editor[background ? 'background' : 'foreground'] = color;
  $('#foreground').value = editor.foreground; $('#background').value = editor.background;
  $('.front-color').style.background = editor.foreground;
  $('.back-color').style.background = editor.background;
  $('#stroke-sample').style.background = editor.foreground;
  document.querySelectorAll('[data-color]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.color === editor.foreground)));
}
editor.canvas.addEventListener('pickcolor', event => { setColor(event.detail.color, event.detail.background); toast(`Picked ${event.detail.color}`); });
document.querySelectorAll('[data-tool]').forEach(button => button.addEventListener('click', () => selectTool(button.dataset.tool)));
document.querySelectorAll('[data-color]').forEach(button => {
  button.addEventListener('click', () => setColor(button.dataset.color));
  button.addEventListener('contextmenu', event => { event.preventDefault(); setColor(button.dataset.color, true); });
});
$('#foreground').addEventListener('input', event => setColor(event.target.value));
$('#background').addEventListener('input', event => setColor(event.target.value, true));
$('#brush-size').addEventListener('change', event => {
  editor.size = Number(event.target.value); $('#stroke-sample').style.height = `${Math.min(editor.size, 18)}px`;
});
$('#shape-style').addEventListener('change', event => editor.shapeStyle = event.target.value);

const zoomLevels = [25,50,75,100,125,150,200,300,400];
function zoom(value) {
  const percent = Math.max(10, Math.min(400, Math.round(value)));
  $('#zoom option[data-fit]')?.remove();
  if (!zoomLevels.includes(percent)) {
    const option = new Option(`${percent}%`, String(percent)); option.dataset.fit = ''; $('#zoom').add(option);
  }
  $('#zoom').value = String(percent); editor.setZoom(percent / 100);
}
function fit() {
  const space = $('#canvas-scroll');
  zoom(Math.min((space.clientWidth - 48) / bitmap.width, (space.clientHeight - 48) / bitmap.height, 1) * 100);
}
$('#zoom').addEventListener('change', event => zoom(Number(event.target.value)));

function closeMenus() {
  document.querySelectorAll('.menu-popup').forEach(menu => menu.hidden = true);
  document.querySelectorAll('.menu-trigger').forEach(button => button.setAttribute('aria-expanded', 'false'));
}
document.querySelectorAll('.menu-trigger').forEach(button => {
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true'; closeMenus();
    if (open) { button.setAttribute('aria-expanded', 'true'); button.nextElementSibling.hidden = false; }
  });
  button.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') { event.preventDefault(); closeMenus(); button.setAttribute('aria-expanded', 'true'); button.nextElementSibling.hidden = false; button.nextElementSibling.querySelector('button:not(:disabled)')?.focus(); }
  });
});
document.addEventListener('pointerdown', event => { if (!event.target.closest('.menu-wrap')) closeMenus(); });
document.querySelectorAll('.menu-popup').forEach(menu => menu.addEventListener('keydown', event => {
  if (!['ArrowDown', 'ArrowUp', 'Escape'].includes(event.key)) return;
  event.preventDefault();
  if (event.key === 'Escape') { closeMenus(); menu.previousElementSibling.focus(); return; }
  const buttons = [...menu.querySelectorAll('button:not(:disabled)')];
  const index = buttons.indexOf(document.activeElement);
  buttons[(index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length]?.focus();
}));

function dialog(title, body, confirm = 'OK') {
  return new Promise(resolve => {
    editor.cancel(); closeMenus();
    $('#dialog-title').textContent = title; $('#dialog-body').innerHTML = body;
    $('#confirm-dialog').textContent = confirm;
    const element = $('#dialog');
    const finish = value => {
      element.close(); $('#dialog-form').onsubmit = null; element.oncancel = null;
      resolve(value);
    };
    $('#dialog-form').onsubmit = event => { event.preventDefault(); finish(new FormData(event.target)); };
    $('#cancel-dialog').onclick = $('#close-dialog').onclick = () => finish(null);
    element.oncancel = event => { event.preventDefault(); finish(null); };
    element.showModal();
    setTimeout(() => $('#dialog-body').querySelector('input, textarea, select')?.focus(), 0);
  });
}
async function allowDiscard() {
  editor.commitSelection();
  return !bitmap.dirty || Boolean(await dialog('Unsaved picture', '<p>Your picture has unsaved changes.</p><p>Save it as a PNG first if you want to keep it.</p>', 'Discard changes'));
}
async function addText(point, color) {
  const values = await dialog('Add text', `<label class="field">Your text<textarea name="text" rows="3" maxlength="4000" required placeholder="Hello, world!"></textarea></label><div class="field-row"><label class="field">Font<select name="font"><option value="Arial">Arial</option><option value="Georgia">Georgia</option><option value="monospace">Monospace</option></select></label><label class="field">Size<input name="size" type="number" value="28" min="8" max="200" required /></label></div><label class="check-label"><input name="bold" type="checkbox" /> Bold</label>`, 'Place text');
  if (!values) return;
  const size = Number(values.get('size'));
  bitmap.ctx.save(); bitmap.ctx.font = `${values.get('bold') ? 'bold ' : ''}${size}px ${values.get('font')}`;
  bitmap.ctx.fillStyle = color; bitmap.ctx.textBaseline = 'top';
  String(values.get('text')).split('\n').forEach((line, i) => bitmap.ctx.fillText(line, point.x, point.y + i * size * 1.25));
  bitmap.ctx.restore(); bitmap.commit();
}
function transform(kind) {
  editor.commitSelection();
  const source = document.createElement('canvas'); source.width = bitmap.width; source.height = bitmap.height;
  source.getContext('2d').drawImage(bitmap.canvas, 0, 0);
  if (kind === 'rotate') { bitmap.canvas.width = source.height; bitmap.canvas.height = source.width; }
  const ctx = bitmap.ctx;
  ctx.save(); ctx.clearRect(0, 0, bitmap.width, bitmap.height);
  if (kind === 'flipH') { ctx.translate(bitmap.width, 0); ctx.scale(-1, 1); }
  if (kind === 'flipV') { ctx.translate(0, bitmap.height); ctx.scale(1, -1); }
  if (kind === 'rotate') { ctx.translate(bitmap.width, 0); ctx.rotate(Math.PI / 2); }
  ctx.drawImage(source, 0, 0); ctx.restore(); bitmap.commit();
}

const actions = {
  async new() { if (await allowDiscard()) { filename = 'Untitled'; bitmap.reset(960, 640); fit(); toast('A fresh start.'); } },
  open() { $('#file-input').click(); },
  save() {
    editor.cancel(); editor.commitSelection();
    const frame = bitmap.history[bitmap.index];
    bitmap.canvas.toBlob(blob => {
      if (!blob) { toast('Could not export the picture.'); return; }
      const url = URL.createObjectURL(blob), link = document.createElement('a');
      link.href = url; link.download = `${filename === 'Untitled' ? 'my-picture' : filename}.png`; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      bitmap.saved = frame; update(); toast('Your PNG is ready.');
    }, 'image/png');
  },
  undo() { editor.cancel(); if (editor.selection?.floating) { editor.selection = null; editor.render(); update(); } else { editor.selection = null; bitmap.undo(); update(); } },
  redo() { editor.cancel(); editor.commitSelection(); bitmap.redo(); },
  selectAll() { selectTool('select'); editor.makeSelection({ x: 0, y: 0, width: bitmap.width, height: bitmap.height }); editor.render(); update(); },
  deselect() { editor.commitSelection(); },
  delete() { editor.deleteSelection(); },
  crop() { editor.crop(); },
  zoomIn() { zoom(zoomLevels.find(value => value > editor.zoom * 100) || 400); },
  zoomOut() { zoom([...zoomLevels].reverse().find(value => value < editor.zoom * 100) || 25); },
  actual() { zoom(100); }, fit,
  swap() { const old = editor.foreground; setColor(editor.background); setColor(old, true); },
  customColor() { $('#foreground').click(); },
  backgroundColor() { $('#background').click(); },
  async resize() {
    const values = await dialog('Canvas size', `<p>Set the size of your picture in pixels. Existing artwork stays at the top left; smaller sizes trim the edges.</p><div class="field-row"><label class="field">Width<input name="width" type="number" min="16" max="4096" value="${bitmap.width}" required /></label><label class="field">Height<input name="height" type="number" min="16" max="4096" value="${bitmap.height}" required /></label></div><p class="muted">Maximum 4096 × 4096 pixels. You can undo this change.</p>`, 'Resize');
    if (!values) return;
    editor.commitSelection(); bitmap.resize(Number(values.get('width')), Number(values.get('height'))); fit();
  },
  flipH() { transform('flipH'); }, flipV() { transform('flipV'); }, rotate() { transform('rotate'); },
  invert() {
    editor.commitSelection(); const image = bitmap.snapshot();
    for (let i = 0; i < image.data.length; i += 4) { image.data[i] = 255 - image.data[i]; image.data[i+1] = 255 - image.data[i+1]; image.data[i+2] = 255 - image.data[i+2]; }
    bitmap.ctx.putImageData(image, 0, 0); bitmap.commit();
  },
  async clear() {
    if (!await dialog('Clear image', '<p>Fill the whole picture with the background color?</p><p class="muted">You can undo this change.</p>', 'Clear image')) return;
    editor.selection = null; bitmap.ctx.fillStyle = editor.background; bitmap.ctx.fillRect(0, 0, bitmap.width, bitmap.height); bitmap.commit();
  },
  help() { return dialog('A quick guide', `<div class="guide"><p><strong>Make your mark.</strong> Choose a tool on the left and draw on the white canvas.</p><p><strong>Make it yours.</strong> Click a swatch for your foreground color, or right-click for the background. Press X to swap them.</p><p><strong>Keep experimenting.</strong> Ctrl/⌘+Z undoes a step. Ctrl/⌘+Shift+Z redoes it. Hold Shift for straight lines and perfect shapes.</p><p><strong>Move things around.</strong> Use Select to draw a box, then drag inside it. Crop keeps only the selected area.</p><p><strong>Take it with you.</strong> Open an image or drop one onto the canvas. Ctrl/⌘+S saves a PNG. Pictures stay in your browser and are not uploaded.</p><p class="muted">Tool shortcuts: S select · P pencil · B brush · E eraser · F fill · I picker · T text · L line · R rectangle · O ellipse.</p></div>`); },
  about() { return dialog('About Paintlet', `<div class="about-icon">${icon('palette')}</div><h2>A familiar place to create.</h2><p>A browser-based tribute to classic Windows Paint.<br>A blank canvas, a handful of tools, and you.</p><p class="muted">An independent project by 0xmodo.<br>Not affiliated with Microsoft.</p><p class="muted">Your images are processed locally. Save your work before closing the tab.</p>`); },
};
document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => { closeMenus(); actions[button.dataset.action]?.(); }));

async function openFile(file) {
  if (!file) return;
  if (!/^image\/(png|jpeg|webp|gif|bmp|x-ms-bmp)$/.test(file.type)) { toast('Please choose a PNG, JPEG, WebP, GIF or BMP image.'); return; }
  if (file.size > 32 * 1024 * 1024) { toast('Please choose an image smaller than 32 MB.'); return; }
  if (!await allowDiscard()) return;
  try {
    const image = await createImageBitmap(file);
    if (image.width > 4096 || image.height > 4096) { image.close(); toast('Maximum image size is 4096 × 4096 pixels.'); return; }
    filename = file.name.replace(/\.[^.]+$/, ''); bitmap.reset(image.width, image.height, image); image.close(); fit(); toast('Image opened. Make it your own.');
  } catch { toast('This image could not be opened. Try another file.'); }
}
$('#file-input').addEventListener('change', event => { openFile(event.target.files[0]); event.target.value = ''; });
const workspace = $('.drawing-area');
workspace.addEventListener('dragover', event => { event.preventDefault(); workspace.classList.add('drop-target'); });
workspace.addEventListener('dragleave', event => { if (!workspace.contains(event.relatedTarget)) workspace.classList.remove('drop-target'); });
workspace.addEventListener('drop', event => { event.preventDefault(); workspace.classList.remove('drop-target'); openFile(event.dataTransfer.files[0]); });
document.addEventListener('keydown', event => {
  if ($('#dialog').open || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.isContentEditable) return;
  const key = event.key.toLowerCase();
  if (event.ctrlKey || event.metaKey) {
    const action = { z: event.shiftKey ? 'redo' : 'undo', y: 'redo', s: 'save', o: 'open', n: 'new', a: 'selectAll' }[key];
    if (action) { event.preventDefault(); actions[action](); }
    return;
  }
  if (key === 'escape') { editor.cancel(); editor.commitSelection(); closeMenus(); }
  else if (key === 'delete' || key === 'backspace') { if (editor.selection) { event.preventDefault(); actions.delete(); } }
  else if (key === 'x') actions.swap();
  else if (key === '+' || key === '=') actions.zoomIn();
  else if (key === '-') actions.zoomOut();
  else if (key === '?') actions.help();
  else { const tool = tools.find(item => item[2].toLowerCase() === key); if (tool) selectTool(tool[0]); }
});
window.addEventListener('beforeunload', event => { if (bitmap.dirty || editor.selection?.floating) { event.preventDefault(); event.returnValue = ''; } });
window.addEventListener('blur', () => editor.cancel());
setColor('#202020'); update();
requestAnimationFrame(fit);
