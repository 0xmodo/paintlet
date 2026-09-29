import { tools, zoomLevels } from './catalog.js';

export function createControls({ $, bitmap, editor, state, toast }) {
  function update() {
    const title = `${state.filename}${bitmap.dirty ? ' *' : ''} — Paintlet`;
    $('#window-title').textContent = title; document.title = title;
    $('#document-label').textContent = state.filename;
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

  return { update, selectTool, setColor, zoom, fit };
}
