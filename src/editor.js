export class Editor {
  constructor(canvas, bitmap, onStatus, onText) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.bitmap = bitmap;
    this.status = onStatus;
    this.onText = onText;
    this.tool = 'pencil';
    this.foreground = '#202020';
    this.background = '#ffffff';
    this.size = 3;
    this.shapeStyle = 'outline';
    this.zoom = 1;
    this.selection = null;
    this.gesture = null;
    bitmap.addEventListener('change', () => this.render());
    canvas.addEventListener('pointerdown', event => this.down(event));
    canvas.addEventListener('pointermove', event => this.move(event));
    canvas.addEventListener('pointerup', event => this.up(event));
    canvas.addEventListener('pointercancel', () => this.cancel());
    canvas.addEventListener('lostpointercapture', () => { if (this.gesture) this.cancel(); });
    canvas.addEventListener('contextmenu', event => event.preventDefault());
    this.render();
  }

  point(event) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * this.bitmap.width / rect.width,
      y: (event.clientY - rect.top) * this.bitmap.height / rect.height };
  }

  setTool(tool) {
    this.cancel();
    this.commitSelection();
    this.tool = tool;
    this.canvas.style.cursor = tool === 'text' ? 'text' : 'crosshair';
    this.render();
  }

  setZoom(zoom) { this.zoom = zoom; this.render(); }
  render() {
    const { canvas, ctx, bitmap } = this;
    if (canvas.width !== bitmap.width || canvas.height !== bitmap.height) {
      canvas.width = bitmap.width; canvas.height = bitmap.height;
    }
    canvas.style.width = `${bitmap.width * this.zoom}px`;
    canvas.style.height = `${bitmap.height * this.zoom}px`;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap.canvas, 0, 0);
    if (this.selection) {
      const s = this.selection;
      if (s.floating) {
        ctx.fillStyle = s.background;
        ctx.fillRect(s.originX, s.originY, s.width, s.height);
        ctx.drawImage(s.image, s.x, s.y);
      }
      this.outline(s.x, s.y, s.width, s.height);
    }
    if (this.gesture?.kind === 'select') {
      const { start, last } = this.gesture;
      const r = this.rectangle(start, last);
      this.outline(r.x, r.y, r.width, r.height);
    }
  }

  outline(x, y, width, height) {
    const { ctx } = this;
    ctx.save();
    ctx.lineWidth = 1 / this.zoom;
    ctx.strokeStyle = '#ffffff'; ctx.strokeRect(x, y, width, height);
    ctx.setLineDash([4 / this.zoom, 4 / this.zoom]);
    ctx.strokeStyle = '#172b4d'; ctx.strokeRect(x, y, width, height);
    ctx.restore();
  }

  rectangle(a, b) {
    const x = Math.max(0, Math.floor(Math.min(a.x, b.x)));
    const y = Math.max(0, Math.floor(Math.min(a.y, b.y)));
    return { x, y, width: Math.max(0, Math.min(this.bitmap.width, Math.ceil(Math.max(a.x, b.x))) - x),
      height: Math.max(0, Math.min(this.bitmap.height, Math.ceil(Math.max(a.y, b.y))) - y) };
  }

  down(event) {
    if (this.gesture || (event.button !== 0 && event.button !== 2)) return;
    event.preventDefault();
    const point = this.point(event);
    const color = event.button === 2 ? this.background : this.foreground;
    if (this.tool === 'select' && this.selection) {
      const s = this.selection;
      if (point.x >= s.x && point.x < s.x + s.width && point.y >= s.y && point.y < s.y + s.height) {
        this.gesture = { kind: 'move', start: point, x: s.x, y: s.y, wasFloating: s.floating };
        this.canvas.setPointerCapture(event.pointerId);
        return;
      }
    }
    this.commitSelection();
    if (this.tool === 'fill') { this.bitmap.fill(point.x, point.y, color); return; }
    if (this.tool === 'picker') {
      const pixel = this.bitmap.ctx.getImageData(Math.floor(point.x), Math.floor(point.y), 1, 1).data;
      const picked = '#' + [...pixel.slice(0, 3)].map(value => value.toString(16).padStart(2, '0')).join('');
      this.dispatchColor(picked, event.button === 2);
      return;
    }
    if (this.tool === 'text') { this.onText(point, color); return; }
    this.canvas.setPointerCapture(event.pointerId);
    const kind = this.tool === 'select' ? 'select' : ['line', 'rect', 'ellipse', 'round'].includes(this.tool) ? 'shape' : 'stroke';
    this.gesture = { kind, start: point, last: point, color, baseline: this.bitmap.snapshot() };
    if (kind === 'stroke') {
      this.stroke(point, point, color);
      if (this.tool === 'spray') this.sprayTimer = setInterval(() => {
        if (this.gesture) { this.stroke(this.gesture.last, this.gesture.last, color); this.render(); }
      }, 40);
    }
    this.render();
  }

  dispatchColor(color, background) {
    this.canvas.dispatchEvent(new CustomEvent('pickcolor', { detail: { color, background } }));
  }

  move(event) {
    const point = this.point(event);
    this.status(point);
    const g = this.gesture;
    if (!g) return;
    if (g.kind === 'move') {
      this.selection.x = Math.round(g.x + point.x - g.start.x);
      this.selection.y = Math.round(g.y + point.y - g.start.y);
      this.selection.floating = true;
    } else if (g.kind === 'stroke') {
      const events = event.getCoalescedEvents?.() || [];
      for (const item of events.length ? events : [event]) {
        const p = this.point(item);
        this.stroke(g.last, p, g.color); g.last = p;
      }
    } else if (g.kind === 'shape') {
      this.bitmap.restore(g.baseline);
      this.shape(g.start, point, g.color, event.shiftKey);
    }
    g.last = point;
    this.render();
  }

  up(event) {
    if (!this.gesture) return;
    this.move(event);
    const g = this.gesture;
    clearInterval(this.sprayTimer);
    this.gesture = null;
    if (g.kind === 'select') {
      const rect = this.rectangle(g.start, g.last);
      if (rect.width && rect.height) this.makeSelection(rect);
    } else if (g.kind !== 'move') this.bitmap.commit();
    this.render();
    this.canvas.dispatchEvent(new Event('selectionchange'));
  }

  cancel() {
    clearInterval(this.sprayTimer);
    const g = this.gesture;
    this.gesture = null;
    if (g?.baseline) this.bitmap.restore(g.baseline);
    if (g?.kind === 'move' && this.selection) {
      this.selection.x = g.x; this.selection.y = g.y; this.selection.floating = g.wasFloating;
    }
    this.render();
  }

  stroke(a, b, color) {
    const { ctx } = this.bitmap;
    ctx.save();
    const size = this.tool === 'eraser' ? this.size * 4 : this.tool === 'brush' ? this.size * 2 : this.size;
    ctx.fillStyle = ctx.strokeStyle = this.tool === 'eraser' ? this.background : color;
    if (this.tool === 'spray') {
      const radius = this.size * 3;
      for (let i = 0; i < 14; i++) {
        const angle = Math.random() * Math.PI * 2, distance = Math.sqrt(Math.random()) * radius;
        ctx.fillRect(Math.round(b.x + Math.cos(angle) * distance), Math.round(b.y + Math.sin(angle) * distance), 1, 1);
      }
    } else {
      ctx.lineWidth = size; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      if (a.x === b.x && a.y === b.y) { ctx.beginPath(); ctx.arc(a.x, a.y, size / 2, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.restore();
  }

  shape(a, b, color, constrain) {
    const { ctx } = this.bitmap;
    let dx = b.x - a.x, dy = b.y - a.y;
    if (constrain) {
      if (this.tool === 'line') {
        const angle = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * Math.PI / 4;
        const length = Math.hypot(dx, dy); dx = Math.cos(angle) * length; dy = Math.sin(angle) * length;
      } else { const size = Math.max(Math.abs(dx), Math.abs(dy)); dx = Math.sign(dx || 1) * size; dy = Math.sign(dy || 1) * size; }
    }
    const x = Math.min(a.x, a.x + dx), y = Math.min(a.y, a.y + dy), w = Math.abs(dx), h = Math.abs(dy);
    ctx.save(); ctx.lineWidth = this.size; ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.fillStyle = this.shapeStyle === 'solid' ? color : this.background;
    ctx.beginPath();
    if (this.tool === 'line') { ctx.moveTo(a.x, a.y); ctx.lineTo(a.x + dx, a.y + dy); }
    else if (this.tool === 'ellipse') ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    else if (this.tool === 'round') ctx.roundRect(x, y, w, h, Math.min(16, w / 4, h / 4));
    else ctx.rect(x, y, w, h);
    if (this.tool !== 'line' && this.shapeStyle !== 'outline') ctx.fill();
    if (this.shapeStyle !== 'solid' || this.tool === 'line') ctx.stroke();
    ctx.restore();
  }

  makeSelection(rect) {
    const image = document.createElement('canvas');
    image.width = rect.width; image.height = rect.height;
    image.getContext('2d').drawImage(this.bitmap.canvas, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
    this.selection = { ...rect, originX: rect.x, originY: rect.y, image, floating: false, background: this.background };
  }

  commitSelection() {
    const s = this.selection;
    this.selection = null;
    if (s?.floating) {
      this.bitmap.ctx.fillStyle = s.background;
      this.bitmap.ctx.fillRect(s.originX, s.originY, s.width, s.height);
      this.bitmap.ctx.drawImage(s.image, s.x, s.y);
      this.bitmap.commit();
    }
    this.render();
    this.canvas.dispatchEvent(new Event('selectionchange'));
  }

  deleteSelection() {
    const s = this.selection;
    if (!s) return;
    this.selection = null;
    this.bitmap.ctx.fillStyle = s.background;
    this.bitmap.ctx.fillRect(s.originX, s.originY, s.width, s.height);
    this.bitmap.commit();
    this.canvas.dispatchEvent(new Event('selectionchange'));
  }

  crop() {
    const s = this.selection;
    if (!s) return;
    this.selection = null;
    this.bitmap.canvas.width = s.width; this.bitmap.canvas.height = s.height;
    this.bitmap.ctx.drawImage(s.image, 0, 0);
    this.bitmap.commit();
    this.canvas.dispatchEvent(new Event('selectionchange'));
  }
}
