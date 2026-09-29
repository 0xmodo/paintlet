export const tools = [
  ['select', 'Select', 'S', 'Drag to select. Drag inside to move; Delete to erase.'],
  ['eraser', 'Eraser', 'E', 'Drag to erase using the background color.'],
  ['fill', 'Fill with color', 'F', 'Click a connected area to fill it.'],
  ['picker', 'Pick color', 'I', 'Click a pixel to sample its color.'],
  ['pencil', 'Pencil', 'P', 'Draw freely. Right-click to use the background color.'],
  ['brush', 'Brush', 'B', 'Paint a smooth, round brush stroke.'],
  ['spray', 'Airbrush', 'A', 'Hold to spray a fine mist of color.'],
  ['text', 'Text', 'T', 'Click where you want to add text.'],
  ['line', 'Line', 'L', 'Drag a line. Hold Shift to snap its angle.'],
  ['rect', 'Rectangle', 'R', 'Drag a rectangle. Hold Shift for a square.'],
  ['ellipse', 'Ellipse', 'O', 'Drag an ellipse. Hold Shift for a circle.'],
  ['round', 'Rounded rectangle', 'U', 'Drag a rounded rectangle. Hold Shift for a square.'],
];
export const colors = ['#000000','#808080','#800000','#808000','#008000','#008080','#000080','#800080','#808040','#004040','#0080ff','#004080','#8000ff','#804000',
  '#ffffff','#c0c0c0','#ff0000','#ffff00','#00ff00','#00ffff','#0000ff','#ff00ff','#ffff80','#00ff80','#80ffff','#8080ff','#ff0080','#ff8040'];
export const menus = {
  File: [['new', 'New', 'Ctrl+N'], ['open', 'Open…', 'Ctrl+O'], ['save', 'Save as PNG', 'Ctrl+S']],
  Edit: [['undo', 'Undo', 'Ctrl+Z'], ['redo', 'Redo', 'Ctrl+Y'], null, ['selectAll', 'Select all', 'Ctrl+A'], ['deselect', 'Deselect', 'Esc'], ['delete', 'Delete selection', 'Del']],
  View: [['zoomIn', 'Zoom in', '+'], ['zoomOut', 'Zoom out', '−'], ['actual', 'Actual size', '100%'], ['fit', 'Fit to window', '']],
  Image: [['crop', 'Crop to selection', ''], ['resize', 'Canvas size…', ''], null, ['flipH', 'Flip horizontally', ''], ['flipV', 'Flip vertically', ''], ['rotate', 'Rotate 90° clockwise', ''], ['invert', 'Invert colors', ''], ['clear', 'Clear image', '']],
  Colors: [['customColor', 'Edit foreground color…', ''], ['backgroundColor', 'Edit background color…', ''], ['swap', 'Swap colors', 'X']],
  Help: [['help', 'Quick guide', '?'], ['about', 'About Paintlet', '']],
};

export const zoomLevels = [25, 50, 75, 100, 125, 150, 200, 300, 400];
