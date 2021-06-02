import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTokenStore } from '@globalStore/useTokenStore';

export const useSaveTokenFromQueryString = () => {
  const { query: params, push } = useRouter();

  /**
   * Check if tokens are in url params
   * If both tokens exist,
   * stores refreshToken in cookie,
   * and stores accessToken in localStorage
   */
  useEffect(() => {
    if (typeof params.accessToken === 'string' && params.accessToken) {
      try {
        useTokenStore.getState().setTokens({
          accessToken: params.accessToken,
        });
      } catch {}

      setTimeout(() => push('/dashboard'), 100);
    }
  }, [params, push]);
};
