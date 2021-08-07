import React, { useRef, useCallback, useState } from 'react';
import NextLink from 'next/link';
import { Link, LinkProps } from '@chakra-ui/layout';
import { chakra } from '@chakra-ui/system';

interface UnderlineButtonProps extends LinkProps {
  href: string;
  title: string;
  selected?: boolean;
}

function getTextWidth(element: Element | null) {
  if (element == null) return undefined;
  return element.getBoundingClientRect().width;
}

export const UnderlineButton: React.FC<UnderlineButtonProps> = ({
  href,
  title,
  selected = false,
  ...linkProps
}) => {
  const [lineX2, setLineX2] = useState<number>(0);
  const textRef = useRef<HTMLSpanElement>(null);

  const handleMouseOverLine = useCallback(() => {
    const textWidth = getTextWidth(textRef.current);
    if (textWidth === undefined) return;
    setLineX2(textWidth);
  }, []);

  const handleMouseLeaveLine = useCallback(() => {
    setLineX2(0);
  }, []);

  return (
    <NextLink href={href}>
      <Link
        display="flex"
        justifyContent="center"
        w="95px"
        fontWeight="extrabold"
        textDecor="none"
        position="relative"
        _hover={{ textDecor: 'none' }}
        onMouseOver={handleMouseOverLine}
        onMouseLeave={handleMouseLeaveLine}
        {...linkProps}
      >
        <chakra.span ref={textRef} color="black">
          {title}
        </chakra.span>
        <chakra.span
          position="absolute"
          bottom="-3px"
          w={
            selected && textRef.current ? getTextWidth(textRef.current) : lineX2
          }
          transformOrigin="left"
          transition="width .21s ease"
          h="4px"
          bg="procrastination.second"
        />
      </Link>
    </NextLink>
  );
};
