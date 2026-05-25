import { BaseOperation } from '../base/Operation';
import { createCanvas, getContext2D } from '../../utils/canvas';
import type { ResizeParams, ResizeOptions } from '../../types';

export class ResizeOperation extends BaseOperation {
  readonly type = 'resize' as const;
  readonly params: ResizeParams;

  constructor(width: number, height: number, options?: ResizeOptions) {
    super();
    this.params = {
      width,
      height,
      quality: options?.quality || 'high',
      maintainAspectRatio: options?.maintainAspectRatio ?? true,
    };
  }

  async apply(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Promise<void> {
    const { width, height, quality, maintainAspectRatio } = this.params;

    // Store current image
    const currentImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const tempCanvas = createCanvas(canvas.width, canvas.height);
    const tempCtx = getContext2D(tempCanvas);
    tempCtx.putImageData(currentImage, 0, 0);

    let finalWidth = width;
    let finalHeight = height;

    if (maintainAspectRatio) {
      const srcRatio = canvas.width / canvas.height;
      const dstRatio = width / height;

      if (srcRatio > dstRatio) {
        finalHeight = Math.round(width / srcRatio);
      } else {
        finalWidth = Math.round(height * srcRatio);
      }
    }

    // Resize canvas
    canvas.width = finalWidth;
    canvas.height = finalHeight;

    // Set image smoothing based on quality
    ctx.imageSmoothingEnabled = quality === 'high' || quality === 'medium';
    ctx.imageSmoothingQuality = quality === 'high' ? 'high' : quality === 'medium' ? 'medium' : 'low';

    // Draw resized image
    ctx.drawImage(tempCanvas, 0, 0, finalWidth, finalHeight);
  }

  validate(): boolean {
    const { width, height } = this.params;
    return width > 0 && height > 0;
  }
}
