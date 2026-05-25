import { createCanvas, getContext2D } from '../utils/canvas';
import type { ImageState } from './ImageState';
import type { Operation } from '../operations/base/Operation';

export class ImageProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cachedImageData: ImageData | null = null;
  private cachedOps: ReadonlyArray<Operation> = [];

  constructor() {
    this.canvas = createCanvas(1, 1);
    this.ctx = getContext2D(this.canvas);
  }

  async execute(
    state: ImageState,
    operations: ReadonlyArray<Operation>
  ): Promise<HTMLCanvasElement> {
    let startIndex = 0;

    if (this.cachedImageData && this.cachedOps.length <= operations.length) {
      const isPrefix = this.cachedOps.every((op, i) => operations[i] === op);
      if (isPrefix && this.cachedOps.length > 0) {
        startIndex = this.cachedOps.length;
        this.canvas.width = this.cachedImageData.width;
        this.canvas.height = this.cachedImageData.height;
        this.ctx.putImageData(this.cachedImageData, 0, 0);
      }
    }

    if (startIndex === 0) {
      this.canvas.width = state.width;
      this.canvas.height = state.height;
      this.ctx.drawImage(state.originalImage, 0, 0);
    }

    for (let i = startIndex; i < operations.length; i++) {
      await operations[i].apply(this.canvas, this.ctx);
    }

    this.cachedImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.cachedOps = operations.slice();

    return this.canvas;
  }

  invalidateCache(): void {
    this.cachedImageData = null;
    this.cachedOps = [];
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
}
