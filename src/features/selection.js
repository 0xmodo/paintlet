export function createSelectionActions({ bitmap, editor, update, selectTool }) {
  const actions = {
    undo() { editor.cancel(); if (editor.selection?.floating) { editor.selection = null; editor.render(); update(); } else { editor.selection = null; bitmap.undo(); update(); } },
    redo() { editor.cancel(); editor.commitSelection(); bitmap.redo(); },
    selectAll() { selectTool('select'); editor.makeSelection({ x: 0, y: 0, width: bitmap.width, height: bitmap.height }); editor.render(); update(); },
    deselect() { editor.commitSelection(); },
    delete() { editor.deleteSelection(); },
    crop() { editor.crop(); },
  };

  return actions;
}
