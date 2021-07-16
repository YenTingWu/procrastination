import React from 'react';
import axios from 'axios';
import { Button, Flex, Image } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { useQueryClient } from 'react-query';
import { FormikHelpers, useFormik } from 'formik';
import * as yup from 'yup';
import { QUERY_KEYS } from '@globalStore/server/queryKeys';
import { AppDefaultLayoutDesktop } from '@components/Layout/AppDefaultLayoutDesktop';
import { NavigationSideBar } from '@components/NavigationSideBar';
import { FormLabelInputUI } from '@components/Form/FormLabelInputUI';
import { ModifyProfileForm } from '@components/AuthForm/ModifyProfileForm';
import { User } from '@types';
import { LoadingUI } from '@components/LoadingUI';
import { API_BASE_URL } from 'src/config';
import { useTokenStore } from '@globalStore/client/useTokenStore';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  padding: 10px 15px 0px;
`;

type FormState = {
  displayName: string;
  email: string;
};

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
