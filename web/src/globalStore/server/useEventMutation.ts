import axios from 'axios';
import { useMutation } from 'react-query';
import type { QueryClient } from 'react-query';
import { API_BASE_URL } from '../../config';
import { QUERY_KEYS } from './queryKeys';

function fetchDeleteData(uuid: string, token: string) {
  return axios({
    method: 'DELETE',
    baseURL: API_BASE_URL,
    url: `/event/e/${uuid}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}

export function useEventDeleteMutation(queryClient: QueryClient) {
  return useMutation(
    ({ id, token }: { id: string; token: string }) =>
      fetchDeleteData(id, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.currentUser);
      },
      onError: (err, _) => {
        console.error(err);
      },
      onSettled: () => {
        queryClient.invalidateQueries(QUERY_KEYS.currentUser);
      },
    }
  );
}
