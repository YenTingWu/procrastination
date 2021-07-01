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

  const handleChangeSave = async (
    values: FormState,
    helpers: FormikHelpers<FormState>
  ) => {
    if (user == null) return;
    const { displayName, email } = values;

    try {
      await axios({
        baseURL: API_BASE_URL,
        url: `/user/${user.uuid}`,
        method: 'PATCH',
        data: {
          updatedStore: { email, displayName },
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      queryClient.invalidateQueries(QUERY_KEYS.currentUser);
    } catch (err) {
      console.log(err);
    }
    helpers.setSubmitting(false);
  };

  const formik = useFormik<FormState>({
    initialValues: {
      displayName: user?.displayName || '',
      email: user?.email || '',
    },
    validationSchema: yup.object({
      displayName: yup.string(),
      email: yup.string().email(),
    }),
    onSubmit: handleChangeSave,
  });

  if (user == null) {
    return <LoadingUI />;
  }

  const { avatar, displayName } = user;

  return (
    <AppDefaultLayoutDesktop>
      <NavigationSideBar avatar={avatar} placeholder={displayName || ''} />
      <Flex flex="1 1 0" justifyContent="center" alignItems="center">
        <Flex
          maxW="30rem"
          alignItems="center"
          flexDir="column"
          borderColor="blackAlpha.200"
          borderWidth="3px"
          borderRadius="4px"
          padding="4rem 3rem 3rem"
          boxShadow="inner"
          sx={{
            '*::selection': {
              bg: 'none',
            },
          }}
        >
          <Image
            src={avatar}
            alt={displayName}
            crossOrigin={'anonymous'}
            borderRadius="full"
            boxSize="120px"
            fallbackSrc="https://via.placeholder.com/120"
          />

          <StyledForm action="PATCH" onSubmit={formik.handleSubmit}>
            <FormLabelInputUI
              name="displayName"
              label="Display Name"
              value={formik.values.displayName}
              onChange={formik.handleChange}
            />
            <FormLabelInputUI
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            <Button
              isLoading={formik.isSubmitting}
              mt="3rem"
              mb="1.5rem"
              w="50%"
              colorScheme="blue"
              type="submit"
            >
              Save
            </Button>
          </StyledForm>
        </Flex>
      </Flex>
    </AppDefaultLayoutDesktop>
  );
}
