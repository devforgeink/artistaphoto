export class ArtistaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ArtistaError';
    Object.setPrototypeOf(this, ArtistaError.prototype);
  }
}

export class InvalidDimensionsError extends ArtistaError {
  constructor(message: string = 'Invalid dimensions') {
    super(message);
    this.name = 'InvalidDimensionsError';
    Object.setPrototypeOf(this, InvalidDimensionsError.prototype);
  }
}

export class InvalidCropError extends ArtistaError {
  constructor(message: string = 'Invalid crop parameters') {
    super(message);
    this.name = 'InvalidCropError';
    Object.setPrototypeOf(this, InvalidCropError.prototype);
  }
}

export class ImageLoadError extends ArtistaError {
  constructor(message: string = 'Failed to load image') {
    super(message);
    this.name = 'ImageLoadError';
    Object.setPrototypeOf(this, ImageLoadError.prototype);
  }
}

export class ExportError extends ArtistaError {
  constructor(message: string = 'Failed to export image') {
    super(message);
    this.name = 'ExportError';
    Object.setPrototypeOf(this, ExportError.prototype);
  }
}

export class CanvasContextError extends ArtistaError {
  constructor(message: string = 'Failed to get canvas context') {
    super(message);
    this.name = 'CanvasContextError';
    Object.setPrototypeOf(this, CanvasContextError.prototype);
  }
}
