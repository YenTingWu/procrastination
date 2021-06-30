import React, { useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Box,
} from '@chakra-ui/react';
import axios from 'axios';
import { Formik, FormikProps, Form, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { useQueryClient } from 'react-query';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import {
  FormLabelInputUI,
  FormLabelTextareaUI,
} from '@components/Form/FormLabelInputUI';
import { DateTimePickerInput } from '@components/Form/DateTimePickerInput';
import { useTokenStore } from '@globalStore/client/useTokenStore';
import { useSelectDateTimeOpen } from '@globalStore/client/useSelectDateTimeOpen';
import { QUERY_KEYS } from '@globalStore/server/queryKeys';
import { Schedule } from '@types';
import { API_BASE_URL } from '../../config';

import { useDebounceCallback } from '@hooks/useDebounceCallback';

export type FormState = {
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
};

interface ManipulateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: Schedule | null;
  calendarUid: string;
}

/**
 * ## ManipulateEventModal
 * @param props { isOpen, onClose, selectedEvent }
 * @returns React.FC
 */

export const ManipulateEventModal: React.FC<ManipulateEventModalProps> = ({
  isOpen = true,
  onClose,
  selectedEvent,
  calendarUid,
}) => {
  const queryClient = useQueryClient();
  const token = useTokenStore((s) => s.accessToken);
  const setSelectOpenedPicker = useSelectDateTimeOpen(
    (s) => s.setSelectOpenedPicker
  );

  const handleEventCreateMutation = useDebounceCallback(
    async (values: FormState, actions: FormikHelpers<FormState>) => {
      const expectedDuration = differenceInSeconds(
        values.endTime,
        values.startTime
      );

      if (expectedDuration <= 0) {
        throw new Error();
      }

      try {
        await axios({
          method: 'POST',
          baseURL: API_BASE_URL,
          url: '/event/e',
          headers: {
            authorization: `Bearer ${token}`,
          },
          data: {
            event: {
              ...values,
              calendarUid,
              expectedDuration,
              type: 'event',
            },
          },
        });
        actions.setSubmitting(false);
        onClose();
        queryClient.invalidateQueries(QUERY_KEYS.currentUser);
      } catch {
        throw new Error();
      }
    },
    100,
    [queryClient, token]
  );

  const handleEventUpdateMutation = useDebounceCallback(
    async (values: FormState, actions: FormikHelpers<FormState>) => {
      const expectedDuration = differenceInSeconds(
        values.endTime,
        values.startTime
      );

      if (expectedDuration <= 0) {
        throw new Error();
      }
      try {
        axios({
          method: 'PUT',
          baseURL: API_BASE_URL,
          url: `/event/e/${selectedEvent?.uuid || ''}`,
          headers: {
            authorization: `Bearer ${token}`,
          },
          data: {
            ...values,
            expectedDuration,
          },
        });
        actions.setSubmitting(false);
        queryClient.invalidateQueries(QUERY_KEYS.currentUser);
        onClose();
      } catch {
        throw new Error();
      }
    },
    100,
    [selectedEvent?.uuid, token, queryClient]
  );

  const handleClose = useCallback(() => {
    setSelectOpenedPicker(null);
    onClose();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} onOverlayClick={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <Formik
          /**
           * TODO:
           * Although the values have changed, once close the modal
           * the modal will be unmounted
           * so that the initial value will be reset next time the modal opened.
           *
           * 1. Build an api to change the event value
           * 2. Refetch user data
           */
          initialValues={
            {
              name: selectedEvent?.name || '',
              description: selectedEvent?.description || '',
              startTime: selectedEvent?.startTime || new Date(),
              endTime: selectedEvent?.endTime || new Date(),
            } as FormState
          }
          validationSchema={yup.object({
            name: yup.string().required('Missing Name'),
            description: yup.string(),
            startTime: yup.date(),
            endTime: yup.date(),
          })}
          onSubmit={
            selectedEvent?.uuid
              ? handleEventUpdateMutation
              : handleEventCreateMutation
          }
        >
          {(props: FormikProps<FormState>) => {
            return (
              <Form>
                <ModalHeader fontSize="3xl">
                  {selectedEvent == null
                    ? 'Create an event'
                    : 'Modify an event'}
                </ModalHeader>
                <ModalBody>
                  <FormLabelInputUI
                    name="name"
                    label="Event Name"
                    value={props.values.name}
                    onChange={props.handleChange}
                  />
                  <FormLabelTextareaUI
                    name="description"
                    label="Event Description"
                    value={props.values.description}
                    onChange={props.handleChange}
                  />
                  <Box mt="5">
                    <DateTimePickerInput
                      fieldKey="startTime"
                      label="Start Time"
                    />
                    <DateTimePickerInput fieldKey="endTime" label="End Time" />
                  </Box>
                </ModalBody>

                <ModalFooter>
                  <Button onClick={handleClose} mr={3} variant="ghost">
                    Close
                  </Button>
                  <Button type="submit" colorScheme="blue">
                    {selectedEvent == null ? 'Create' : 'Save'}
                  </Button>
                </ModalFooter>
              </Form>
            );
          }}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
