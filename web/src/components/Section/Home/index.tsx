import React from 'react';
import { Flex } from '@chakra-ui/layout';
import { useMediaQuery } from '@chakra-ui/media-query';
import { LandingBanner } from './LandingBanner';
import { CardSection } from './CardSection';
import { CarouselSection } from './CarouselSection';
import { AppIntroSection } from './AppIntroSection';
import { StatSection } from './StatSection';
import { WhatNext } from './WhatNext';
import { useMounted } from '@hooks/useMounted';
import { MountedSkelton } from '@components/UI/MountedSkelton';

export type DeviceMedia = {
  isLargerThan1200: boolean;
  isLargerThan1000: boolean;
  isLargerThan500: boolean;
};

export const HomeMainSection = () => {
  const { hasMounted } = useMounted();

  const [isLargerThan1200, isLargerThan1000, isLargerThan500] = useMediaQuery([
    '(min-width: 1200px)',
    '(min-width: 1000px)',
    '(min-width: 500px)',
  ]);

  if (!hasMounted) return <MountedSkelton />;

  const deviceMedia = {
    isLargerThan1200,
    isLargerThan1000,
    isLargerThan500,
  };
  return (
    <Flex as="main" direction="column" alignSelf="stretch">
      <LandingBanner deviceMedia={deviceMedia} />
      <CardSection deviceMedia={deviceMedia} />
      <CarouselSection />
      <AppIntroSection deviceMedia={deviceMedia} />
      <StatSection deviceMedia={deviceMedia} />
      <WhatNext deviceMedia={deviceMedia} />
    </Flex>
  );
};
