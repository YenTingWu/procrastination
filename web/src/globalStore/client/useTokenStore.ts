import create from 'zustand';
import { combine } from 'zustand/middleware';
import { isServer } from '@lib/isServer';

const accessToken = '@procrastination/token';

const getDefaultValues = () => {
  // Check tokens are already exists or not
  if (!isServer) {
    try {
      return {
        accessToken: localStorage.getItem(accessToken) || '',
      };
    } catch {}
  }

  return {
    accessToken: '',
  };
};

export const useTokenStore = create(
  combine(getDefaultValues(), (set) => ({
    setTokens: (x: { accessToken: string }) => {
      try {
        localStorage.setItem(accessToken, x.accessToken);
      } catch {}

      set(x);
    },
  }))
);
