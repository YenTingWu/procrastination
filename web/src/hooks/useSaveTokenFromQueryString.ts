import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTokenStore } from '@globalStore/useTokenStore';

export const useSaveTokenFromQueryString = () => {
  const { query: params, push } = useRouter();

  useEffect(() => {
    if (
      typeof params.accessToken === 'string' &&
      typeof params.refreshToken === 'string' &&
      params.accessToken &&
      params.refreshToken
    ) {
      try {
        useTokenStore.getState().setTokens({
          accessToken: params.accessToken,
          refreshToken: params.refreshToken,
        });
      } catch {}

      setTimeout(() => push('/calender'), 100);
    }
  }, [params, push]);
};
