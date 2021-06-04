import React from 'react';
import App from '@screens/App';
import { useMounted } from '@hooks/useMounted';

/**
 * For provider
 */

export default function Index() {
  const { hasMounted } = useMounted();

  if (!hasMounted) {
    return null;
  }

  return <App />;
}
