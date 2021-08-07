import React from 'react';
import NextLink from 'next/link';
import * as yup from 'yup';
import axios from 'axios';
import styled from '@emotion/styled';
import { FormikHelpers, useFormik } from 'formik';
import { useDebounceCallback } from '@hooks/useDebounceCallback';
import { Flex, Box, Link } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { LogoButton } from '@components/Form/LogoButton';
import { FormLabelInputUI } from '@components/Form/FormLabelInputUI';
import { GoogleIcon } from '@components/Icon';
import { API_BASE_URL } from '../../config';
import { SocialLoginType } from '@types';
import { handleSocialLogin as onSocialLogin } from '@lib/handleSocialLogin';

export const StyledForm = styled.form`
  max-width: 276px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

type SignInFormInput = {
  email: string;
  password: string;
};

export interface SignInFormProps {}

/**
 * ## SignInForm
 * @returns React.FC
 */

export const SignInForm: React.FC<SignInFormProps> = () => {
  // TODO: Find a way to bypass cors
  const handleSocialLogin = useDebounceCallback(
    async (socialLoginType: SocialLoginType) => onSocialLogin(socialLoginType),
    400,
    []
  );

  const handleSignInButtonClick = useDebounceCallback(
    async (
      { email, password }: SignInFormInput,
      { setSubmitting }: FormikHelpers<SignInFormInput>
    ) => {
      try {
        const res = await axios({
          baseURL: API_BASE_URL,
          url: `/auth/login`,
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
    } as SignInFormInput,
    validationSchema: yup.object({
      email: yup.string().email().required('Missing Email'),
      password: yup
        .string()
        .min(8, 'At least 8 characters or more')
        .max(72, 'Limit 72 characters'),
    }),
    onSubmit: handleSignInButtonClick,
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
        title="Sign In with Google"
        onClick={() => handleSocialLogin(SocialLoginType.GOOGLE)}
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
          autoComplete="current-password"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        <Flex justify="center" my="27px">
          <NextLink href="/" as="/" passHref>
            <Link color="black" fontWeight="extrabold">
              Forgot Password?
            </Link>
          </NextLink>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex as="span" flex="1" justifyContent="center" mr="5">
            <NextLink href="/signup" passHref>
              <Link color="black" fontWeight="extrabold">
                Sign Up
              </Link>
            </NextLink>
          </Flex>
          <Button
            bg="#2D3748"
            color="white"
            float="right"
            type="submit"
            flex="1"
            h="50"
            ml="5"
            isLoading={formik.isSubmitting}
            _hover={{
              bg: '#485874',
            }}
          >
            Sign In
          </Button>
        </Flex>
      </StyledForm>
    </Flex>
  );
};
