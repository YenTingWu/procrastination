import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import App from '@screens/App';
import { useMounted } from '@hooks/useMounted';
import { isServer } from 'src/lib/isServer';

//  const DynamicApp = dynamic(() => import('@screens/App'), { ssr: false });
/**
 * This Page has to get data with auth
 * ex. Authentication: Bearer ${token}
 * 1. If no accessToken exists or is unable to verify, request a new accessToken via refreshToken from server
 * 2. If both tokens do not exist and are unable to verify, redirect back to the landing page
 *
 */

/**
 * ## Calender
 * @returns
 */

/**
 * For provider
 */

export default function Index() {
  const router = useRouter();
  const { hasMounted } = useMounted();

  if (!hasMounted) {
    return null;
  }

  return <App />;
}
