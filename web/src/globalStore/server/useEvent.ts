import { useMutation } from 'react-query';
import axios from 'axios';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import { useTokenStore } from '@globalStore/client/useTokenStore';
import { API_BASE_URL } from '../../config';
import { FormState } from '@components/Modal/ManipulateEventModal';

const handleEventCreateMutation = (values: FormState) => {
  const token = useTokenStore((s) => s.accessToken);
  const expectedDuration = differenceInSeconds(
    values.endTime,
    values.startTime
  );

  if (expectedDuration <= 0) {
    throw new Error();
  }

  return axios({
    method: 'POST',
    baseURL: API_BASE_URL,
    url: '/event',
    headers: {
      authorization: `Bearer ${token}`,
    },
    data: {
      ...values,
      expectedDuration,
    },
  });
};

const handleEventUpdateMutation = (selectedEventId: string) => (
  values: FormState
) => {
  const token = useTokenStore((s) => s.accessToken);

  const expectedDuration = differenceInSeconds(
    values.endTime,
    values.startTime
  );

  if (expectedDuration <= 0) {
    throw new Error();
  }

  return axios({
    method: 'PUT',
    baseURL: API_BASE_URL,
    url: `/event/${selectedEventId}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    data: {
      ...values,
      expectedDuration,
    },
  });
};

export const useEventCreateMutation = () =>
  useMutation(handleEventCreateMutation);
export const useEventUpdateMutation = (selectedEventId: string) =>
  useMutation(handleEventUpdateMutation(selectedEventId));
