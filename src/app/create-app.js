import { PaintDocument } from '../editor/paint-document.js';
import { Editor } from '../editor/canvas-editor.js';
import { mountLayout } from '../ui/layout.js';
import { bindMenus } from '../ui/menus.js';
import { createDialogs } from '../ui/dialogs.js';
import { createControls } from '../ui/controls.js';
import { createHelpActions } from '../ui/help.js';
import { createFileActions } from '../features/files.js';
import { createSelectionActions } from '../features/selection.js';
import { createImageActions } from '../features/image.js';
import { createViewActions } from '../features/view.js';
import { createTextTool } from '../features/text.js';
import { bindShortcuts } from './shortcuts.js';

export function createApp(root) {
  mountLayout(root);
  const $ = selector => root.querySelector(selector);
  const bitmap = new PaintDocument();
  const state = { filename: 'Untitled' };
  const editor = new Editor($('#paint-canvas'), bitmap, point => {
    $('#coordinates').textContent = `${Math.floor(point.x)}, ${Math.floor(point.y)} px`;
  }, (point, color) => addText(point, color));
  const { closeMenus } = bindMenus();
  const { dialog, toast } = createDialogs({ $, editor, closeMenus });
  const controls = createControls({ $, bitmap, editor, state, toast });
  const { update, selectTool, setColor, fit } = controls;
  const addText = createTextTool({ bitmap, dialog, toast });
  const actions = {
    ...createFileActions({ $, bitmap, editor, state, dialog, toast, fit, update }),
    ...createSelectionActions({ bitmap, editor, update, selectTool }),
    ...createImageActions({ bitmap, editor, dialog, fit }),
    ...createViewActions({ $, editor, ...controls }),
    ...createHelpActions({ dialog }),
  };
  root.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => { closeMenus(); actions[button.dataset.action]?.(); });
  });
  bindShortcuts({ $, editor, actions, selectTool, closeMenus });
  window.addEventListener('beforeunload', event => {
    if (bitmap.dirty || editor.selection?.floating) { event.preventDefault(); event.returnValue = ''; }
  });
  window.addEventListener('blur', () => editor.cancel());
  setColor('#202020');
  update();
  requestAnimationFrame(fit);
}
