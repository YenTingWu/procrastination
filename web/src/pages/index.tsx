import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSaveTokenFromQueryString } from '@hooks/useSaveTokenFromQueryString';
import { useTokenStore } from '@globalStore/client/useTokenStore';
import { Flex, Link } from '@chakra-ui/layout';
import { HeaderController } from '@components/HeadController';
import { LoadingUI } from '@components/LoadingUI';

export default function Home({}) {
  useSaveTokenFromQueryString();
  // TODO: Check accessToken from cookie
  const hasTokens = useTokenStore((s) => !!s.accessToken);
  const { push } = useRouter();
  const [isCheckedToken, setCheckedToken] = useState<boolean>(false);

  useEffect(() => {
    if (hasTokens) {
      push('/dashboard');
    } else {
      setCheckedToken(true);
    }
  }, [push]);

  if (!isCheckedToken) {
    return <LoadingUI />;
  }

  return (
    <>
      <HeaderController description="This is a procrastination landing page" />

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
    </>
  );
}
