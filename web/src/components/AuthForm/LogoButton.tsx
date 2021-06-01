import React from 'react';
import { Button, Text } from '@chakra-ui/react';

interface LogoButtonProps {
  title: string;
  logo: JSX.Element;
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
      {...styles}
    >
      {logo}
      <Text fontSize="16px" ml="6px" fontWeight="extrabold">
        {title}
      </Text>
    </Button>
  );
};
