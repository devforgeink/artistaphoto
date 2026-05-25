export function createTestCanvas(width = 100, height = 100): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function createTestImageData(width = 100, height = 100): ImageData {
  return new ImageData(width, height);
}

export function fillCanvasRed(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function getPixel(ctx: CanvasRenderingContext2D, x: number, y: number): [number, number, number, number] {
  const d = ctx.getImageData(x, y, 1, 1).data;
  return [d[0], d[1], d[2], d[3]];
}
