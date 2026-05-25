import { BaseOperation } from '../base/Operation';
import { createCanvas, getContext2D } from '../../utils/canvas';
import type { FlipDirection, FlipParams } from '../../types';

export class FlipOperation extends BaseOperation {
  readonly type = 'flip' as const;
  readonly params: FlipParams;

  constructor(direction: FlipDirection) {
    super();
    this.params = { direction };
  }

  async apply(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Promise<void> {
    const currentImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const tempCanvas = createCanvas(canvas.width, canvas.height);
    const tempCtx = getContext2D(tempCanvas);
    tempCtx.putImageData(currentImage, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.params.direction === 'horizontal') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);
    }

    ctx.drawImage(tempCanvas, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  validate(): boolean {
    return this.params.direction === 'horizontal' || this.params.direction === 'vertical';
  }
}
