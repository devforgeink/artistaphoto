import { describe, it, expect } from 'vitest';
import { CropOperation } from '../src/operations/crop/CropOperation';
import { createTestCanvas, fillCanvasRed } from './helpers';

describe('CropOperation', () => {
  it('crops canvas to specified dimensions', async () => {
    const canvas = createTestCanvas(200, 200);
    const ctx = canvas.getContext('2d')!;
    fillCanvasRed(canvas);

    const op = new CropOperation({ x: 10, y: 10, width: 50, height: 80 });
    await op.apply(canvas, ctx);

    expect(canvas.width).toBe(50);
    expect(canvas.height).toBe(80);
  });

  it('validate rejects negative coordinates', () => {
    const op = new CropOperation({ x: -1, y: 0, width: 10, height: 10 });
    expect(op.validate()).toBe(false);
  });

  it('validate rejects zero dimensions', () => {
    const op = new CropOperation({ x: 0, y: 0, width: 0, height: 10 });
    expect(op.validate()).toBe(false);
  });

  it('validate accepts valid params', () => {
    const op = new CropOperation({ x: 0, y: 0, width: 100, height: 100 });
    expect(op.validate()).toBe(true);
  });
});
