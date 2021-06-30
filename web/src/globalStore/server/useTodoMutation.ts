import { useMutation } from 'react-query';
import type { QueryClient } from 'react-query';
import axios from 'axios';
import { Event, EventStatus } from '@types';
import { API_BASE_URL } from 'src/config';
import { QUERY_KEYS } from './queryKeys';

type UpdatableField = {
  name: string;
  description: string;
  expectedDuration: number;
  duration: number;
  status: EventStatus;
};

type DataParams = {
  todoInfo: {
    uid: string;
    updatedStore: Partial<UpdatableField>;
  };
  token: string;
};

async function fetchPatchModifyTodoData({
  todoInfo: { uid, updatedStore },
  token,
}: DataParams) {
  return axios({
    method: 'PATCH',
    baseURL: API_BASE_URL,
    url: `/event/todo/${uid}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    data: {
      updatedStore,
    },
  });
}

async function fetchPutUpdateTodoData({
  data: { updatedTodoList, calendarUid },
  token,
}: {
  data: { updatedTodoList: Array<Event>; calendarUid: string };
  token: string;
}) {
  return axios({
    method: 'PUT',
    baseURL: API_BASE_URL,
    url: `/event/todo`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    data: {
      calendarUid,
      updatedTodoList,
    },
  });
}

export function useTodoModifyMutation(queryClient: QueryClient) {
  return useMutation(fetchPatchModifyTodoData, {
    // If success, sync the
    onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.currentUser),
  });
}

export function useTodoUpdateMutation(queryClient: QueryClient) {
  return useMutation(fetchPutUpdateTodoData, {
    onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.currentUser),
  });
}
