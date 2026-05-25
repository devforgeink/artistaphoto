class ImageDataMock {
  data: Uint8ClampedArray;
  width: number;
  height: number;
  colorSpace: string;

  constructor(sw: number, sh: number);
  constructor(data: Uint8ClampedArray, sw: number, sh?: number);
  constructor(swOrData: number | Uint8ClampedArray, shOrSw: number, maybeHeight?: number) {
    if (typeof swOrData === 'number') {
      this.width = swOrData;
      this.height = shOrSw;
      this.data = new Uint8ClampedArray(this.width * this.height * 4);
    } else {
      this.data = swOrData;
      this.width = shOrSw;
      this.height = maybeHeight ?? (swOrData.length / 4 / shOrSw);
    }
    this.colorSpace = 'srgb';
  }
}

class CanvasRenderingContext2DMock {
  canvas: HTMLCanvasElement;
  private _imageData: Uint8ClampedArray;
  private _width: number;
  private _height: number;
  private _fillStyle: string = '#000000';
  private _strokeStyle: string = '#000000';
  private _lineWidth: number = 1;
  private _font: string = '10px sans-serif';
  private _textAlign: string = 'start';
  private _textBaseline: string = 'alphabetic';
  private _globalAlpha: number = 1;
  private _shadowColor: string = 'rgba(0, 0, 0, 0)';
  private _shadowBlur: number = 0;
  private _shadowOffsetX: number = 0;
  private _shadowOffsetY: number = 0;
  private _imageSmoothingEnabled: boolean = true;
  private _imageSmoothingQuality: string = 'low';
  private _stateStack: any[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this._width = canvas.width;
    this._height = canvas.height;
    this._imageData = new Uint8ClampedArray(this._width * this._height * 4);
  }

  get fillStyle() { return this._fillStyle; }
  set fillStyle(v: string) { this._fillStyle = v; }
  get strokeStyle() { return this._strokeStyle; }
  set strokeStyle(v: string) { this._strokeStyle = v; }
  get lineWidth() { return this._lineWidth; }
  set lineWidth(v: number) { this._lineWidth = v; }
  get font() { return this._font; }
  set font(v: string) { this._font = v; }
  get textAlign() { return this._textAlign; }
  set textAlign(v: string) { this._textAlign = v; }
  get textBaseline() { return this._textBaseline; }
  set textBaseline(v: string) { this._textBaseline = v; }
  get globalAlpha() { return this._globalAlpha; }
  set globalAlpha(v: number) { this._globalAlpha = v; }
  get shadowColor() { return this._shadowColor; }
  set shadowColor(v: string) { this._shadowColor = v; }
  get shadowBlur() { return this._shadowBlur; }
  set shadowBlur(v: number) { this._shadowBlur = v; }
  get shadowOffsetX() { return this._shadowOffsetX; }
  set shadowOffsetX(v: number) { this._shadowOffsetX = v; }
  get shadowOffsetY() { return this._shadowOffsetY; }
  set shadowOffsetY(v: number) { this._shadowOffsetY = v; }
  get imageSmoothingEnabled() { return this._imageSmoothingEnabled; }
  set imageSmoothingEnabled(v: boolean) { this._imageSmoothingEnabled = v; }
  get imageSmoothingQuality() { return this._imageSmoothingQuality; }
  set imageSmoothingQuality(v: string) { this._imageSmoothingQuality = v; }

  private _syncSize() {
    const newLen = this.canvas.width * this.canvas.height * 4;
    if (this._imageData.length !== newLen) {
      const old = this._imageData;
      this._imageData = new Uint8ClampedArray(newLen);
      const copyLen = Math.min(old.length, newLen);
      this._imageData.set(old.subarray(0, copyLen));
      this._width = this.canvas.width;
      this._height = this.canvas.height;
    }
  }

