import React from 'react';
import { Flex } from '@chakra-ui/react';

interface AppDefaultLayoutDesktopProps {}

export const AppDefaultLayoutDesktop: React.FC<AppDefaultLayoutDesktopProps> = ({
  children,
}) => {
  return (
    <Flex w="100%" minH="100vh">
      {children}
    </Flex>
  );
};
