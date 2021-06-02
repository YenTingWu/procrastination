import React from 'react';
import { useInitialCurrentUser } from '@hooks/useInitialCurrentUser';
import Routes from './Routes';
import { LoadingUI } from '@components/LoadingUI';

const App = () => {
  const { isLoading, data } = useInitialCurrentUser();

  if (isLoading) {
    return <LoadingUI />;
  }

  return (
    <>
      <Routes />
      <div>{data}</div>
    </>
  );
};

export default App;