  private _parseColor(color: string): [number, number, number, number] {
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      if (hex.length === 6) {
        return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16), 255];
      }
    }
    if (color.startsWith('rgba')) {
      const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (m) return [+m[1], +m[2], +m[3], m[4] ? Math.round(+m[4] * 255) : 255];
    }
    return [0, 0, 0, 255];
  }

  fillRect(x: number, y: number, w: number, h: number) {
    this._syncSize();
    const [r, g, b, a] = this._parseColor(this._fillStyle);
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    for (let py = Math.max(0, y); py < Math.min(ch, y + h); py++) {
      for (let px = Math.max(0, x); px < Math.min(cw, x + w); px++) {
        const i = (py * cw + px) * 4;
        this._imageData[i] = r;
        this._imageData[i + 1] = g;
        this._imageData[i + 2] = b;
        this._imageData[i + 3] = a;
      }
    }
  }

  clearRect(x: number, y: number, w: number, h: number) {
    this._syncSize();
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    for (let py = Math.max(0, y); py < Math.min(ch, y + h); py++) {
      for (let px = Math.max(0, x); px < Math.min(cw, x + w); px++) {
        const i = (py * cw + px) * 4;
        this._imageData[i] = 0;
        this._imageData[i + 1] = 0;
        this._imageData[i + 2] = 0;
        this._imageData[i + 3] = 0;
      }
    }
  }

  strokeRect(_x: number, _y: number, _w: number, _h: number) {}

  getImageData(sx: number, sy: number, sw: number, sh: number) {
    this._syncSize();
    const result = new Uint8ClampedArray(sw * sh * 4);
    const cw = this.canvas.width;
    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const srcIdx = ((sy + y) * cw + (sx + x)) * 4;
        const dstIdx = (y * sw + x) * 4;
        result[dstIdx] = this._imageData[srcIdx] ?? 0;
        result[dstIdx + 1] = this._imageData[srcIdx + 1] ?? 0;
        result[dstIdx + 2] = this._imageData[srcIdx + 2] ?? 0;
        result[dstIdx + 3] = this._imageData[srcIdx + 3] ?? 0;
      }
    }
    return new ImageDataMock(result, sw, sh) as unknown as ImageData;
  }

  putImageData(imageData: ImageData, dx: number, dy: number) {
    this._syncSize();
    const cw = this.canvas.width;
    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < imageData.width; x++) {
        const srcIdx = (y * imageData.width + x) * 4;
        const dstIdx = ((dy + y) * cw + (dx + x)) * 4;
        if (dstIdx >= 0 && dstIdx < this._imageData.length) {
          this._imageData[dstIdx] = imageData.data[srcIdx];
          this._imageData[dstIdx + 1] = imageData.data[srcIdx + 1];
          this._imageData[dstIdx + 2] = imageData.data[srcIdx + 2];
          this._imageData[dstIdx + 3] = imageData.data[srcIdx + 3];
        }
      }
    }
  }

  drawImage(source: any, dx: number, dy: number, dw?: number, dh?: number) {
    this._syncSize();
    if (source instanceof HTMLCanvasElement) {
      const srcCtx = (source as any).__ctx as CanvasRenderingContext2DMock | undefined;
      if (srcCtx) {
        const sw = source.width;
        const sh = source.height;
        const tw = dw ?? sw;
        const th = dh ?? sh;
        const cw = this.canvas.width;

        for (let y = 0; y < th; y++) {
          for (let x = 0; x < tw; x++) {
            const srcX = Math.floor(x * sw / tw);
            const srcY = Math.floor(y * sh / th);
            const srcIdx = (srcY * sw + srcX) * 4;
            const dstIdx = ((dy + y) * cw + (dx + x)) * 4;
            if (dstIdx >= 0 && dstIdx < this._imageData.length) {
              this._imageData[dstIdx] = srcCtx._imageData[srcIdx] ?? 0;
              this._imageData[dstIdx + 1] = srcCtx._imageData[srcIdx + 1] ?? 0;
              this._imageData[dstIdx + 2] = srcCtx._imageData[srcIdx + 2] ?? 0;
              this._imageData[dstIdx + 3] = srcCtx._imageData[srcIdx + 3] ?? 0;
            }
          }
        }
      }
    }
  }

  save() {
    this._stateStack.push({
      fillStyle: this._fillStyle,
      strokeStyle: this._strokeStyle,
      lineWidth: this._lineWidth,
      font: this._font,
      textAlign: this._textAlign,
      textBaseline: this._textBaseline,
      globalAlpha: this._globalAlpha,
    });
  }

  restore() {
    const state = this._stateStack.pop();
    if (state) {
      Object.assign(this, { _fillStyle: state.fillStyle, _strokeStyle: state.strokeStyle, _lineWidth: state.lineWidth, _font: state.font, _textAlign: state.textAlign, _textBaseline: state.textBaseline, _globalAlpha: state.globalAlpha });
    }
  }

  translate(_x: number, _y: number) {}
  rotate(_angle: number) {}
  scale(_x: number, _y: number) {}
  setTransform(_a: number, _b: number, _c: number, _d: number, _e: number, _f: number) {}
  beginPath() {}
  closePath() {}
  moveTo(_x: number, _y: number) {}
  lineTo(_x: number, _y: number) {}
  arc(_x: number, _y: number, _r: number, _s: number, _e: number) {}
  ellipse(_cx: number, _cy: number, _rx: number, _ry: number, _rot: number, _s: number, _e: number) {}
  fill() {}
  stroke() {}
  fillText(_text: string, _x: number, _y: number, _maxWidth?: number) {}
  strokeText(_text: string, _x: number, _y: number, _maxWidth?: number) {}
  measureText(_text: string) { return { width: 100 }; }

  toDataURL(_type?: string, _quality?: number) { return 'data:image/png;base64,'; }
  toBlob(cb: (blob: Blob | null) => void, _type?: string, _quality?: number) { cb(new Blob()); }
}

const origGetContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function (type: string, attrs?: any) {
  if (type === '2d') {
    if (!(this as any).__ctx) {
      (this as any).__ctx = new CanvasRenderingContext2DMock(this);
    }
    return (this as any).__ctx as any;
  }
  return origGetContext.call(this, type as any, attrs);
};

(globalThis as any).ImageData = ImageDataMock;
