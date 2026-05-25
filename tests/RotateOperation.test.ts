import { describe, it, expect } from 'vitest';
import { RotateOperation } from '../src/operations/rotate/RotateOperation';
import { createTestCanvas, fillCanvasRed } from './helpers';

describe('RotateOperation', () => {
  it('rotates 90 degrees swapping width and height', async () => {
    const canvas = createTestCanvas(200, 100);
    const ctx = canvas.getContext('2d')!;
    fillCanvasRed(canvas);

    const op = new RotateOperation(90);
    await op.apply(canvas, ctx);

    expect(canvas.width).toBe(100);
    expect(canvas.height).toBe(200);
  });

  it('rotates 180 degrees keeping same dimensions', async () => {
    const canvas = createTestCanvas(200, 100);
    const ctx = canvas.getContext('2d')!;
    fillCanvasRed(canvas);

    const op = new RotateOperation(180);
    await op.apply(canvas, ctx);

    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(100);
  });

  it('rotates 270 degrees swapping width and height', async () => {
    const canvas = createTestCanvas(200, 100);
    const ctx = canvas.getContext('2d')!;
    fillCanvasRed(canvas);

    const op = new RotateOperation(270);
    await op.apply(canvas, ctx);

    expect(canvas.width).toBe(100);
    expect(canvas.height).toBe(200);
  });

  it('0 degrees is a no-op', async () => {
    const canvas = createTestCanvas(200, 100);
    const ctx = canvas.getContext('2d')!;
    fillCanvasRed(canvas);

    const op = new RotateOperation(0);
    await op.apply(canvas, ctx);

    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(100);
  });

  it('normalizes negative angles', () => {
    const op = new RotateOperation(-90);
    expect(op.params.angle).toBe(270);
  });

  it('normalizes angles > 360', () => {
    const op = new RotateOperation(450);
    expect(op.params.angle).toBe(90);
  });

  it('validate accepts finite numbers', () => {
    expect(new RotateOperation(45).validate()).toBe(true);
  });
});
