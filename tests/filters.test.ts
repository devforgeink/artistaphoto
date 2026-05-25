import { describe, it, expect } from 'vitest';
import { GrayscaleFilter } from '../src/operations/filters/GrayscaleFilter';
import { SepiaFilter } from '../src/operations/filters/SepiaFilter';
import { InvertFilter } from '../src/operations/filters/InvertFilter';
import { BrightnessAdjustment } from '../src/operations/adjustments/BrightnessAdjustment';
import { ContrastAdjustment } from '../src/operations/adjustments/ContrastAdjustment';
import { createTestCanvas, getPixel } from './helpers';

describe('GrayscaleFilter', () => {
  it('converts colored pixels to gray', async () => {
    const canvas = createTestCanvas(10, 10);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 10, 10);

    const filter = new GrayscaleFilter(1.0);
    await filter.apply(canvas, ctx);

    const [r, g, b] = getPixel(ctx, 5, 5);
    expect(r).toBe(g);
    expect(g).toBe(b);
  });

  it('partial intensity blends with original', async () => {
    const canvas = createTestCanvas(10, 10);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 10, 10);

    const filter = new GrayscaleFilter(0.5);
    await filter.apply(canvas, ctx);

    const [r, g] = getPixel(ctx, 5, 5);
    expect(r).toBeGreaterThan(g);
  });
});

describe('SepiaFilter', () => {
  it('applies warm tones', async () => {
    const canvas = createTestCanvas(10, 10);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 10, 10);

    const filter = new SepiaFilter(1.0);
    await filter.apply(canvas, ctx);

    const [r, , b] = getPixel(ctx, 5, 5);
    expect(r).toBeGreaterThan(b);
  });
});

describe('InvertFilter', () => {
  it('inverts pixel values', async () => {
    const canvas = createTestCanvas(10, 10);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 10, 10);

    const filter = new InvertFilter(1.0);
    await filter.apply(canvas, ctx);

    const [r, g, b] = getPixel(ctx, 5, 5);
    expect(r).toBe(0);
    expect(g).toBe(255);
    expect(b).toBe(255);
  });
});

describe('BrightnessAdjustment', () => {
  it('increases brightness', async () => {
    const canvas = createTestCanvas(10, 10);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 10, 10);

    const original = getPixel(ctx, 5, 5)[0];
    const adj = new BrightnessAdjustment(50);
    await adj.apply(canvas, ctx);

    const [r] = getPixel(ctx, 5, 5);
    expect(r).toBeGreaterThan(original);
  });

  it('decreases brightness', async () => {
    const canvas = createTestCanvas(10, 10);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 10, 10);

    const original = getPixel(ctx, 5, 5)[0];
    const adj = new BrightnessAdjustment(-50);
    await adj.apply(canvas, ctx);

    const [r] = getPixel(ctx, 5, 5);
    expect(r).toBeLessThan(original);
  });

  it('clamps value to range', () => {
    const adj = new BrightnessAdjustment(200);
    expect(adj.params.value).toBe(100);
  });
});

describe('ContrastAdjustment', () => {
  it('clamps value to range', () => {
    const adj = new ContrastAdjustment(-200);
    expect(adj.params.value).toBe(-100);
  });
});
