export function createFileActions({ $, bitmap, editor, state, dialog, toast, fit, update }) {
  async function allowDiscard() {
    editor.commitSelection();
    return !bitmap.dirty || Boolean(await dialog('Unsaved picture', '<p>Your picture has unsaved changes.</p><p>Save it as a PNG first if you want to keep it.</p>', 'Discard changes'));
  }
  async function openFile(file) {
    if (!file) return;
    if (!/^image\/(png|jpeg|webp|gif|bmp|x-ms-bmp)$/.test(file.type)) { toast('Please choose a PNG, JPEG, WebP, GIF or BMP image.'); return; }
    if (file.size > 32 * 1024 * 1024) { toast('Please choose an image smaller than 32 MB.'); return; }
    if (!await allowDiscard()) return;
    try {
      const image = await createImageBitmap(file);
      if (image.width > 4096 || image.height > 4096) { image.close(); toast('Maximum image size is 4096 × 4096 pixels.'); return; }
      state.filename = file.name.replace(/\.[^.]+$/, ''); bitmap.reset(image.width, image.height, image); image.close(); fit(); toast('Image opened. Make it your own.');
    } catch { toast('This image could not be opened. Try another file.'); }
  }
  $('#file-input').addEventListener('change', event => { openFile(event.target.files[0]); event.target.value = ''; });
  const workspace = $('.drawing-area');
  workspace.addEventListener('dragover', event => { event.preventDefault(); workspace.classList.add('drop-target'); });
  workspace.addEventListener('dragleave', event => { if (!workspace.contains(event.relatedTarget)) workspace.classList.remove('drop-target'); });
  workspace.addEventListener('drop', event => { event.preventDefault(); workspace.classList.remove('drop-target'); openFile(event.dataTransfer.files[0]); });

  const actions = {
    async new() { if (await allowDiscard()) { state.filename = 'Untitled'; bitmap.reset(960, 640); fit(); toast('A fresh start.'); } },
    open() { $('#file-input').click(); },
    save() {
      editor.cancel(); editor.commitSelection();
      const frame = bitmap.history[bitmap.index];
      bitmap.canvas.toBlob(blob => {
        if (!blob) { toast('Could not export the picture.'); return; }
        const url = URL.createObjectURL(blob), link = document.createElement('a');
        link.href = url; link.download = `${state.filename === 'Untitled' ? 'my-picture' : state.filename}.png`; link.click();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        bitmap.saved = frame; update(); toast('Your PNG is ready.');
      }, 'image/png');
    },
  };

  return actions;
}
