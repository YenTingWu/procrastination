import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Flex, Box, Grid, FlexProps } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';
import { getBoundingClientRectWithCenterPoint } from './lib/getBoundingClientRectWithCenterPoint';
import { getRandomIntArray } from './lib/getRandomIntArray';
import { getImagesPositionForCollectingImagesToTargetPosition } from './lib/getImagesPositionForCollectingImagesToTargetPosition';
import { resetImagesPosition } from './lib/resetImagesPosition';

export type Coordinates = {
  x: number;
  y: number;
};

export type ImageReference = Record<string, HTMLImageElement | null>;

interface ImageGalleryProps extends FlexProps {
  images?: string[];
  width?: number;
}

type Mode = 'animating' | 'done' | 'gallery';

const TARGET_IMAGE = 'https://source.unsplash.com/1XvjS1fCrms/';

const IMAGES = [
  'https://source.unsplash.com/8wmbUbLUsz4/',
  'https://source.unsplash.com/RxE6AYn-Y5k/',
  'https://source.unsplash.com/wcE2fS3Amoc/',
  'https://source.unsplash.com/ujBYjagUDiY/',
  'https://source.unsplash.com/igLQW_yY9oo/',
  'https://source.unsplash.com/Wj-GUhugkxY/',
  'https://source.unsplash.com/5tKEB1a_5Cw/',
  'https://source.unsplash.com/Q_KBDeMCo9w/',
  'https://source.unsplash.com/Ep_T4Aepor8/',
  'https://source.unsplash.com/Oq13yYb3eHI/',
  'https://source.unsplash.com/LTmdkzm2y1g/',
  'https://source.unsplash.com/ibIqYtrxXds/',
  'https://source.unsplash.com/CaYxfP8IlHM/',
  'https://source.unsplash.com/l0iOHra9kNc/',
  'https://source.unsplash.com/vHgeNO82JMc/',
  'https://source.unsplash.com/1XvjS1fCrms/',
  'https://source.unsplash.com/eKKaiHgJitE/',
  'https://source.unsplash.com/7i2by8a0tK8/',
  'https://source.unsplash.com/v0a-jLLPYL8/',
  'https://source.unsplash.com/2_Q61ZrCzMQ/',
  'https://source.unsplash.com/g71SbI2oGbs/',
  'https://source.unsplash.com/0rjY456aTiE/',
  'https://source.unsplash.com/ykK6Kmh9LL8/',
  'https://source.unsplash.com/fGXqq6HU2-4/',
  'https://source.unsplash.com/IjPWFZncmxs/',
];

const TRANSITION = '.5s transform cubic-bezier(.96,.15,.19, .89)';

// function calculateAllAmount(width: string | number) {
//   const RATIO = 2.73;
//   const ZOOM_IN_RATIO = RATIO + 0.05;

//   if (typeof width === 'number') {
//     const CONTAINER_WIDTH = width;
//     const CONTAINER_HEIGHT = (width / 4) * 3;
//     const IMAGE_WIDTH = width / RATIO;
//     const IMAGE_HEIGHT = CONTAINER_HEIGHT / RATIO;

//     return {
//       CONTAINER_WIDTH,
//       CONTAINER_HEIGHT,
//       IMAGE_WIDTH,
//       IMAGE_HEIGHT,
//       ZOOM_IN_RATIO,
//     };
//   }

//   const CONTAINER_WIDTH = `${width}`;
//   const CONTAINER_HEIGHT = `calc((${width} / 4) * 3)`;
//   const IMAGE_WIDTH = `calc(${width} / RATIO)`;
//   const IMAGE_HEIGHT = `calc(((${width} / 4) * 3) / ${RATIO})`;

