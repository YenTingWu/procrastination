import axios from 'axios';
import { API_BASE_URL } from '../config';

/**
 * ## revokeRefreshToken
 * @returns accessToken: Promise<string>
 */

export const revokeRefreshToken = async (): Promise<string> => {
  const { data } = await axios({
    method: 'GET',
    baseURL: API_BASE_URL,
    url: '/auth/refresh_token',
    withCredentials: true,
  });

  if (data?.accessToken) {
    return data.accessToken;
  }

  return '';
};
