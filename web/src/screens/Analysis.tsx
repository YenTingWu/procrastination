import React from 'react';
import { useQueryClient } from 'react-query';
import { Flex } from '@chakra-ui/react';
import { AppDefaultLayoutDesktop } from '@components/Layout/AppDefaultLayoutDesktop';
import { NavigationSideBar } from '@components/NavigationSideBar';
import { LoadingUI } from '@components/LoadingUI';
import { AnalysisTable } from '@components/AnalysisTable';
import { BidirectionalSlider } from '@components/Slider/BidirectionalSlider';
import { EventStatus, User } from '@types';
import { QUERY_KEYS } from '@globalStore/server/queryKeys';

export function Analysis() {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>(QUERY_KEYS.currentUser);

  if (user == null) {
    return <LoadingUI />;
  }

  const { displayName, avatar, calendars } = user;
  const { uuid, events } = calendars[0];

  const completedEvents = events.filter(
    ({ status }) => status === EventStatus.COMPLETED
  );

  return (
    <AppDefaultLayoutDesktop>
      <NavigationSideBar placeholder={displayName} avatar={avatar} />
      <Flex
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        flex="1"
        minH="100vh"
      >
        <AnalysisTable completedEvents={completedEvents} />
        <BidirectionalSlider />
      </Flex>
    </AppDefaultLayoutDesktop>
  );
}
