import { describe, it, expect } from 'vitest';
import { FlipOperation } from '../src/operations/flip/FlipOperation';
import { createTestCanvas } from './helpers';

describe('FlipOperation', () => {
  it('horizontal flip preserves dimensions', async () => {
    const canvas = createTestCanvas(200, 100);
    const ctx = canvas.getContext('2d')!;

    const op = new FlipOperation('horizontal');
    await op.apply(canvas, ctx);

    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(100);
  });

  it('vertical flip preserves dimensions', async () => {
    const canvas = createTestCanvas(200, 100);
    const ctx = canvas.getContext('2d')!;

    const op = new FlipOperation('vertical');
    await op.apply(canvas, ctx);

    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(100);
  });

  it('has correct type', () => {
    const op = new FlipOperation('horizontal');
    expect(op.type).toBe('flip');
    expect(op.params.direction).toBe('horizontal');
  });

  it('validate accepts horizontal and vertical', () => {
    expect(new FlipOperation('horizontal').validate()).toBe(true);
    expect(new FlipOperation('vertical').validate()).toBe(true);
  });
});
