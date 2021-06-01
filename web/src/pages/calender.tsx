import React from 'react';
import { Flex } from '@chakra-ui/react';
import { useQuery, useQueries } from 'react-query';

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

export default function Calender() {
  return <Flex>HIHIHIHIHIHIHIHIHI, this is calender</Flex>;
}
