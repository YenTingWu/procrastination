import React from 'react';
import { Flex, Box, Heading, Text } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';
import { DeviceMedia } from './index';

interface AppIntroSectionProps {
  deviceMedia: DeviceMedia;
}

export const AppIntroSection: React.FC<AppIntroSectionProps> = ({
  deviceMedia: { isLargerThan1000 },
}) => {
  return (
    <Flex
      borderTop="1px solid rgb(220, 220, 220)"
      bg="rgb(250, 250, 250)"
      pt="4rem"
      pb="4rem"
      alignItems="center"
      flexDir="column"
    >
      <Flex
        flexDir={isLargerThan1000 ? 'row' : 'column'}
        maxW={isLargerThan1000 ? '1200px' : '500px'}
        w="100%"
        p={isLargerThan1000 ? '6rem 2rem 6rem 6rem' : '0 2rem'}
      >
        <Box pt="3rem" flex="1 1 0">
          <Heading as="h3" fontSize="1.875rem" fontWeight="extrabold">
            {`Are You Looking For Your Missing Time`}
          </Heading>
          <Text mt="2rem" color="procrastination.gray">
            {`Procrastination helps you analyze how you use your time. Actually, I have no idea what to type, but I really need some words to make the layout look better`}
          </Text>
        </Box>
        <Flex
          flex="1.8 1 0"
          p={isLargerThan1000 ? '0 0 0 8rem' : '4rem 0 0 0'}
          justifyContent="center"
          alignItems="center"
        >
          <Image
            filter="drop-shadow(3px 4px 30px rgba(0, 0, 0, 0.25))"
            w="500px"
            borderRadius="4px"
            src={`analysis_app.png`}
          />
        </Flex>
      </Flex>
      <Flex
        flexDir={isLargerThan1000 ? 'row' : 'column-reverse'}
        w="100%"
        maxW={isLargerThan1000 ? '1200px' : '500px'}
        p={isLargerThan1000 ? '6rem 6rem 6rem 2rem' : '2rem'}
        alignItems="center"
      >
        <Flex
          flex="1.8 1 0"
          pt={isLargerThan1000 ? '0' : '4rem'}
          alignItems="center"
        >
          <Image
            filter="drop-shadow(3px 4px 30px rgba(0, 0, 0, 0.25))"
            w="100%"
            maxW="500px"
            borderRadius="4px"
            src={`todo_app.png`}
          />
        </Flex>
        <Box pt="3rem" flex="1 1 0">
          <Heading as="h3" fontSize="1.875rem" fontWeight="extrabold">
            {`Are You Looking For Your Missing Time`}
          </Heading>
          <Text mt="2rem" color="procrastination.gray">
            {`Procrastination helps you analyze how you use your time. Actually, I have no idea what to type, but I really need some words to make the layout look better`}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};
