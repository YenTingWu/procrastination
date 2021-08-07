import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/layout';
import { DeviceMedia } from './index';
import { LogoButton } from '@components/Form/LogoButton';
import { GoogleIcon } from '@components/Icon';
import { useRouter } from 'next/router';
import { useDebounceCallback } from '@hooks/useDebounceCallback';
import { handleSocialLogin as onSocialLogin } from '@lib/handleSocialLogin';
import { SocialLoginType } from '@types';

interface WhatNextProps {
  deviceMedia: DeviceMedia;
}

export const WhatNext: React.FC<WhatNextProps> = ({
  deviceMedia: { isLargerThan500, isLargerThan1000 },
}) => {
  const { push } = useRouter();

  const handleNavigateSignUp = useDebounceCallback(
    () => push('/signup'),
    400,
    []
  );
  const handleNavigateSignInWithGoogle = useDebounceCallback(
    async () => onSocialLogin(SocialLoginType.GOOGLE),
    400,
    []
  );
  return (
    <Box p={isLargerThan500 ? '10rem 0' : '5rem 2rem'}>
      <Flex
        flexDir="column"
        w="100%"
        m="auto"
        maxW={isLargerThan500 ? '1000px' : '300px'}
        justifyContent="center"
        alignItems="center"
      >
        <Heading
          as="h1"
          fontSize={
            isLargerThan1000 ? '3.5rem' : isLargerThan500 ? '3.2rem' : '2rem'
          }
        >
          Build What's Next
        </Heading>
        <Text
          fontSize={isLargerThan500 ? '1.5rem' : '1rem'}
          mt="1.875rem"
          mb="3.75rem"
          fontWeight="extrabold"
          color="#555555"
        >
          C'est La Vie! Just Enjoy Your Life
        </Text>
        <Flex flexDir={isLargerThan500 ? 'row' : 'column'}>
          <LogoButton
            onClick={handleNavigateSignUp}
            title="Get Started For Free"
            w={'215px'}
            h="43px"
            mr="2rem"
            mb={isLargerThan500 ? 0 : '.875rem'}
          />
          <LogoButton
            logo={<GoogleIcon />}
            onClick={handleNavigateSignInWithGoogle}
            title="Sign Up With Google"
            w="215px"
            h="43px"
          />
        </Flex>
      </Flex>
    </Box>
  );
};
