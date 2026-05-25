import type { ImageMetadata } from '../types';

export class ImageState {
  originalImage: HTMLImageElement;
  originalImageData: ImageData;
  readonly width: number;
  readonly height: number;
  readonly metadata: ImageMetadata;

  constructor(image: HTMLImageElement, imageData: ImageData) {
    this.originalImage = image;
    this.originalImageData = imageData;
    this.width = imageData.width;
    this.height = imageData.height;
    this.metadata = {
      createdAt: Date.now(),
      format: 'unknown',
      width: imageData.width,
      height: imageData.height,
    };
  }

  clone(): ImageState {
    return new ImageState(this.originalImage, this.originalImageData);
  }

  release(): void {
    this.originalImage.src = '';
    this.originalImage = null!;
    this.originalImageData = null!;
  }
}
