import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';

export interface HeaderControllerProps {
  title?: string;
  description?: string;
}

/**
 * ## HeaderController
 * @param props  description, title
 * @returns React.FC
 */

export const HeadController: NextPage<HeaderControllerProps> = ({
  title,
  description,
}) => {
  const appName = 'Procrastination';

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, user-scalable=no, user-scalable=0"
      />
      <title>{title ? `${title} | ${appName}` : appName}</title>
      <meta
        name="description"
        content={
          description ||
          'Procrastination is a productive app for procrastinators'
        }
      />
      <meta name="application-name" content={appName} />
      <meta
        property="og:title"
        content={`${appName} - A productive app for procrastinators`}
      />
      <meta
        property="og:description"
        content={`${appName} lets you have a chance to procrastinate every schedule, but also makes you more easy-going in your live`}
      />
      <meta property="og:site_name" content={appName} />
      <meta property="og:type" content="website" />
    </Head>
  );
};
