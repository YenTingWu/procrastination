import React from 'react';
import { Flex, Box, Heading, Text, FlexProps } from '@chakra-ui/layout';

interface ShadowCardProps extends FlexProps {
  title?: string;
  content?: string;
}

export const ShadowCard: React.FC<ShadowCardProps> = ({
  title = 'Heading',
  content = `Lorem Ipsum is that it has a opposed to using Content here, content here, making and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on`,
  ...flexProps
}) => (
  <Flex
    maxW="290px"
    w="100%"
    minH="364px"
    bg="gray.700"
    borderRadius="10px"
    borderWidth="5px"
    borderColor="white"
    flexDir="column"
    alignItems="center"
    pr="3.2rem"
    pl="3.2rem"
    pt="2rem"
    pb="2rem"
    boxShadow="2px 4px 10px 5px rgba(0, 0, 0, 0.5)"
    position="relative"
    _before={{
      content: '""',
      position: 'absolute',
      top: -4,
      left: 4,
      w: '100%',
      h: '100%',
      bg: 'white',
      zIndex: -2,
      borderRadius: '10px',
      borderWidth: '5px',
      borderColor: 'white',
    }}
    {...flexProps}
  >
    <Box
      as="span"
      w="20px"
      h="20px"
      borderRadius="100%"
      borderWidth="5px"
      borderColor="white"
    />
    <Heading
      as="h3"
      pt="1.2rem"
      pb="1.2rem"
      fontSize="1.875rem"
      fontWeight="black"
      color="white"
    >
      {title}
    </Heading>
    <Text fontSize="1rem" letterSpacing=".01em" color="white">
      {content}
    </Text>
  </Flex>
);
