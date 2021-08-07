import React, { useState, useMemo, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useDisclosure } from '@chakra-ui/hooks';
import { QUERY_KEYS } from '@globalStore/server/queryKeys';
// compareAsc(a, b)
// a > b => 1
// a < b => -1
// a === b => 0
import compareAsc from 'date-fns/compareAsc';
import isToday from 'date-fns/isToday';
import { User } from '@types';
import { createDailyEventFreeTimeSchedules } from '@lib/createDailyEventFreeTimeSchedule';
import { AppDefaultLayoutDesktop } from '@components/Layout/AppDefaultLayoutDesktop';
import { NavigationSideBar } from '@components/Navigation/App/NavigationSideBar';
import { LoadingUI } from '@components/UI/LoadingUI';
import { DailyScheduleShowcase } from '@components/ScheduleShowcase/DailyScheduleShowcase';
import { ManipulateEventModal } from '@components/Modal/ManipulateEventModal';
import { ConfirmModal } from '@components/Modal/ConfirmModal';
import { useTokenStore } from '@globalStore/client/useTokenStore';
import { useEventDeleteMutation } from '@globalStore/server/useEventMutation';
import { HeadController } from '@components/HeadController';

/**
 * ## Calendar
 * calendar app entry component
 * @returns React.FC
 */

interface CalendarProps {}

export const Calendar: React.FC<CalendarProps> = ({}) => {
  /*
    #####                               #     #
   #     # #####   ##   ##### ######    #     #  ####   ####  #    #  ####
   #         #    #  #    #   #         #     # #    # #    # #   #  #
    #####    #   #    #   #   #####     ####### #    # #    # ####    ####
         #   #   ######   #   #         #     # #    # #    # #  #        #
   #     #   #   #    #   #   #         #     # #    # #    # #   #  #    #
    #####    #   #    #   #   ######    #     #  ####   ####  #    #  ####
  */

  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>(QUERY_KEYS.currentUser);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const token = useTokenStore((s) => s.accessToken);

  const {
    mutate: deleteEventMutate,
    isLoading: isDeletingEventLoading,
  } = useEventDeleteMutation(queryClient);

  /**
            ███╗   ███╗ ██████╗ ██████╗  █████╗ ██╗
            ████╗ ████║██╔═══██╗██╔══██╗██╔══██╗██║
            ██╔████╔██║██║   ██║██║  ██║███████║██║
            ██║╚██╔╝██║██║   ██║██║  ██║██╔══██║██║
            ██║ ╚═╝ ██║╚██████╔╝██████╔╝██║  ██║███████╗
            ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
   */

  const {
    isOpen: isModifyEventModalOpen,
    onOpen: onModifyEventModalOpen,
    onClose: onModifyEventModalClose,
  } = useDisclosure();

  const {
    isOpen: isConfirmModalOpen,
    onOpen: onConfirmModalOpen,
    onClose: onConfirmModalClose,
  } = useDisclosure();

  const handleEventModalOpen = useCallback((value: string | null) => {
    if (value) setSelectedEventId(value);
    onModifyEventModalOpen();
  }, []);
  const handleEventModalClose = useCallback(() => {
    onModifyEventModalClose();
    setSelectedEventId(null);
  }, []);

  const handleConfirmModalOpen = useCallback((uuid?: string) => {
    if (uuid) setSelectedEventId(uuid);
    onConfirmModalOpen();
  }, []);

  const handleConfirmModalClose = useCallback(() => {
    onConfirmModalClose();
    setSelectedEventId(null);
  }, []);

  const handleConfirmClick = useCallback(() => {
    if (selectedEventId == null) return;
    deleteEventMutate({ id: selectedEventId, token });
    handleConfirmModalClose();
  }, [selectedEventId, token]);

  if (user == null) {
    return <LoadingUI />;
  }

  /*
    #####    ##   #####   ##       ####   ####  #    # ##### #####   ####  #      #
    #    #  #  #    #    #  #     #    # #    # ##   #   #   #    # #    # #      #
    #    # #    #   #   #    #    #      #    # # #  #   #   #    # #    # #      #
    #    # ######   #   ######    #      #    # #  # #   #   #####  #    # #      #
    #    # #    #   #   #    #    #    # #    # #   ##   #   #   #  #    # #      #
    #####  #    #   #   #    #     ####   ####  #    #   #   #    #  ####  ###### ######
  */

  const { avatar, displayName, calendars } = user;
  const { events, uuid } = calendars[0];

  const sortedEvents = useMemo(
    () =>
      [...events]
        .map((e) => ({
          ...e,
          startTime: new Date(e.startTime),
          endTime: new Date(e.endTime),
          isFree: false,
        }))
        .filter(
          ({ startTime, endTime, type }) =>
            type === 'event' && (isToday(startTime) || isToday(endTime))
        )
        .sort((a, b) => compareAsc(a.startTime, b.startTime)),
    [events]
  );

  const schedules = useMemo(
    () => createDailyEventFreeTimeSchedules(sortedEvents),
    [events]
  );

  const selectedSchedule = useMemo(
    () => schedules.find((s) => s.uuid === selectedEventId) || null,
    [schedules, selectedEventId]
  );

  return (
    <AppDefaultLayoutDesktop>
      <HeadController
        title="Calendar - app"
        description="Calendar screen in procrastination"
      />
      <NavigationSideBar avatar={avatar} placeholder={displayName} />
      <DailyScheduleShowcase
        onDeleteButtonClick={handleConfirmModalOpen}
        onSelectEvent={handleEventModalOpen}
        schedules={schedules}
      />

      {isModifyEventModalOpen && (
        <ManipulateEventModal
          isOpen={isModifyEventModalOpen}
          calendarUid={uuid}
          onClose={handleEventModalClose}
          selectedEvent={selectedSchedule || null}
        />
      )}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleConfirmModalClose}
        onConfirm={handleConfirmClick}
        content={'Would you like to delete the event?'}
        isLoading={isDeletingEventLoading}
      />
    </AppDefaultLayoutDesktop>
  );
};

/**
 * 1. Time besides the event Ｘ
 * 2. Click schedule to show create-event modal X
 * 3. Modal can create an event and modify an event X
 * 4. todo list showcase beside the schedule list
 * 5. listItem in todo list should be draggable
 *
 */
