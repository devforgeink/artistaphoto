import { describe, it, expect } from 'vitest';
import {
  validateDimensions,
  validateCropParams,
  validateAdjustmentValue,
  validateFilterIntensity,
} from '../src/utils/validators';
import { InvalidDimensionsError, InvalidCropError } from '../src/errors/ArtistaError';

describe('validateDimensions', () => {
  it('accepts valid dimensions', () => {
    expect(() => validateDimensions(100, 200)).not.toThrow();
  });

  it('rejects zero width', () => {
    expect(() => validateDimensions(0, 100)).toThrow(InvalidDimensionsError);
  });

  it('rejects negative height', () => {
    expect(() => validateDimensions(100, -1)).toThrow(InvalidDimensionsError);
  });

  it('rejects dimensions exceeding max', () => {
    expect(() => validateDimensions(20000, 100)).toThrow(InvalidDimensionsError);
  });
});

describe('validateCropParams', () => {
  it('accepts valid crop within bounds', () => {
    expect(() => validateCropParams({ x: 10, y: 10, width: 50, height: 50 }, 100, 100)).not.toThrow();
  });

  it('rejects crop exceeding image width', () => {
    expect(() => validateCropParams({ x: 60, y: 0, width: 50, height: 50 }, 100, 100)).toThrow(InvalidCropError);
  });

  it('rejects crop exceeding image height', () => {
    expect(() => validateCropParams({ x: 0, y: 60, width: 50, height: 50 }, 100, 100)).toThrow(InvalidCropError);
  });

  it('rejects negative coordinates', () => {
    expect(() => validateCropParams({ x: -1, y: 0, width: 50, height: 50 }, 100, 100)).toThrow(InvalidCropError);
  });

  it('rejects zero dimensions', () => {
    expect(() => validateCropParams({ x: 0, y: 0, width: 0, height: 50 }, 100, 100)).toThrow(InvalidCropError);
  });
});

describe('validateAdjustmentValue', () => {
  it('clamps to range', () => {
    expect(validateAdjustmentValue(150)).toBe(100);
    expect(validateAdjustmentValue(-150)).toBe(-100);
    expect(validateAdjustmentValue(50)).toBe(50);
  });
});

describe('validateFilterIntensity', () => {
  it('clamps to 0-1', () => {
    expect(validateFilterIntensity(1.5)).toBe(1);
    expect(validateFilterIntensity(-0.5)).toBe(0);
    expect(validateFilterIntensity(0.5)).toBe(0.5);
  });
});