//   return {
//     CONTAINER_WIDTH,
//     CONTAINER_HEIGHT,
//     IMAGE_WIDTH,
//     IMAGE_HEIGHT,
//     ZOOM_IN_RATIO,
//   };
// }

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images = IMAGES,
  width = 480,
}) => {
  const RATIO = 2.73;

  const CONTAINER_WIDTH = width;
  const CONTAINER_HEIGHT = (width / 4) * 3;

  const IMAGE_WIDTH = width / RATIO;
  const IMAGE_HEIGHT = CONTAINER_HEIGHT / RATIO;

  const ZOOM_IN_RATIO = RATIO + 0.05;

  const IMAGE_BORDER_RADIUS = 4;

  const [zoomRatio, setZoomRatio] = useState<number>(1);
  const [delta, setDelta] = useState<Coordinates>({ x: 0, y: 0 });
  const [selected, setSelected] = useState<string>('');
  const [imagesPosition, setImagesPosition] = useState<Coordinates[]>(
    resetImagesPosition(images)
  );
  const [gridTransformOrigin, setGridTransformOrigin] = useState<Coordinates>({
    x: CONTAINER_WIDTH / 2,
    y: CONTAINER_HEIGHT / 2,
  });
  const [mode, setMode] = useState<Mode>('animating');

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<ImageReference>({});

  const handleImageClick = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      e.preventDefault();
      // https://skdjfalksdjfl/com/widthxheight/
      const splitSrc = (e.target as HTMLImageElement).src.split('/');
      splitSrc.splice(splitSrc.length - 2, 1);

      setSelected(splitSrc.join('/'));
    },
    []
  );

  const handleLensClick = useCallback(() => {
    const image = imagesRef.current[selected];
    if (image == null) return;
    if (mode === 'done') {
      setImagesPosition(resetImagesPosition(images));
      setMode('gallery');
    }
    setZoomRatio((s) => (s === 1 ? ZOOM_IN_RATIO : 1));
  }, [mode, ZOOM_IN_RATIO, imagesRef.current]);

  // animation
  useEffect(() => {
    //TODO: Clear the timeout function
    const switchImagesAutomatically = (time: number, targetItem: string) => {
      let timeoutIds = [];

      const delay = 1500;
      const zoomInDelay = 300;
      const max = images.length - 1;
      // Build a bunch of random and not-repeated index
      // The number are all between 0 to the amount of images
      const imagesIndice = getRandomIntArray(max, time);

      (function iterateTimeout(count: number, indice: number[]) {
        // The last switch should switch to the specific image
        if (count <= 0) {
          const lastImageTimeoutId = setTimeout(() => {
            setSelected(targetItem);
            const collectImagesTimeoutId = setTimeout(() => {
              const newImagePositions = getImagesPositionForCollectingImagesToTargetPosition(
                targetItem,
                imagesRef.current
              );

              newImagePositions && setImagesPosition(newImagePositions);
              const zoomInTimeoutId = setTimeout(() => {
                setZoomRatio(ZOOM_IN_RATIO);
                setMode('done');
              }, zoomInDelay);
              timeoutIds.push(zoomInTimeoutId);
            }, delay);
            timeoutIds.push(collectImagesTimeoutId);
          }, delay);
          timeoutIds.push(lastImageTimeoutId);

          return;
        }

        // Switch a image in each 2 seconds until the count is equal to 0
        const switchingImageTimeout = setTimeout(() => {
          setSelected(images[indice[count]]);
          iterateTimeout(count - 1, indice);
        }, delay);
        timeoutIds.push(switchingImageTimeout);
      })(time - 1, imagesIndice);

      return timeoutIds;
    };

    const timeoutIds = switchImagesAutomatically(6, TARGET_IMAGE);
    return () => {
      timeoutIds.map((id) => clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    const targetImage = imagesRef.current[selected];
    const container = containerRef.current;
    const grid = gridRef.current;

    if (targetImage == null || container == null || grid == null) return;

    const {
      centerPoint: { cx: containerCx, cy: containerCy },
    } = getBoundingClientRectWithCenterPoint(container);

    const {
      left: gridLeft,
      top: gridTop,
    } = getBoundingClientRectWithCenterPoint(grid);

    const {
      centerPoint: { cx: imageCx, cy: imageCy },
    } = getBoundingClientRectWithCenterPoint(targetImage);

    // Center the selected image through changing the position of the grid
    const deltaX = containerCx - imageCx;
    const deltaY = containerCy - imageCy;

    // Set transform origin as the center point of the selected pic
    const newOriginX = imageCx - gridLeft;
    const newOriginY = imageCy - gridTop;

    setDelta((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
    setGridTransformOrigin({
      x: newOriginX,
      y: newOriginY,
    });
  }, [selected]);

  return (
    <Flex
      w={`${CONTAINER_WIDTH}px`}
      h={`${CONTAINER_HEIGHT}px`}
      p="0"
      borderRadius="4px"
      justifyContent="center"
      alignItems="center"
      position="relative"
      overflow="hidden"
      ref={containerRef}
      bg="gray.700"
    >
      <Box
        w={`${IMAGE_WIDTH}px`}
        h={`${IMAGE_HEIGHT}px`}
        borderRadius={`${IMAGE_BORDER_RADIUS}px`}
        borderWidth="3px"
        borderColor="white"
        zIndex="100"
        transform={`scale(${zoomRatio})`}
        transition={TRANSITION}
        onClick={handleLensClick}
      />
      <Grid
        ref={gridRef}
        m="0"
        position="absolute"
        w="190%"
        templateColumns="repeat(5, 1fr)"
        gap="8px"
        transition={TRANSITION}
        transformOrigin={`${gridTransformOrigin.x}px  ${gridTransformOrigin.y}px`}
        transform={`translate(${delta.x}px, ${delta.y}px) scale(${zoomRatio})`}
      >
        {images.map((src, i) => {
          return (
            <Image
              borderRadius={`${IMAGE_BORDER_RADIUS}px`}
              key={src}
              src={`${src}${CONTAINER_WIDTH}x${CONTAINER_HEIGHT}/`}
              objectFit={'cover'}
              w={IMAGE_WIDTH}
              h={IMAGE_HEIGHT}
              ref={(n) => {
                if (n == null) return;
                imagesRef.current[src] = n;
              }}
              opacity={src === selected ? `1` : `.5`}
              zIndex={src === selected ? 10 : 1}
              _hover={{
                opacity: src === selected ? '1' : '.7',
                cursor: 'pointer',
              }}
              onClick={mode === 'animating' ? () => {} : handleImageClick}
              transition={TRANSITION}
              transform={`translate(${imagesPosition[i].x}px, ${imagesPosition[i].y}px)`}
            />
          );
        })}
      </Grid>
    </Flex>
  );
};
