import { HeadController } from '@components/HeadController';
import { AppDefaultLayoutDesktop } from '@components/Layout/AppDefaultLayoutDesktop';
import { SignInForm } from '@components/AuthForm/SigninForm';

export default function SignIn({}) {
  return (
    <AppDefaultLayoutDesktop center={true}>
      <HeadController
        title="Sign In"
        description="This is a procrastination auth page"
      />
      <SignInForm />
    </AppDefaultLayoutDesktop>
  );
}
