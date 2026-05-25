import { describe, it, expect } from 'vitest';
import { ImageOverlayOperation } from '../src/operations/imageOverlay/ImageOverlayOperation';
import { createTestCanvas, fillCanvasRed } from './helpers';

function createOverlayCanvas(width = 50, height = 50, color = '#0000ff'): HTMLCanvasElement {
  const canvas = createTestCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  return canvas;
}

describe('ImageOverlayOperation', () => {
  it('overlays image at specified position', async () => {
    const canvas = createTestCanvas(200, 200);
    const ctx = canvas.getContext('2d')!;
    fillCanvasRed(canvas);

    const overlay = createOverlayCanvas(50, 50);
    const op = new ImageOverlayOperation({ image: overlay, x: 10, y: 10 });
    await op.apply(canvas, ctx);

    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(200);
  });

  it('defaults to source dimensions when width/height not specified', () => {
    const overlay = createOverlayCanvas(80, 60);
    const op = new ImageOverlayOperation({ image: overlay, x: 0, y: 0 });

    expect(op.params.width).toBe(80);
    expect(op.params.height).toBe(60);
  });

  it('uses custom width and height', () => {
    const overlay = createOverlayCanvas(80, 60);
    const op = new ImageOverlayOperation({ image: overlay, x: 0, y: 0, width: 40, height: 30 });

    expect(op.params.width).toBe(40);
    expect(op.params.height).toBe(30);
  });

  it('clamps opacity to 0-1', () => {
    const overlay = createOverlayCanvas();
    const op1 = new ImageOverlayOperation({ image: overlay, x: 0, y: 0, opacity: 1.5 });
    expect(op1.params.opacity).toBe(1);

    const op2 = new ImageOverlayOperation({ image: overlay, x: 0, y: 0, opacity: -0.5 });
    expect(op2.params.opacity).toBe(0);
  });

  it('defaults opacity to 1 and rotation to 0', () => {
    const overlay = createOverlayCanvas();
    const op = new ImageOverlayOperation({ image: overlay, x: 0, y: 0 });

    expect(op.params.opacity).toBe(1);
    expect(op.params.rotation).toBe(0);
  });

  it('applies with rotation without error', async () => {
    const canvas = createTestCanvas(200, 200);
    const ctx = canvas.getContext('2d')!;
    fillCanvasRed(canvas);

    const overlay = createOverlayCanvas(50, 50);
    const op = new ImageOverlayOperation({ image: overlay, x: 50, y: 50, rotation: 45 });
    await op.apply(canvas, ctx);

    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(200);
  });

  it('has correct type', () => {
    const overlay = createOverlayCanvas();
    const op = new ImageOverlayOperation({ image: overlay, x: 0, y: 0 });
    expect(op.type).toBe('imageOverlay');
  });

  it('validate accepts valid params', () => {
    const overlay = createOverlayCanvas();
    const op = new ImageOverlayOperation({ image: overlay, x: 0, y: 0 });
    expect(op.validate()).toBe(true);
  });

  it('validate rejects zero dimensions', () => {
    const overlay = createOverlayCanvas();
    const op = new ImageOverlayOperation({ image: overlay, x: 0, y: 0, width: 0, height: 50 });
    expect(op.validate()).toBe(false);
  });
});
