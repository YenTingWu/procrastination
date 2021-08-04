import React from 'react';
import NextLink from 'next/link';
import { useSaveTokenFromQueryString } from '@hooks/useSaveTokenFromQueryString';
import { Flex, Link } from '@chakra-ui/layout';
import { ImageGallery } from '@components/Gallery/ImageGallery';
import { HeadController } from '@components/HeadController';
import { LoadingUI } from '@components/LoadingUI';
import { useCheckTokenToNavigateDashboard } from '@hooks/useCheckTokenToNavigateDashboard';

export default function Home({}) {
  useSaveTokenFromQueryString();
  const { isCheckedToken } = useCheckTokenToNavigateDashboard();

  if (!isCheckedToken) {
    return <LoadingUI />;
  }

  return (
    <Flex minH="100vh" w="100%" alignItems="center" flexDir="column" pb="200">
      <HeadController description="This is a procrastination landing page" />
      <Flex
        minH="100vh"
        minW="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <NextLink href="/signin">
          <Link>sign in </Link>
        </NextLink>
        <NextLink href="/signup">
          <Link>sign up </Link>
        </NextLink>
      </Flex>
      <ImageGallery />
    </Flex>
  );
}
