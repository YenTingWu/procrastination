import { HeaderController } from '@components/HeadController';
import { SignInForm } from '@components/AuthForm/SigninForm';
import { Flex } from '@chakra-ui/react';

export default function SignIn({}) {
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
        <SignInForm />
      </Flex>
    </>
  );
}
