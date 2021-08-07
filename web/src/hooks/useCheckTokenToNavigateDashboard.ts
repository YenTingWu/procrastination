import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTokenStore } from '@globalStore/client/useTokenStore';

export const useCheckTokenToNavigateDashboard = () => {
  const hasTokens = useTokenStore((s) => !!s.accessToken);
  const router = useRouter();
  const { push } = router;
  const [isCheckedToken, setCheckedToken] = useState<boolean>(false);

  useEffect(() => {
    if (hasTokens) {
      push('/dashboard');
    } else {
      setCheckedToken(true);
    }
  }, [push]);

  return {
    ...router,
    hasTokens,
    isCheckedToken,
  };
};
