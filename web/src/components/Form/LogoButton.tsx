import React from 'react';
import { Text } from '@chakra-ui/layout';
import { Button, ButtonProps } from '@chakra-ui/button';

export interface LogoButtonProps extends ButtonProps {
  title: string;
  logo?: JSX.Element;
  onClick: () => void;
  styles?: JSX.IntrinsicAttributes;
}

/**
 * ## LogoButton
 * @param props title, logo, onClick, styles
 * @returns JSX.Element
 */

export const LogoButton: React.FC<LogoButtonProps> = ({
  title,
  logo,
  onClick,
  styles,
  ...buttonProps
}) => {
  return (
    <Button
      maxW="276px"
      w="100%"
      h="50px"
      display="flex"
      borderWidth="3px"
      borderColor="black"
      borderRadius="10px"
      bg="white"
      onClick={onClick}
      padding="11px 27px"
      _hover={{
        background: 'white',
        transform: 'rotate(2deg)',
      }}
      {...buttonProps}
      {...styles}
    >
      {logo}
      <Text fontSize="16px" ml="6px" fontWeight="extrabold">
        {title}
      </Text>
    </Button>
  );
};
