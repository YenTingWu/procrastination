import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import * as yup from 'yup';
import axios from 'axios';
import { useQueryClient } from 'react-query';
import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
import {
  FormLabelInputUI,
  FormLabelTextareaUI,
} from '@components/Form/FormLabelInputUI';
import { DurationInput } from '@components/Form/DurationInput';
import { Event } from '@types';
import secondsToHours from 'date-fns/fp/secondsToHours';
import secondsToMins from 'date-fns/fp/secondsToMinutes';
import hoursToSeconds from 'date-fns/fp/hoursToSeconds';
import minsToSeconds from 'date-fns/fp/minutesToSeconds';
import { API_BASE_URL } from 'src/config';
import { useTokenStore } from '@globalStore/client/useTokenStore';
import { QUERY_KEYS } from '@globalStore/server/queryKeys';
import { useDebounceCallback } from '@hooks/useDebounceCallback';

function getExpectedDurationObject(duration?: number) {
  if (!duration) return { hours: 0, mins: 0 };
  const hours = secondsToHours(duration);
  const mins = secondsToMins(duration - hoursToSeconds(hours));

  return {
    hours,
    mins,
  };
}

interface FormState {
  name: string;
  description: string;
  expectedDuration: {
    hours: number;
    mins: number;
  };
}

interface CreateTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: Event | null;
  calendarUid: string;
}

export const CreateTodoModal: React.FC<CreateTodoModalProps> = ({
  isOpen,
  onClose,
  selectedEvent,
  calendarUid,
}) => {
  const queryClient = useQueryClient();
  const token = useTokenStore((s) => s.accessToken);
  const handleSubmit = useDebounceCallback(
    async (value: FormState, _: FormikHelpers<FormState>) => {
      const {
        name,
        description,
        expectedDuration: { mins, hours },
      } = value;
      if (!name || !description || isNaN(hours) || isNaN(mins)) return;
      try {
        await axios({
          method: 'POST',
          baseURL: API_BASE_URL,
          url: '/event/todo',
          headers: {
            authorization: `Bearer ${token}`,
          },
          data: {
            todoInfo: {
              name,
              description,
              calendarUid,
              expectedDuration: hoursToSeconds(hours) + minsToSeconds(mins),
            },
          },
        });
        queryClient.invalidateQueries(QUERY_KEYS.currentUser);
        onClose();
      } catch (err) {
        throw new Error();
      }
    },
    100,
    [token, queryClient, calendarUid]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} onOverlayClick={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Formik
          initialValues={
            {
              name: selectedEvent?.name || '',
              description: selectedEvent?.description || '',
              expectedDuration: getExpectedDurationObject(
                selectedEvent?.expectedDuration
              ),
            } as FormState
          }
          validationSchema={yup.object({
            name: yup.string().required(),
            description: yup.string(),
            expectedDuration: yup.object({
              hours: yup.number().min(0).required(),
              mins: yup.number().min(0).max(60).required(),
            }),
          })}
          onSubmit={handleSubmit}
        >
          {(props: FormikProps<FormState>) => {
            return (
              <Form>
                <ModalHeader fontSize="3xl">
                  {selectedEvent == null ? 'Create a todo' : 'Modify a todo'}
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

                  <DurationInput
                    name="expectedDuration"
                    label="Expected Duration"
                    value={props.values.expectedDuration}
                  />
                </ModalBody>

                <ModalFooter>
                  <Button onClick={onClose} mr={3} variant="ghost">
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
