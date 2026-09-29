export function createTextTool({ bitmap, dialog, toast }) {
  async function addText(point, color) {
    const values = await dialog('Add text', `<label class="field">Your text<textarea name="text" rows="3" maxlength="4000" required placeholder="Hello, world!"></textarea></label><div class="field-row"><label class="field">Font<select name="font"><option value="Ubuntu">Ubuntu</option><option value="Arial">Arial</option><option value="Georgia">Georgia</option><option value="monospace">Monospace</option></select></label><label class="field">Size<input name="size" type="number" value="28" min="8" max="200" required /></label></div><label class="check-label"><input name="bold" type="checkbox" /> Bold</label>`, 'Place text');
    if (!values) return;
    const size = Number(values.get('size'));
    const font = `${values.get('bold') ? 'bold ' : ''}${size}px ${values.get('font')}`;
    try { await document.fonts.load(font, String(values.get('text'))); }
    catch { toast('The font could not be loaded. Please try again.'); return; }
    bitmap.ctx.save(); bitmap.ctx.font = font;
    bitmap.ctx.fillStyle = color; bitmap.ctx.textBaseline = 'top';
    String(values.get('text')).split('\n').forEach((line, i) => bitmap.ctx.fillText(line, point.x, point.y + i * size * 1.25));
    bitmap.ctx.restore(); bitmap.commit();
  }

  return addText;
}
