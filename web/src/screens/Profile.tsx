import React from 'react';
import { Flex } from '@chakra-ui/layout';
import { useQueryClient } from 'react-query';
import { QUERY_KEYS } from '@globalStore/server/queryKeys';
import { AppDefaultLayoutDesktop } from '@components/Layout/AppDefaultLayoutDesktop';
import { NavigationSideBar } from '@components/Navigation/App/NavigationSideBar';
import { ModifyProfileForm } from '@components/AuthForm/ModifyProfileForm';
import { User } from '@types';
import { LoadingUI } from '@components/UI/LoadingUI';
import { useTokenStore } from '@globalStore/client/useTokenStore';
import { HeadController } from '@components/HeadController';

export function Profile() {
  const queryClient = useQueryClient();
  const token = useTokenStore((s) => s.accessToken);
  const user = queryClient.getQueryData<User>(QUERY_KEYS.currentUser);

  if (user == null) {
    return <LoadingUI />;
  }

  const { avatar, displayName } = user;

  return (
    <AppDefaultLayoutDesktop>
      <HeadController
        title="Profile - app"
        description="Profile screen in procrastination"
      />
      <NavigationSideBar avatar={avatar} placeholder={displayName || ''} />
      <Flex flex="1 1 0" justifyContent="center" alignItems="center">
        <ModifyProfileForm
          user={user}
          token={token}
          queryClient={queryClient}
        />
      </Flex>
    </AppDefaultLayoutDesktop>
  );
}
