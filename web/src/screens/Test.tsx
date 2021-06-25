import React, { useState, useMemo, createContext, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useDisclosure } from '@chakra-ui/react';
import { useEventDeleteMutation } from '@globalStore/server/useEventMutation';
import { useTokenStore } from '@globalStore/client/useTokenStore';
import { AppDefaultLayoutDesktop } from '@components/Layout/AppDefaultLayoutDesktop';
import { NavigationSideBar } from '@components/NavigationSideBar';
import { LoadingUI } from '@components/LoadingUI';
import { DroppableTodoMainSection } from '@components/D&D/DroppableTodoMainSection';
import { ConfirmModal } from '@components/Modal/ConfirmModal';
import { CreateTodoModal } from '@components/Modal/CreateTodoModal';
import { User } from '@types';

interface DeleteButtonClickContext {
  onConfirmModalOpen: (id: string) => void;
}

export const DeleteButtonClickContextStore = createContext(
  {} as DeleteButtonClickContext
);

export function Test() {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>('currentUser');
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const token = useTokenStore((s) => s.accessToken);
  const {
    isOpen: isConfirmModalOpen,
    onClose: onConfirmModalClose,
    onOpen: onConfirmModalOpen,
  } = useDisclosure();

  const {
    isOpen: isCreateTodoModalOpen,
    onClose: onCreateTodoModalClose,
    onOpen: onCreateTodoModalOpen,
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
      <DeleteButtonClickContextStore.Provider
        value={{ onConfirmModalOpen: handleConfirmModalOpen }}
      >
        <NavigationSideBar avatar={avatar || ''} placeholder={displayName} />
        <DroppableTodoMainSection
          queryClient={queryClient}
          todoList={todoList}
          onCreateTodoModalOpen={onCreateTodoModalOpen}
        />
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={handleConfirmModalClose}
          onConfirm={handleConfirm}
          isLoading={isDeletingEventLoading}
          content={'Would you like to delete the event?'}
        />
        <CreateTodoModal
          isOpen={isCreateTodoModalOpen}
          onClose={onCreateTodoModalClose}
          calendarUid={uuid}
          selectedEvent={selectedTodo}
        />
      </DeleteButtonClickContextStore.Provider>
    </AppDefaultLayoutDesktop>
  );
}
