import { BaseOperation } from '../base/Operation';
import type { ImageOverlayOptions, ImageOverlayParams } from '../../types';

export class ImageOverlayOperation extends BaseOperation {
  readonly type = 'imageOverlay' as const;
  readonly params: ImageOverlayParams;

  constructor(options: ImageOverlayOptions) {
    super();

    const sourceWidth = options.image instanceof HTMLCanvasElement
      ? options.image.width
      : options.image.naturalWidth || options.image.width;
    const sourceHeight = options.image instanceof HTMLCanvasElement
      ? options.image.height
      : options.image.naturalHeight || options.image.height;

    this.params = {
      image: options.image,
      x: options.x,
      y: options.y,
      width: options.width ?? sourceWidth,
      height: options.height ?? sourceHeight,
      opacity: Math.max(0, Math.min(1, options.opacity ?? 1)),
      rotation: options.rotation ?? 0,
    };
  }

  async apply(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Promise<void> {
    const { image, x, y, width, height, opacity, rotation } = this.params;

    ctx.save();
    ctx.globalAlpha = opacity;

    if (rotation !== 0) {
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(image, -width / 2, -height / 2, width, height);
    } else {
      ctx.drawImage(image, x, y, width, height);
    }

    ctx.restore();
  }

  validate(): boolean {
    return (
      this.params.image != null &&
      this.params.width > 0 &&
      this.params.height > 0 &&
      this.params.opacity >= 0 &&
      this.params.opacity <= 1
    );
  }
}
