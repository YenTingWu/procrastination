import React from 'react';
import { useInitialCurrentUser } from '@hooks/useInitialCurrentUser';
import Routes from './Routes';
import { LoadingUI } from '@components/LoadingUI';

/**
 * This component is an entry point for procrastination app
 */

const App = () => {
  const { isLoading } = useInitialCurrentUser();

  if (isLoading) {
    return <LoadingUI />;
  }

  return <Routes />;
};

export default App;
