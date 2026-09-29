export function createDialogs({ $, editor, closeMenus }) {
  let toastTimer;
  function toast(message) {
    clearTimeout(toastTimer);
    $('#toast').textContent = message; $('#toast').hidden = false;
    toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 2800);
  }
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

  return { dialog, toast };
}
