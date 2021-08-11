import React from 'react';
import { HeadController } from '@components/HeadController';
import { PageDefaultLayout } from '@components/Layout/PageDefaultLayout';
import { Flex, Link } from '@chakra-ui/layout';
import { MdEmail } from 'react-icons/md';
import { useCheckTokenToNavigateDashboard } from '@hooks/useCheckTokenToNavigateDashboard';
import { LoadingUI } from '@components/UI/LoadingUI';

export default function Contact({}) {
  const { isCheckedToken } = useCheckTokenToNavigateDashboard();

  if (!isCheckedToken) {
    return <LoadingUI />;
  }

  return (
    <PageDefaultLayout>
      <HeadController
        title="Contact"
        description="A page for contact information"
      />
      <Flex as="main" minH="80vh" alignItems="center">
        <Link href="mailto: yw03860@gmail.com">
          <MdEmail size="400px" />
        </Link>
      </Flex>
    </PageDefaultLayout>
  );
}
