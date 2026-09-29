import { icon } from './icons.js';

export function createHelpActions({ dialog }) {
  const actions = {
    help() { return dialog('A quick guide', `<div class="guide"><p><strong>Make your mark.</strong> Choose a tool on the left and draw on the white canvas.</p><p><strong>Make it yours.</strong> Click a swatch for your foreground color, or right-click for the background. Press X to swap them.</p><p><strong>Keep experimenting.</strong> Ctrl/⌘+Z undoes a step. Ctrl/⌘+Shift+Z redoes it. Hold Shift for straight lines and perfect shapes.</p><p><strong>Move things around.</strong> Use Select to draw a box, then drag inside it. Crop keeps only the selected area.</p><p><strong>Take it with you.</strong> Open an image or drop one onto the canvas. Ctrl/⌘+S saves a PNG. Pictures stay in your browser and are not uploaded.</p><p class="muted">Tool shortcuts: S select · P pencil · B brush · E eraser · F fill · I picker · T text · L line · R rectangle · O ellipse.</p></div>`); },
    about() { return dialog('About Paintlet', `<div class="about-icon">${icon('palette')}</div><h2>A familiar place to create.</h2><p>A browser-based tribute to classic Windows Paint.<br>A blank canvas, a handful of tools, and you.</p><p class="muted">An independent project by 0xmodo.<br>Not affiliated with Microsoft.</p><p class="muted">Your images are processed locally. Save your work before closing the tab.</p>`); },
  };

  return actions;
}
