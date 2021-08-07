import React from 'react';
import { useInitialCurrentUser } from '@globalStore/server/useInitialCurrentUser';
import Routes from './Routes';
import { LoadingUI } from '@components/UI/LoadingUI';

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
