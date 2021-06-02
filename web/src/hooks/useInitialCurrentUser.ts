import { useQuery } from 'react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useTokenStore } from '@globalStore/useTokenStore';
import { API_BASE_URL } from '../config';
import { revokeRefreshToken } from '../lib/revokeRefreshToken';

async function fetchData(token: string) {
  return axios({
    method: 'GET',
    baseURL: API_BASE_URL,
    url: '/user',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}

export const useInitialCurrentUser = () => {
  const { push } = useRouter();
  const { accessToken, setTokens } = useTokenStore((s) => ({
    accessToken: s.accessToken,
    setTokens: s.setTokens,
  }));

  return useQuery(['currentUser'], async () => {
    try {
      const { data } = await fetchData(accessToken);
      return data;
    } catch (err) {
      /**
       * If the error is Unauthenticated,
       * try to re-grant accessToken by revoking refreshToken
       *
       * If refreshToken is also invalid,
       * remove accessToken and push back to home page
       */

      if (err.response.status === 401) {
        const token = await revokeRefreshToken();

        if (token) {
          setTokens({ accessToken: token });
          const { data } = await fetchData(token);
          return data;
        }

        setTokens({ accessToken: '' });
        push('/');
      } else {
        throw new Error('unable to fetch data');
      }
    }
  });
};
