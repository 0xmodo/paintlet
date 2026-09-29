export function createImageActions({ bitmap, editor, dialog, fit }) {
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
  };

  return actions;
}
