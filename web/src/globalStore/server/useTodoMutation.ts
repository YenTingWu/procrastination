import { useMutation } from 'react-query';
import type { QueryClient } from 'react-query';
import axios from 'axios';
import { EventStatus } from '@types';
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

function fetchPatchUpdateTodoData({
  todoInfo: { uid, updatedStore },
  token,
}: DataParams) {
  return axios({
    method: 'PATCH',
    baseURL: API_BASE_URL,
    url: '/event/todo',
    headers: {
      authorization: `Bearer ${token}`,
    },
    data: {
      uid,
      updatedStore,
    },
  });
}

export function useTodoUpdateMutation(queryClient: QueryClient) {
  return useMutation(fetchPatchUpdateTodoData, {
    // If success, sync the
    onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.currentUser),
  });
}
