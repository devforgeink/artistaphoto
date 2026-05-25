import { FilterOperation } from './FilterOperation';
import type { FilterParams } from '../../types';

export class GrayscaleFilter extends FilterOperation {
  readonly params: FilterParams;

  constructor(intensity: number = 1.0) {
    super(intensity);
    this.params = { filterType: 'grayscale', intensity: this.intensity };
  }

  protected getNativeFilter(): string {
    return `grayscale(${this.intensity})`;
  }

  protected applyFilter(data: Uint8ClampedArray): void {
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      data[i] = data[i] * (1 - this.intensity) + gray * this.intensity;
      data[i + 1] = data[i + 1] * (1 - this.intensity) + gray * this.intensity;
      data[i + 2] = data[i + 2] * (1 - this.intensity) + gray * this.intensity;
    }
  }
}
