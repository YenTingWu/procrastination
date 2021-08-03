import React from 'react';
import * as yup from 'yup';
import axios from 'axios';
import { useFormik, FormikHelpers } from 'formik';
import { Flex, Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { StyledForm, SocialLoginType } from './SigninForm';
import { useDebounceCallback } from '@hooks/useDebounceCallback';
import { FormLabelInputUI } from '@components/Form/FormLabelInputUI';
import { LogoButton } from '@components/Form/LogoButton';
import { GoogleIcon } from '@components/Icon';
import { API_BASE_URL } from '../../config';

type SignUpFormInput = {
  email: string;
  password: string;
  displayName: string;
};

interface SignUpFormProps {}

/**
 * ## SignUpForm
 * @returns React.FC
 */

export const SignUpForm: React.FC<SignUpFormProps> = () => {
  const handleSocialLoginLogin = useDebounceCallback(
    async (socialLoginType: SocialLoginType) => {
      const res = await axios({
        baseURL: API_BASE_URL,
        url: `/auth/${socialLoginType}/web`,
        method: 'POST',
      });

      window.location.href = res.data.url;
    },
    400,
    []
  );

  const handleSignUnButtonClick = useDebounceCallback(
    async (
      { email, password }: SignUpFormInput,
      { setSubmitting }: FormikHelpers<SignUpFormInput>
    ) => {
      try {
        const res = await axios({
          baseURL: API_BASE_URL,
          url: `/auth/register`,
          method: 'POST',
          params: {
            email,
            password,
          },
        });

        window.location.href = res.request.responseURL;
      } catch (err) {
        console.log(err);
      }

      setSubmitting(false);
    },
    400,
    []
  );

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    } as SignUpFormInput,
    validationSchema: yup.object({
      email: yup
        .string()
        .email()
        .required('Missing email, password, or display name'),
      password: yup
        .string()
        .min(8, 'At least 8 characters or more')
        .max(72, 'Limit 72 characters')
        .required('Missing email, password, or display name'),
    }),
    onSubmit: handleSignUnButtonClick,
  });
  return (
    <Flex
      w="100%"
      maxW="390px"
      boxShadow="1px 0px 10px 2px rgba(0, 0, 0, 0.2)"
      borderRadius={10}
      flexDirection="column"
      alignItems="center"
      padding="76px 60px"
    >
      <LogoButton
        logo={<GoogleIcon />}
        title="Sign Up with Google"
        onClick={() => handleSocialLoginLogin(SocialLoginType.GOOGLE)}
      />

      <Box as="span" my="15px" fontWeight="extrabold" color="gray.400">
        OR
      </Box>
      <StyledForm onSubmit={formik.handleSubmit}>
        <FormLabelInputUI
          name="email"
          label="Email"
          htmlFor="email"
          type="email"
          id="email"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        <FormLabelInputUI
          name="password"
          label="Password"
          htmlFor="password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        <Flex mt="78px">
          <Button
            bg="#2D3748"
            color="white"
            type="submit"
            flex="1"
            h="50"
            ml="5"
            m="auto"
            isLoading={formik.isSubmitting}
            _hover={{
              bg: '#485874',
            }}
          >
            Sign Up
          </Button>
        </Flex>
      </StyledForm>
    </Flex>
  );
};
