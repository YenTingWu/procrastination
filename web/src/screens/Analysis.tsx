import React from 'react';
import { useQueryClient } from 'react-query';
import { AppDefaultLayoutDesktop } from '@components/Layout/AppDefaultLayoutDesktop';
import { HeadController } from '@components/HeadController';
import { NavigationSideBar } from '@components/NavigationSideBar';
import { LoadingUI } from '@components/LoadingUI';
import { AnalysisMainSection } from '@components/Analysis/AnalysisMainSection';
import { EventStatus, User } from '@types';
import { QUERY_KEYS } from '@globalStore/server/queryKeys';

export function Analysis() {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>(QUERY_KEYS.currentUser);

  if (user == null) {
    return <LoadingUI />;
  }

  const { displayName, avatar, calendars } = user;
  const { events } = calendars[0];

  const completedEvents = events.filter(
    ({ status }) => status === EventStatus.COMPLETED
  );

  return (
    <AppDefaultLayoutDesktop>
      <HeadController
        title="Analysis - app"
        description="This is a procrastination auth page"
      />
      <NavigationSideBar placeholder={displayName} avatar={avatar} />
      <AnalysisMainSection events={completedEvents} />
    </AppDefaultLayoutDesktop>
  );
}
