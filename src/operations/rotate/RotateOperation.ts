import { BaseOperation } from '../base/Operation';
import { createCanvas, getContext2D } from '../../utils/canvas';
import type { RotateParams } from '../../types';

export class RotateOperation extends BaseOperation {
  readonly type = 'rotate' as const;
  readonly params: RotateParams;

  constructor(angle: number) {
    super();
    this.params = { angle: ((angle % 360) + 360) % 360 };
  }

  async apply(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Promise<void> {
    const { angle } = this.params;
    if (angle === 0) return;

    const currentImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const tempCanvas = createCanvas(canvas.width, canvas.height);
    const tempCtx = getContext2D(tempCanvas);
    tempCtx.putImageData(currentImage, 0, 0);

    const radians = (angle * Math.PI) / 180;
    const sin = Math.abs(Math.sin(radians));
    const cos = Math.abs(Math.cos(radians));

    const newWidth = Math.round(canvas.width * cos + canvas.height * sin);
    const newHeight = Math.round(canvas.width * sin + canvas.height * cos);

    canvas.width = newWidth;
    canvas.height = newHeight;

    ctx.translate(newWidth / 2, newHeight / 2);
    ctx.rotate(radians);
    ctx.drawImage(tempCanvas, -tempCanvas.width / 2, -tempCanvas.height / 2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  validate(): boolean {
    return typeof this.params.angle === 'number' && isFinite(this.params.angle);
  }
}
