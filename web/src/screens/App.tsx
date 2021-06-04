import React from 'react';
import { useInitialCurrentUser } from '@hooks/useInitialCurrentUser';
import Routes from './Routes';
import { LoadingUI } from '@components/LoadingUI';

/**
 * This component is an entry point for procrastination app
 */

const App = () => {
  const { isLoading, data } = useInitialCurrentUser();

  if (isLoading) {
    return <LoadingUI />;
  }

  console.log(data);

  return (
    <>
      <Routes />
      <div>{data ? 'Gotcha' : 'Nothing'}</div>
    </>
  );
};

export default App;
