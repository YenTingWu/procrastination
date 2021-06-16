import React, {
  useReducer,
  useCallback,
  useRef,
  useMemo,
  Reducer,
} from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Input,
  Select,
  FormLabel,
  Box,
  Divider,
} from '@chakra-ui/react';
import axios from 'axios';
import { useField, Formik, FormikProps, Form, FormikHelpers } from 'formik';
import * as yup from 'yup';
import format from 'date-fns/fp/format';
import { useQueryClient } from 'react-query';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import {
  FormLabelInputUI,
  FormLabelTextareaUI,
} from '@components/AuthForm/FormLabelInputUI';
import { UncontrolledMonthlyDatePicker } from '@components/DatePicker/UncontrolledMonthlyDatePicker';
import { createDailyTimeRangeArray } from '@lib/createDailyTimeRangeArray';
import { compareFormatHoursMinutes } from '@lib/compareFormatHoursMinutes';
import { getYearObject } from '@lib/getYearObject';
import { useTokenStore } from '@globalStore/client/useTokenStore';
import {
  useSelectDateTimeOpen,
  OpenedPicker,
} from '@globalStore/client/useSelectDateTimeOpen';
import { QUERY_KEYS } from '@globalStore/server/queryKeys';
import { Schedule, DateInfoType } from '@types';
import { API_BASE_URL } from '../../config';

import { useDebounceCallback } from '@hooks/useDebounceCallback';

export type FormState = {
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
};

type DatePickerControllerState = {
  month: number;
  year: number;
};

type DatePickerControllerAction =
  | { type: 'increaseMonth' }
  | { type: 'decreaseMonth' }
  | { type: 'setMonth'; payload: { month: number; year: number } };

const monthlyDatePickerReducer: Reducer<
  DatePickerControllerState,
  DatePickerControllerAction
> = (state, action) => {
  switch (action.type) {
    case 'increaseMonth':
      if (state.month === 11) {
        return {
          month: 0,
          year: state.year + 1,
        };
      }
      return {
        ...state,
        month: state.month + 1,
      };
    case 'decreaseMonth':
      if (state.month === 0) {
        return {
          month: 11,
          year: state.year - 1,
        };
      }
      return {
        ...state,
        month: state.month - 1,
      };
    case 'setMonth':
      return {
        month: action.payload.month,
        year: action.payload.year,
      };

    default:
      throw new Error();
  }
};
interface DateTimePickerInputProps {
  fieldKey: string;
  label: string;
  timeArr: string[];
}

