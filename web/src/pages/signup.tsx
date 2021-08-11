import React from 'react';
import { HeadController } from '@components/HeadController';
import { PageDefaultLayout } from '@components/Layout/PageDefaultLayout';
import { SignUpForm } from '@components/AuthForm/SignupForm';
import { Flex } from '@chakra-ui/layout';
import { LoadingUI } from '@components/UI/LoadingUI';
import { useCheckTokenToNavigateDashboard } from '@hooks/useCheckTokenToNavigateDashboard';

export default function SignUp({}) {
  const { isCheckedToken } = useCheckTokenToNavigateDashboard();

  if (!isCheckedToken) {
    return <LoadingUI />;
  }
  return (
    <PageDefaultLayout>
      <HeadController
        title="Sign Up"
        description="This is a procrastination auth page"
      />
      <Flex as="main" minH="80vh" alignItems="center">
        <SignUpForm />
      </Flex>
    </PageDefaultLayout>
  );
}
