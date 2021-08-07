import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useDisclosure } from '@chakra-ui/hooks';
import { useMediaQuery } from '@chakra-ui/media-query';
import { Flex, Link } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';
import { IconButton } from '@chakra-ui/button';
import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/modal';
import { UnderlineButton } from '@components/Navigation/Landing/UnderlineButton';
import { DoodleButton } from '@components/Navigation/Landing/DoodleButton';
import { useMounted } from '@hooks/useMounted';

interface LandingNavigationProps {}

export const LandingNavigation: React.FC<LandingNavigationProps> = ({}) => {
  const { pathname } = useRouter();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [value] = useMediaQuery('(min-width: 960px)');
  const { hasMounted } = useMounted();

  const isLargerThan960 = hasMounted ? value : null;

  return (
    <Flex
      h={isLargerThan960 ? '88px' : '65px'}
      w="100%"
      pr={['1rem', '2rem', '3.5rem', '3.5rem', '6.5em']}
      pl={['.875rem', '.875rem', '.875rem', '0', '5em']}
      justifyContent="center"
    >
      <Flex
        maxW="1300px"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <NextLink href="/">
          <Link>
            {isLargerThan960 ? (
              <Image w="264px" src="Logo_Navigate_Home_Button.png" />
            ) : (
              <Image w="42px" src="Black_Logo.png" />
            )}
          </Link>
        </NextLink>

        {isLargerThan960 ? (
          <Flex>
            <Flex mr={['3rem', '3rem', '3rem', '4rem']}>
              <UnderlineButton
                selected={pathname === '/'}
                href="/"
                title="Home"
              />
              <UnderlineButton
                selected={pathname === '/contact'}
                href="/contact"
                title="Contact"
              />
            </Flex>
            <Flex>
              <UnderlineButton
                selected={pathname === '/signin'}
                href="/signin"
                title="Sign In"
              />
              <DoodleButton href="/signup" title="Sign Up" />
            </Flex>
          </Flex>
        ) : (
          <>
            <IconButton
              size="sm"
              colorScheme="purple"
              aria-label="Search database"
              icon={<HamburgerIcon />}
              onClick={onOpen}
            />
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerBody>
                  <UnderlineButton
                    selected={pathname === '/'}
                    href="/"
                    title="Home"
                    fontSize="2xl"
                    mb="3"
                    justifyContent="flex-start"
                  />
                  <UnderlineButton
                    selected={pathname === '/contact'}
                    href="/contact"
                    title="Contact"
                    fontSize="2xl"
                    mb="3"
                    justifyContent="flex-start"
                  />
                  <UnderlineButton
                    selected={pathname === '/signin'}
                    href="/signin"
                    title="Sign In"
                    fontSize="2xl"
                    mb="3"
                    justifyContent="flex-start"
                  />
                  <UnderlineButton
                    selected={pathname === '/signup'}
                    href="/signup"
                    title="Sign Up"
                    fontSize="2xl"
                    justifyContent="flex-start"
                  />
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </>
        )}
      </Flex>
    </Flex>
  );
};
