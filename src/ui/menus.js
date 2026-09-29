export function bindMenus() {
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

  return { closeMenus };
}
