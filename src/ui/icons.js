const paths = {
  pencil: '<path d="m4 16 1-5L15 1l4 4L9 15z"/><path d="m12 4 4 4M5 11l4 4M4 16l4-1"/>',
  brush: '<path d="m9 11 7-9 3 3-9 8"/><path d="M10 13c-4-4-6 2-6 2s0 2-3 3c7 2 11-1 9-5Z"/>',
  eraser: '<path d="m3 11 8-9 7 6-8 9H8z"/><path d="m7 7 7 6M10 17h8"/>',
  fill: '<path d="m4 8 6-6 8 8-7 7-8-8z"/><path d="M5 1v7M3 9h13M18 13s-4 4-1 5c3 1 3-2 1-5Z"/>',
  picker: '<path d="m12 3 5 5M14 1l5 5M13 5l-9 9-1 4 4-1 9-9"/>',
  spray: '<path d="M4 9h7v9H4zM6 6h3v3M8 6V4h4"/><path d="M15 3h.1M18 2h.1M16 6h.1M19 5h.1M18 8h.1"/>',
  text: '<path d="M3 17 10 2l7 15M6 11h8M1 17h5M14 17h5"/>',
  line: '<path d="m3 17 14-14"/>',
  rect: '<rect x="3" y="4" width="14" height="12"/>',
  ellipse: '<ellipse cx="10" cy="10" rx="8" ry="6"/>',
  round: '<rect x="3" y="4" width="14" height="12" rx="3"/>',
  select: '<path stroke-dasharray="2 2" d="M2 3h16v14H2z"/>',
  undo: '<path d="M7 4 2 8l5 4M3 8h9a5 5 0 0 1 0 10"/>',
  redo: '<path d="m13 4 5 4-5 4M17 8H8a5 5 0 0 0 0 10"/>',
  open: '<path d="M2 7V3h6l2 3h8v3M2 7h17l-3 10H1z"/>',
  save: '<path d="M3 2h12l3 3v13H2V2z"/><path d="M6 2v6h8V2M5 18v-7h10v7M11 3v3"/>',
  new: '<path d="M4 2h8l5 5v11H4zM12 2v5h5"/>',
  crop: '<path d="M5 1v14h14M1 5h14v14M9 5h6v6"/>',
  image: '<rect x="2" y="3" width="16" height="14"/><circle cx="7" cy="7" r="1"/><path d="m2 14 5-5 4 5 3-3 4 4"/>',
  chevron: '<path d="m7 4 6 6-6 6"/>',
  palette: '<path d="M10 2C5 2 1 5 1 10s5 9 9 8c3-1-1-3 1-5s6 1 7-2c2-5-3-9-8-9Z"/><circle cx="5" cy="8" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="14" cy="6" r="1"/>',
};
export function icon(name) {
  return `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.image}</svg>`;
}
