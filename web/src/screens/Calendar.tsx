import React, { useState, useMemo, useCallback } from 'react';
import { useQueryClient } from 'react-query';
// compareAsc(a, b)
// a > b => 1
// a < b => -1
// a === b => 0
import compareAsc from 'date-fns/compareAsc';
import isToday from 'date-fns/isToday';
import { User } from '@types';
import { createDailyEventFreeTimeSchedules } from '@lib/createDailyEventFreeTimeSchedule';
import { AppDefaultLayoutDesktop } from '@components/Layout/AppDefaultLayoutDesktop';
import { NavigationSideBar } from '@components/NavigationSideBar';
import { useDisclosure } from '@chakra-ui/react';
import { LoadingUI } from '@components/LoadingUI';
import { DailyScheduleShowcase } from '@components/ScheduleShowcase/DailyScheduleShowcase';
import { ManipulateEventModal } from '@components/Modal/ManipulateEventModal';

/**
 *
 * @returns
 */

interface CalendarProps {}

export const Calendar: React.FC<CalendarProps> = ({}) => {
  const user = useQueryClient().getQueryData<User>('currentUser');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSelectEvent = useCallback((id: string) => {
    onOpen();
    setSelectedEventId(id);
  }, []);
  const handleUnselectEvent = useCallback(() => {
    onClose();
    setSelectedEventId(null);
  }, []);

  if (user == null) {
    return <LoadingUI />;
  }

  const { avatar, displayName, calendars } = user;

  const { events } = calendars[0];

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
        .sort((a, b) => {
          return compareAsc(a.startTime, b.startTime);
        }),
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
        onSelectEvent={handleSelectEvent}
        schedules={schedules}
      />

      {(isOpen || selectedEventId) && (
        <ManipulateEventModal
          isOpen={isOpen}
          onClose={handleUnselectEvent}
          selectedEvent={selectedSchedule || null}
        />
      )}
    </AppDefaultLayoutDesktop>
  );
};

/**
 * 1. Time besides the event
 * 2. Click schedule to show create-event modal
 * 3. Modal can create an event and modify an event
 * 4. todo list showcase beside the schedule list
 * 5. listItem in todo list should be draggable
 *
 */
