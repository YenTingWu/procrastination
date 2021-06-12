import React, {
  useState,
  useReducer,
  useCallback,
  useRef,
  Reducer,
  useMemo,
} from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
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
import { useField, Formik, FormikProps, Form } from 'formik';
import * as yup from 'yup';
import format from 'date-fns/fp/format';
import { FormLabelInputUI } from '@components/AuthForm/FormLabelInputUI';
import { UncontrolledMonthlyDatePicker } from '@components/DatePicker/UncontrolledMonthlyDatePicker';
import { createDailyTimeRangeArray } from '@lib/createDailyTimeRangeArray';
import { compareFormatHoursMinutes } from '@lib/compareFormatHoursMinutes';
import { Schedule, DateInfoType } from '@types';

type FormState = {
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

function getYearInfoObject(d: Date) {
  return {
    year: d.getFullYear(),
    month: d.getMonth(),
    date: d.getDate(),
  };
}

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
  const [isDrop, setDrop] = useState<boolean>(false);
  const [field, _, helpers] = useField(fieldKey);
  const main = useRef<HTMLDivElement>(null);

  const { value }: { value: Date } = field;

  const formattedDate = format('dd / MMM, yyyy HH:mm', value);
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

      setDrop((s) => !s);
    },
    [main.current]
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
    [state.month]
  );

  const handleSelectTime = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const splitArr = e.target.value.split(':');
    const hours = parseInt(splitArr[0], 10);
    const minutes = parseInt(splitArr[1], 10);

    if (typeof hours !== 'number' || typeof minutes !== 'number') return;

    const cloneT = new Date(value);
    cloneT.setHours(hours);
    cloneT.setMinutes(minutes);

    helpers.setValue(cloneT);
  };

  const options: JSX.Element[] = useMemo(() => {
    let arr: JSX.Element[] = [];

    timeArr.forEach((time, i) => {
      arr.push(
        <option key={time} value={time}>
          {time}
        </option>
      );

      if (
        compareFormatHoursMinutes(formattedTime, time) === 1 &&
        compareFormatHoursMinutes(timeArr[i + 1], formattedTime) === 1
      ) {
        arr.push(
          <option selected key={formattedTime} value={formattedTime}>
            {formattedTime}
          </option>
        );
      }
    });
    return arr;
  }, []);

  return (
    <Flex pl={10} pr={10} gap={10} flexDirection="column" alignItems="center">
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
      {isDrop && (
        <>
          <Divider />
          <Flex alignSelf="stretch" alignItems="center">
            <UncontrolledMonthlyDatePicker
              flex={'3 40px'}
              monthInfo={{
                month: state.month,
                year: state.year,
              }}
              selectedDate={getYearInfoObject(value)}
              onAddMonth={handleAddMonth}
              onMinusMonth={handleMinusMonth}
              onSelectDate={handleSelectDate}
            />
            <Select
              ml="5"
              flex={'1 30px'}
              variant="flushed"
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
}

/**
 * ## ManipulateEventModal
 * @param props { isOpen, onClose, selectedEvent }
 * @returns
 */

export const ManipulateEventModal: React.FC<ManipulateEventModalProps> = ({
  isOpen = true,
  onClose,
  selectedEvent,
}) => {
  const handleSelectStartDate = ({ year, month, date }: DateInfoType) => {};

  const timeArr = useMemo(() => createDailyTimeRangeArray(), []);

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
          onSubmit={console.log}
        >
          {(props: FormikProps<FormState>) => {
            return (
              <Form>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormLabelInputUI
                    name="name"
                    label="Event Name"
                    value={props.values.name}
                    onChange={props.handleChange}
                  />

                  <FormLabelInputUI
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
                  <Button colorScheme="blue">Secondary Action</Button>
                </ModalFooter>
              </Form>
            );
          }}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
