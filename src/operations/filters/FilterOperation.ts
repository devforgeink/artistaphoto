import { BaseOperation } from '../base/Operation';
import { createCanvas, getContext2D } from '../../utils/canvas';
import { validateFilterIntensity } from '../../utils/validators';
import type { FilterParams } from '../../types';

export abstract class FilterOperation extends BaseOperation {
  readonly type = 'filter' as const;
  protected intensity: number;
  abstract readonly params: FilterParams;

  constructor(intensity: number = 1.0) {
    super();
    this.intensity = validateFilterIntensity(intensity);
  }

  async apply(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Promise<void> {
    const nativeFilter = this.getNativeFilter();

    if (nativeFilter && 'filter' in ctx) {
      this.applyNative(canvas, ctx, nativeFilter);
    } else {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.applyFilter(imageData.data, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
    }
  }

  protected getNativeFilter(): string | null {
    return null;
  }

  private applyNative(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, filterString: string): void {
    const tempCanvas = createCanvas(canvas.width, canvas.height);
    const tempCtx = getContext2D(tempCanvas);
    tempCtx.drawImage(canvas, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = filterString;
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.filter = 'none';
  }

  protected abstract applyFilter(
    data: Uint8ClampedArray,
    width: number,
    height: number
  ): void;
}
