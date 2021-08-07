import React from 'react';
import { Flex } from '@chakra-ui/layout';
import { ShadowCard } from '@components/UI/ShadowCard';
import { DeviceMedia } from './index';

interface CardSectionProps {
  deviceMedia: DeviceMedia;
}

export const CardSection: React.FC<CardSectionProps> = ({
  deviceMedia: { isLargerThan1200, isLargerThan1000 },
}) => {
  return (
    <Flex zIndex={-2} bg="gray.700" pt="6rem" pb="6rem" justifyContent="center">
      <Flex
        maxW="1300px"
        flexDir={isLargerThan1000 ? 'row' : 'column'}
        justifyContent="space-around"
        alignItems="center"
        w="100%"
      >
        <ShadowCard mb={isLargerThan1000 ? '0' : '8rem'} />
        <ShadowCard mb={isLargerThan1000 ? '0' : '8rem'} />
        <ShadowCard />
      </Flex>
    </Flex>
  );
};
