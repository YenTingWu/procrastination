import React from 'react';
import { Button } from '@chakra-ui/button';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from '@chakra-ui/modal';
interface ConfirmModalProps {
  isOpen: boolean;
  content: string;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
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
