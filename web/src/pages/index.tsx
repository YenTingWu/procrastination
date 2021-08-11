import React from 'react';

import { useSaveTokenFromQueryString } from '@hooks/useSaveTokenFromQueryString';
import { HeadController } from '@components/HeadController';
import { LoadingUI } from '@components/UI/LoadingUI';
import { HomeMainSection } from '@components/Section/Home';
import { PageDefaultLayout } from '@components/Layout/PageDefaultLayout';
import { useCheckTokenToNavigateDashboard } from '@hooks/useCheckTokenToNavigateDashboard';

export default function Home({}) {
  const { hasParams } = useSaveTokenFromQueryString();
  const { isCheckedToken } = useCheckTokenToNavigateDashboard();

  if (!isCheckedToken || hasParams) {
    return <LoadingUI />;
  }

  return (
    <PageDefaultLayout>
      <HeadController
        title="Home"
        description="This is a procrastination landing page"
      />
      <HomeMainSection />
    </PageDefaultLayout>
  );
}
