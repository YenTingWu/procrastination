import { getBoundingClientRectWithCenterPoint } from './getBoundingClientRectWithCenterPoint';
import type { ImageReference } from '../ImageGallery';

export function getImagesPositionForCollectingImagesToTargetPosition(
  target: string,
  images: ImageReference
) {
  const topImage = images[target];
  if (topImage == null) return;
  const {
    centerPoint: { cx, cy },
  } = getBoundingClientRectWithCenterPoint(topImage);

  const imagesPositions = Object.values(images).map((imgRef) => {
    if (imgRef === null) return { x: 0, y: 0 };
    const {
      centerPoint: { cx: imageCx, cy: imageCy },
    } = getBoundingClientRectWithCenterPoint(imgRef);

    return {
      x: cx - imageCx,
      y: cy - imageCy,
    };
  });

  return imagesPositions;
}
