import { useEffect, useState } from 'react';

export const useMounted = () => {
  const [hasMounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    if (!hasMounted) {
      setMounted(true);
    }
  }, []);

  return { hasMounted };
};
