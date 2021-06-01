import { useRouter } from 'next/router';
import { HeaderController } from '@components/HeadController';
import { SignUpForm } from '@components/AuthForm/SignupForm';
import { Flex } from '@chakra-ui/react';

export default function SignUp({}) {
  return (
    <>
      <HeaderController
        title="Login"
        description="This is a procrastination auth page"
      />
      <Flex
        minH="100vh"
        minW="100%"
        justifyContent="center"
        alignItems="center"
      >
        <SignUpForm />
      </Flex>
    </>
  );
}
