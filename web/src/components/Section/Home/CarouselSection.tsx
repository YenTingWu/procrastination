import React from 'react';
import { Flex, Text } from '@chakra-ui/layout';
import { TextCarousel } from '@components/UI/Carousel/TextCarousel';

const TRUSTED_LIST = [
  'Nobody',
  'Has',
  'Trusted',
  'This',
  'Application',
  'For',
  'Now',
];

export const CarouselSection = () => {
  return (
    <Flex
      bg="gray.50"
      pt="2.5rem"
      pb="3rem"
      flexDir="column"
      alignItems="center"
    >
      <Text
        fontSize="1.125rem"
        letterSpacing=".1em"
        color="procrastination.gray"
      >
        TRUSTED IN PRODUCTION BY
      </Text>
      <TextCarousel list={TRUSTED_LIST} />
    </Flex>
  );
};
