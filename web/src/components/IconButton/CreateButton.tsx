import React from 'react';
import { SmallAddIcon } from '@chakra-ui/icons';
import { IconButton, IconButtonProps, Tooltip } from '@chakra-ui/react';

interface CreateButtonProps {
  onClick: () => void;
  style?: Omit<IconButtonProps, 'aria-label'>;
}

export const CreateButton: React.FC<CreateButtonProps> = ({
  onClick = console.log,
  style = {},
}) => (
  <Tooltip
    label="Create New Event"
    aria-label="A tooltip for create button"
    gutter={20}
    hasArrow={true}
    placement={'right'}
  >
    <IconButton
      aria-label="create-button"
      size="sm"
      color="white"
      bg="blue.500"
      icon={<SmallAddIcon />}
      _active={{
        color: 'white',
        bg: 'blue.700',
      }}
      _hover={{
        bg: 'blue.600',
      }}
      {...style}
      onClick={onClick}
    />
  </Tooltip>
);
