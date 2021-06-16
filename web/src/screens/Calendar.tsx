import React, { useState, useMemo, useCallback } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { useDisclosure } from '@chakra-ui/react';
import { QUERY_KEYS } from '@globalStore/server/queryKeys';
// compareAsc(a, b)
// a > b => 1
// a < b => -1
// a === b => 0
import axios from 'axios';
import compareAsc from 'date-fns/compareAsc';
import isToday from 'date-fns/isToday';
import { User } from '@types';
import { createDailyEventFreeTimeSchedules } from '@lib/createDailyEventFreeTimeSchedule';
import { AppDefaultLayoutDesktop } from '@components/Layout/AppDefaultLayoutDesktop';
import { NavigationSideBar } from '@components/NavigationSideBar';
import { LoadingUI } from '@components/LoadingUI';
import { DailyScheduleShowcase } from '@components/ScheduleShowcase/DailyScheduleShowcase';
import { ManipulateEventModal } from '@components/Modal/ManipulateEventModal';
import { ConfirmModal } from '@components/Modal/ConfirmModal';
import { useTokenStore } from '@globalStore/client/useTokenStore';
import { API_BASE_URL } from 'src/config';

function fetchData(uuid: string, token: string) {
  return axios({
    method: 'DELETE',
    baseURL: API_BASE_URL,
    url: `/event/${uuid}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}

/**
 *
 * @returns
 */

interface CalendarProps {}

export const Calendar: React.FC<CalendarProps> = ({}) => {
  const user = useQueryClient().getQueryData<User>(QUERY_KEYS.currentUser);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const token = useTokenStore((s) => s.accessToken);
  const { mutate, isLoading } = useMutation(
    ({ id, token }: { id: string; token: string }) => fetchData(id, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.currentUser);
      },
    }
  );

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
    mutate({ id: selectedEventId, token });
    handleConfirmModalClose();
  }, [selectedEventId, token]);

  if (user == null) {
    return <LoadingUI />;
  }

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
        .filter(({ startTime }) => isToday(startTime))
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
      <NavigationSideBar
        avatar={avatar || 'https://bit.ly/broken-link'}
        placeholder={displayName || ''}
      />
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
        isLoading={isLoading}
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
