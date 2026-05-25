import { describe, it, expect } from 'vitest';
import { ResizeOperation } from '../src/operations/resize/ResizeOperation';
import { createTestCanvas, fillCanvasRed } from './helpers';

describe('ResizeOperation', () => {
  it('resizes canvas to exact dimensions when aspect ratio disabled', async () => {
    const canvas = createTestCanvas(200, 100);
    const ctx = canvas.getContext('2d')!;
    fillCanvasRed(canvas);

    const op = new ResizeOperation(50, 50, { maintainAspectRatio: false });
    await op.apply(canvas, ctx);

    expect(canvas.width).toBe(50);
    expect(canvas.height).toBe(50);
  });

  it('maintains aspect ratio fitting to width', async () => {
    const canvas = createTestCanvas(200, 100);
    const ctx = canvas.getContext('2d')!;
    fillCanvasRed(canvas);

    const op = new ResizeOperation(100, 100, { maintainAspectRatio: true });
    await op.apply(canvas, ctx);

    expect(canvas.width).toBe(100);
    expect(canvas.height).toBe(50);
  });

  it('maintains aspect ratio fitting to height', async () => {
    const canvas = createTestCanvas(100, 200);
    const ctx = canvas.getContext('2d')!;
    fillCanvasRed(canvas);

    const op = new ResizeOperation(100, 100, { maintainAspectRatio: true });
    await op.apply(canvas, ctx);

    expect(canvas.width).toBe(50);
    expect(canvas.height).toBe(100);
  });

  it('defaults to maintainAspectRatio true', () => {
    const op = new ResizeOperation(100, 100);
    expect(op.params.maintainAspectRatio).toBe(true);
  });

  it('validate rejects zero dimensions', () => {
    const op = new ResizeOperation(0, 100);
    expect(op.validate()).toBe(false);
  });
});
