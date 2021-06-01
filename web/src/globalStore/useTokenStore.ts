import create from 'zustand';
import { combine } from 'zustand/middleware';
import { isServer } from '../lib/isServer';

const accessToken = '@procrastination/token';
const refreshToken = '@procrastination/refresh_token';

const getDefaultValues = () => {
  // Check tokens are already exists or not
  if (!isServer) {
    try {
      return {
        accessToken: localStorage.getItem(accessToken) || '',
        refreshToken: localStorage.getItem(refreshToken) || '',
      };
    } catch {}
  }

  return {
    accessToken: '',
    refreshToken: '',
  };
};

export const useTokenStore = create(
  combine(getDefaultValues(), (set) => ({
    setTokens: (x: { accessToken: string; refreshToken: string }) => {
      try {
        localStorage.setItem(accessToken, x.accessToken);
        localStorage.setItem(refreshToken, x.refreshToken);
      } catch {}

      set(x);
    },
  }))
);
