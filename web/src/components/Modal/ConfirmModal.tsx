import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
} from '@chakra-ui/react';

interface ConfirmModalProps {
  isOpen: boolean;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  content,
  onConfirm,
  isLoading,
}) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{content}</ModalHeader>
        <ModalFooter>
          <Button variant="outline" colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            isLoading={typeof isLoading === 'boolean' ? isLoading : false}
            onClick={onConfirm}
            colorScheme="red"
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
