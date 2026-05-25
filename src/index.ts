// Main SDK class
export { Artista, LicenseError } from './core/Artista';

// Export all types
export type {
  FilterType,
  ExportFormat,
  CropOptions,
  ResizeOptions,
  ImageMetadata,
  ExportOptions,
  AdjustmentType,
  AdjustmentParams,
  FilterParams,
  OperationType,
  TextOptions,
  TextParams,
  ShapeType,
  ShapeOptions,
  ShapeParams,
  RotateOptions,
  FlipDirection,
  FlipOptions,
  ImageOverlayOptions,
  // License types
  LicenseStatus,
  LicenseInfo,
  LicenseConfig,
  LicenseValidationResult,
} from './types';

// Export errors
export {
  ArtistaError,
  InvalidDimensionsError,
  InvalidCropError,
  ImageLoadError,
  ExportError,
  CanvasContextError,
} from './errors/ArtistaError';

// Convenience factory function
export async function createEditor(
  source: string | File | HTMLImageElement | HTMLCanvasElement
): Promise<import('./core/Artista').Artista> {
  const { Artista } = await import('./core/Artista');

  if (typeof source === 'string') {
    return Artista.fromUrl(source);
  } else if (source instanceof File) {
    return Artista.fromFile(source);
  } else if (source instanceof HTMLImageElement) {
    return Artista.fromImageElement(source);
  } else if (source instanceof HTMLCanvasElement) {
    return Artista.fromCanvas(source);
  }

  throw new Error('Unsupported source type');
}
