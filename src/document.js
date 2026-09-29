// The bitmap is independent of the viewport, zoom level and UI.
export class PaintDocument extends EventTarget {
  constructor(width = 960, height = 640) {
    super();
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.history = [];
    this.index = -1;
    this.saved = null;
    this.reset(width, height);
  }

  notify() { this.dispatchEvent(new Event('change')); }
  get width() { return this.canvas.width; }
  get height() { return this.canvas.height; }
  get dirty() { return this.history[this.index] !== this.saved; }
  get canUndo() { return this.index > 0; }
  get canRedo() { return this.index < this.history.length - 1; }
  snapshot() { return this.ctx.getImageData(0, 0, this.width, this.height); }

  reset(width, height, image) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, width, height);
    if (image) this.ctx.drawImage(image, 0, 0);
    this.history = [this.snapshot()];
    this.index = 0;
    this.saved = this.history[0];
    this.notify();
  }

  restore(snapshot) {
    if (this.width !== snapshot.width || this.height !== snapshot.height) {
      this.canvas.width = snapshot.width;
      this.canvas.height = snapshot.height;
    }
    this.ctx.putImageData(snapshot, 0, 0);
  }

  commit() {
    this.history.splice(this.index + 1);
    this.history.push(this.snapshot());
    let bytes = this.history.reduce((sum, frame) => sum + frame.data.byteLength, 0);
    while (this.history.length > 2 && (bytes > 64 * 1024 * 1024 || this.history.length > 40)) {
      bytes -= this.history.shift().data.byteLength;
    }
    this.index = this.history.length - 1;
    this.notify();
  }

  undo() {
    if (!this.canUndo) return;
    this.restore(this.history[--this.index]);
    this.notify();
  }
  redo() {
    if (!this.canRedo) return;
    this.restore(this.history[++this.index]);
    this.notify();
  }

  resize(width, height) {
    const old = document.createElement('canvas');
    old.width = this.width; old.height = this.height;
    old.getContext('2d').drawImage(this.canvas, 0, 0);
    this.canvas.width = width; this.canvas.height = height;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, width, height);
    this.ctx.drawImage(old, 0, 0);
    this.commit();
  }

  fill(x, y, color) {
    x = Math.floor(x); y = Math.floor(y);
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return false;
    const image = this.snapshot();
    const pixels = new Uint32Array(image.data.buffer);
    const sample = document.createElement('canvas').getContext('2d');
    sample.fillStyle = color; sample.fillRect(0, 0, 1, 1);
    const replacement = new Uint32Array(sample.getImageData(0, 0, 1, 1).data.buffer)[0];
    const target = pixels[y * this.width + x];
    if (target === replacement) return false;
    const stack = [x, y];
    while (stack.length) {
      const sy = stack.pop();
      let sx = stack.pop();
      while (sx > 0 && pixels[sy * this.width + sx - 1] === target) sx--;
      let above = false, below = false;
      for (; sx < this.width && pixels[sy * this.width + sx] === target; sx++) {
        pixels[sy * this.width + sx] = replacement;
        if (sy > 0) {
          const match = pixels[(sy - 1) * this.width + sx] === target;
          if (match && !above) stack.push(sx, sy - 1);
          above = match;
        }
        if (sy + 1 < this.height) {
          const match = pixels[(sy + 1) * this.width + sx] === target;
          if (match && !below) stack.push(sx, sy + 1);
          below = match;
        }
      }
    }
    this.ctx.putImageData(image, 0, 0);
    this.commit();
    return true;
  }
}
