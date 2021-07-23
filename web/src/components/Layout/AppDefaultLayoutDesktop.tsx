import React from 'react';
import { Flex } from '@chakra-ui/layout';

interface AppDefaultLayoutDesktopProps {
  center?: boolean;
}

export const AppDefaultLayoutDesktop: React.FC<AppDefaultLayoutDesktopProps> = ({
  children,
  center,
}) => {
  return (
    <Flex
      w="100%"
      minH="100vh"
      justifyContent={center ? `center` : 'initial'}
      alignItems={center ? `center` : 'initial'}
    >
      {children}
    </Flex>
  );
};
