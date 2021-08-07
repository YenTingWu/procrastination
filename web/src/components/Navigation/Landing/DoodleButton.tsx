import React from 'react';
import NextLink from 'next/link';
import { Link, LinkProps } from '@chakra-ui/layout';
import { chakra } from '@chakra-ui/system';
import { DoodleBg } from '@components/Icon/DoodleBg';

interface DoodleButtonProps extends LinkProps {
  href: string;
  title: string;
}

export const DoodleButton: React.FC<DoodleButtonProps> = ({
  href,
  title,
  ...linkProps
}) => {
  return (
    <NextLink href={href}>
      <Link
        display="flex"
        justifyContent="center"
        alignItems="center"
        w={['80px', '80px', '80px', '95px']}
        fontWeight="extrabold"
        textDecor="none"
        position="relative"
        _hover={{ textDecor: 'none' }}
        {...linkProps}
      >
        <chakra.span>{title}</chakra.span>
        <DoodleBg position="absolute" />
      </Link>
    </NextLink>
  );
};
