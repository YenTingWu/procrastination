import { HeadController } from '@components/HeadController';
import { AppDefaultLayoutDesktop } from '@components/Layout/AppDefaultLayoutDesktop';
import { SignUpForm } from '@components/AuthForm/SignupForm';

export default function SignUp({}) {
  return (
    <AppDefaultLayoutDesktop center={true}>
      <HeadController
        title="Sign Up"
        description="This is a procrastination auth page"
      />
      <SignUpForm />
    </AppDefaultLayoutDesktop>
  );
}
