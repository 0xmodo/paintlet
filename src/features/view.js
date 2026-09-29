import { zoomLevels } from '../ui/catalog.js';

export function createViewActions({ $, editor, zoom, fit, setColor }) {
  const actions = {
    zoomIn() { zoom(zoomLevels.find(value => value > editor.zoom * 100) || 400); },
    zoomOut() { zoom([...zoomLevels].reverse().find(value => value < editor.zoom * 100) || 25); },
    actual() { zoom(100); }, fit,
    swap() { const old = editor.foreground; setColor(editor.background); setColor(old, true); },
    customColor() { $('#foreground').click(); },
    backgroundColor() { $('#background').click(); },
  };

  return actions;
}
