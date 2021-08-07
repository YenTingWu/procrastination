import React from 'react';
import { useRouter } from 'next/router';
import { Flex, Heading, Box, Text } from '@chakra-ui/layout';
import { ImageGallery } from '@components/Gallery/ImageGallery';
import { LogoButton } from '@components/Form/LogoButton';
import { GoogleIcon } from '@components/Icon/GoogleIcon';
import { handleSocialLogin as onSocialLogin } from '@lib/handleSocialLogin';
import { useDebounceCallback } from '@hooks/useDebounceCallback';
import { SocialLoginType } from '@types';
import { DeviceMedia } from './index';

interface LandingBannerProps {
  deviceMedia: DeviceMedia;
}

export const LandingBanner: React.FC<LandingBannerProps> = ({
  deviceMedia: { isLargerThan1200, isLargerThan500 },
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
    <Flex w="100%" justifyContent="center">
      <Flex
        pt="8rem"
        pb="8rem"
        maxW={isLargerThan1200 ? `1100px` : '450px'}
        w="100%"
        flexDir={isLargerThan1200 ? 'row' : 'column'}
        alignItems={isLargerThan1200 ? 'flex-start' : 'center'}
      >
        <Box
          flex="1"
          pt="2rem"
          pl={isLargerThan500 ? '0' : '2rem'}
          pr={isLargerThan1200 ? '6rem' : isLargerThan500 ? '0' : '2rem'}
          mb={isLargerThan1200 ? '0' : '3rem'}
        >
          <Heading
            as="h1"
            fontSize={isLargerThan500 ? `5xl` : '3xl'}
            fontWeight="black"
            letterSpacing={'0.011em'}
          >
            A Way to Live With
            {'\n'}
            Procrastination
          </Heading>
          <Text mt="1.5rem" fontSize="1rem" color="#888888">
            We help procrastinators manage time brightly and understand where
            your missing time went.
          </Text>

          <Text
            mt="1rem"
            fontSize=".875rem"
            fontWeight="black"
            color="procrastination.second"
          >
            Be productive properly and elegantly enjoy your procrastination
          </Text>
          <Flex mt="3rem" flexDir={isLargerThan500 ? 'row' : 'column'}>
            <LogoButton
              onClick={handleNavigateSignUp}
              title="Get Started For Free"
              w="215px"
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
        </Box>
        <ImageGallery
          width={isLargerThan1200 ? 500 : isLargerThan500 ? 400 : 300}
        />
      </Flex>
    </Flex>
  );
};
