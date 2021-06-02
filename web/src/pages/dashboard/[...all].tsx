import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DashboardFallback() {
  const { push, asPath } = useRouter();

  useEffect(() => {
    const path = asPath.replace('/dashboard', '');

    localStorage.setItem('@d_path', path);

    push('/dashboard');
  }, [asPath]);

  return null;
}
