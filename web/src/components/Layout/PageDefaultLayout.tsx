import React from 'react';
import { Flex } from '@chakra-ui/layout';
import { LandingNavigation } from '@components/Navigation/Landing';
import { Footer } from '@components/UI/Footer';

interface PageDefaultLayoutProps {}

export const PageDefaultLayout: React.FC<PageDefaultLayoutProps> = ({
  children,
}) => {
  return (
    <Flex minH="100vh" w="100%" alignItems="center" flexDir="column">
      <LandingNavigation />
      {children}
      <Footer />
    </Flex>
  );
};
