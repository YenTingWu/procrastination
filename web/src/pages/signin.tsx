import { HeadController } from '@components/HeadController';
import { PageDefaultLayout } from '@components/Layout/PageDefaultLayout';
import { SignInForm } from '@components/AuthForm/SigninForm';
import { useCheckTokenToNavigateDashboard } from '@hooks/useCheckTokenToNavigateDashboard';
import { Flex } from '@chakra-ui/layout';

export default function SignIn({}) {
  const { isCheckedToken } = useCheckTokenToNavigateDashboard();
  return (
    <PageDefaultLayout>
      <HeadController
        title="Sign In"
        description="This is a procrastination auth page"
      />

      <Flex as="main" minH="80vh" alignItems="center">
        <SignInForm />
      </Flex>
    </PageDefaultLayout>
  );
}