const DateTimePickerInput: React.FC<DateTimePickerInputProps> = ({
  label,
  fieldKey,
  timeArr,
}) => {
  const { openedPicker, setSelectOpenedPicker } = useSelectDateTimeOpen(
    (s) => ({
      openedPicker: s.openedPicker,
      setSelectOpenedPicker: s.setSelectOpenedPicker,
    })
  );
  const [field, _, helpers] = useField(fieldKey);
  const main = useRef<HTMLDivElement>(null);

  const { value }: { value: Date } = field;

  const formattedDate = format('MMM dd, yyyy HH:mm', value);
  const formattedTime = format('HH:mm', value);

  const handleToggleDrop = useCallback(
    (e) => {
      if (main.current == null) return;

      const { children } = main.current;
      let matched = false;

      for (let i = 0; i < children.length; i++) {
        if (children[i] === e.target) matched = true;
      }

      if (!matched) return;

      // setDrop((s) => !s);
      setSelectOpenedPicker(fieldKey as OpenedPicker);
    },
    [main.current, fieldKey]
  );

  // ------------------------- Monthly date picker controller ------------------------- \\
  // Controller of datePicker (control month add and minus)
  const [state, dispatch] = useReducer(monthlyDatePickerReducer, {
    // Initial value
    month: value.getMonth(),
    year: value.getFullYear(),
  });

  const handleAddMonth = useCallback(
    () => dispatch({ type: 'increaseMonth' }),
    []
  );
  const handleMinusMonth = useCallback(
    () => dispatch({ type: 'decreaseMonth' }),
    []
  );

  // -------------------------- Select Time, Date Controller -------------------------- \\
  const handleSelectDate = useCallback(
    (d: DateInfoType) => {
      const { month, year, date } = d;

      if (month !== state.month) {
        dispatch({ type: 'setMonth', payload: { month, year } });
      }

      const cloneT = new Date(value);
      cloneT.setDate(date);
      cloneT.setMonth(month);
      cloneT.setFullYear(year);
      helpers.setValue(cloneT);
    },
    [state.month, helpers]
  );

  const handleSelectTime = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const splitArr = e.target.value.split(':');
      const hours = parseInt(splitArr[0], 10);
      const minutes = parseInt(splitArr[1], 10);

      if (typeof hours !== 'number' || typeof minutes !== 'number') return;

      const cloneT = new Date(value);
      cloneT.setHours(hours);
      cloneT.setMinutes(minutes);

      helpers.setValue(cloneT);
    },
    [helpers]
  );

  const options = useMemo(
    () =>
      timeArr.reduce((acc, cur, i) => {
        acc.push(
          <option key={cur} value={cur}>
            {cur}
          </option>
        );

        /* If cur < formattedTime < next_value_of_cur */
        /* Then push the formattedTime into accumulator */

        if (
          compareFormatHoursMinutes(formattedTime, cur) === 1 &&
          compareFormatHoursMinutes(timeArr[i + 1], formattedTime) === 1
        ) {
          acc.push(
            <option key={formattedTime} value={formattedTime}>
              {formattedTime}
            </option>
          );
        }
        return acc;
      }, [] as Array<JSX.Element>),
    []
  );

  return (
    <Flex pl={10} pr={10} flexDirection="column" alignItems="center">
      <Flex alignItems="center" ref={main} onClick={handleToggleDrop}>
        <FormLabel
          m="0"
          fontWeight="extrabold"
          flex={'1 150px'}
          _hover={{ cursor: 'pointer' }}
          _selection={{ bg: 'none' }}
        >
          {label}
        </FormLabel>
        <Input
          textAlign="center"
          fontSize="md"
          value={formattedDate}
          disabled
          border={'none'}
          _disabled={{ cursor: 'pointer' }}
          _hover={{ cursor: 'pointer' }}
          _selection={{ bg: 'none' }}
        />
      </Flex>
      {(fieldKey as OpenedPicker) === openedPicker && (
        <>
          <Divider />
          <Flex alignSelf="stretch" alignItems="center">
            <UncontrolledMonthlyDatePicker
              flex={'3 40px'}
              monthInfo={{
                month: state.month,
                year: state.year,
              }}
              selectedDate={getYearObject(value)}
              onAddMonth={handleAddMonth}
              onMinusMonth={handleMinusMonth}
              onSelectDate={handleSelectDate}
            />
            <Select
              ml="5"
              flex={'1 30px'}
              variant="flushed"
              defaultValue={formattedTime}
              onChange={handleSelectTime}
            >
              {options}
            </Select>
          </Flex>
        </>
      )}
    </Flex>
  );
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
  const timeArr = useMemo(() => createDailyTimeRangeArray(), []);
  const token = useTokenStore((s) => s.accessToken);
  const queryClient = useQueryClient();

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
          url: '/event',
          headers: {
            authorization: `Bearer ${token}`,
          },
          data: {
            event: {
              ...values,
              calendarUid,
              expectedDuration,
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
          url: `/event/${selectedEvent?.uuid || ''}`,
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
                      timeArr={timeArr}
                      fieldKey="startTime"
                      label="Start Time"
                    />
                    <DateTimePickerInput
                      timeArr={timeArr}
                      fieldKey="endTime"
                      label="End Time"
                    />
                  </Box>
                </ModalBody>

                <ModalFooter>
                  <Button mr={3} variant="ghost" onClick={onClose}>
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
