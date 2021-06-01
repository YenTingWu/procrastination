import React from 'react';
import { Flex, Heading } from '@chakra-ui/react';

// TODO: Loading Screen

export const LoadingUI = () => {
  return (
    <Flex minH="100vh" minW="100%" justifyContent="center" alignItems="center">
      <Heading as="h1">Loading!!!!!!!!</Heading>
    </Flex>
  );
};
