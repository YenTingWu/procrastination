import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useQuery } from 'react-query';
import { useTokenStore } from '@globalStore/useTokenStore';
import { API_BASE_URL } from '../config';
import Routes from './Routes';

const App = () => {
  const [isAccessTokenValid, setAccessTokenValid] = useState<boolean>(true);
  const { accessToken, setTokens } = useTokenStore((s) => ({
    accessToken: s.accessToken,
    setTokens: s.setTokens,
  }));
  const { push } = useRouter();

  // const { isError, isLoading, data } = useQuery(['currentUser'], () =>
  //   axios({
  //     method: 'GET',
  //     baseURL: API_BASE_URL,
  //     url: '/user',
  //     headers: {
  //       authorization: `Bearer ${accessToken}`,
  //     },
  //   })
  // );

  useEffect(() => {
    console.log('useEffect');
    /**
     * Validate the accessToken
     */
    let decode: any;

    try {
      decode = jwtDecode(accessToken) as any;
    } catch {}

    async function getInitialUserData() {
      try {
        const res = await axios({
          method: 'GET',
          baseURL: API_BASE_URL,
          url: '/user',
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(res);
      } catch (err) {
        console.log(err);
        setAccessTokenValid(false);
      }
    }
    async function revokeRefreshToken() {
      const { data } = await axios({
        method: 'GET',
        baseURL: API_BASE_URL,
        url: '/auth/refresh_token',
        withCredentials: true,
      });

      if (data?.accessToken) {
        setTokens({ accessToken: data.accessToken });
      } else {
        setTokens({ accessToken: '' });
        push('/');
      }
    }

    /**
     * If accessToken is invalid, then revoke the refresh token,
     * if not, get InitialUserData
     */

    if (decode?.exp && isAccessTokenValid && decode.exp * 1000 >= Date.now()) {
      getInitialUserData();
    } else {
      revokeRefreshToken();
    }
  }, [isAccessTokenValid]);

  return <Routes />;
};

export default App;
