import { tools } from '../ui/catalog.js';

export function bindShortcuts({ $, editor, actions, selectTool, closeMenus }) {
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
}
