import type { Coordinates } from '../ImageGallery';

export function resetImagesPosition(images: string[]): Coordinates[] {
  return images.map((_) => ({ x: 0, y: 0 }));
}
