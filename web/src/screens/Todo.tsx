import React, { useState, useMemo, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useDisclosure } from '@chakra-ui/react';
import { useEventDeleteMutation } from '@globalStore/server/useEventMutation';
import { QUERY_KEYS } from '@globalStore/server/queryKeys';
import { useTokenStore } from '@globalStore/client/useTokenStore';
import { AppDefaultLayoutDesktop } from '@components/Layout/AppDefaultLayoutDesktop';
import { NavigationSideBar } from '@components/NavigationSideBar';
import { LoadingUI } from '@components/LoadingUI';
import { DroppableTodoMainSection } from '@components/D&D/DroppableTodoMainSection';
import { ConfirmModal } from '@components/Modal/ConfirmModal';
import { CreateTodoModal } from '@components/Modal/CreateTodoModal';
import { User } from '@types';

export function Todo() {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>(QUERY_KEYS.currentUser);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const token = useTokenStore((s) => s.accessToken);
  const {
    isOpen: isConfirmModalOpen,
    onClose: onConfirmModalClose,
    onOpen: onConfirmModalOpen,
  } = useDisclosure();

  const {
    isOpen: isManipulateTodoModalOpen,
    onClose: onManipulateTodoModalClose,
    onOpen: onManipulateTodoModalOpen,
  } = useDisclosure();

  const {
    isLoading: isDeletingEventLoading,
    mutate: eventDeleteMutate,
  } = useEventDeleteMutation(queryClient);

  const handleConfirmModalOpen = useCallback((id: string) => {
    setSelectedTodoId(id);
    onConfirmModalOpen();
  }, []);

  const handleConfirmModalClose = useCallback(() => {
    setSelectedTodoId(null);
    onConfirmModalClose();
  }, []);

  const handleManipulateTodoModalOpen = useCallback((uuid?: string) => {
    if (uuid) setSelectedTodoId(uuid);
    onManipulateTodoModalOpen();
  }, []);

  const handleManipulateTodoModalClose = useCallback(() => {
    onManipulateTodoModalClose();
    setSelectedTodoId(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (selectedTodoId == null) return;
    try {
      await eventDeleteMutate({ token, id: selectedTodoId });
    } catch (err) {
      console.log(err);
    }
    handleConfirmModalClose();
  }, [selectedTodoId, token, eventDeleteMutate]);

  if (!user) {
    return <LoadingUI />;
  }

  const { avatar, displayName, calendars } = user;
  const { events, uuid } = calendars[0];
  const todoList = useMemo(
    () => events.filter(({ type }) => type === 'to_do'),
    [events]
  );

  const selectedTodo = useMemo(
    () => todoList.find(({ uuid }) => uuid === selectedTodoId) || null,
    [todoList, selectedTodoId]
  );

  return (
    <AppDefaultLayoutDesktop>
      <NavigationSideBar avatar={avatar || ''} placeholder={displayName} />
      <DroppableTodoMainSection
        queryClient={queryClient}
        todoList={todoList}
        calendarUid={uuid}
        modalControllers={{
          onManipulateTodoModalOpen: handleManipulateTodoModalOpen,
          onConfirmModalOpen: handleConfirmModalOpen,
        }}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleConfirmModalClose}
        onConfirm={handleConfirm}
        isLoading={isDeletingEventLoading}
        content={'Would you like to delete the event?'}
      />
      <CreateTodoModal
        isOpen={isManipulateTodoModalOpen}
        onClose={handleManipulateTodoModalClose}
        calendarUid={uuid}
        selectedEvent={selectedTodo}
      />
    </AppDefaultLayoutDesktop>
  );
}
