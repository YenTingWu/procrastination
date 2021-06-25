import React from 'react';
import { IconButton, IconButtonProps, Tooltip } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

interface DeleteButtonProps {
  isDeleteMode: boolean;
  onClick: () => void;
  style?: Omit<IconButtonProps, 'aria-label'>;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  isDeleteMode,
  onClick = console.log,
  style = {},
}) => (
  <Tooltip
    label="Toggle Delete Mode Button"
    aria-label="A tooltip for delete button"
    gutter={20}
    hasArrow={true}
    placement={'right'}
    bg="red.500"
  >
    <IconButton
      aria-label="delete-button"
      size="sm"
      color="red.300"
      bg="red.50"
      isActive={isDeleteMode}
      // transform={`translateY(40%)`}
      icon={<DeleteIcon />}
      _active={{
        color: 'white',
        bg: 'red.300',
      }}
      _hover={{
        bg: 'red.100',
      }}
      {...style}
      onClick={onClick}
    />
  </Tooltip>
);
